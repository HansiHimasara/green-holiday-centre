// Runs a disposable PostgreSQL-compatible database. Never reads or mutates a live database.
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';
async function freePort() {
  const s = net.createServer(); s.listen(0, '127.0.0.1'); await once(s, 'listening');
  const port = s.address().port; await new Promise(r => s.close(r)); return port;
}
const dbPort = await freePort();
const appPort = await freePort();
const database = await PGlite.create();
const socket = new PGLiteSocketServer({ db: database, port: dbPort, host: '127.0.0.1' });
await socket.start();
const env = { ...process.env, DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:${dbPort}/postgres`,
  APP_BASE_URL: `http://127.0.0.1:${appPort}`, TEST_BASE_URL: `http://127.0.0.1:${appPort}`,
  TEST_DATABASE_ISOLATED: 'true', SMTP_HOST: '', SMTP_USER: '', SMTP_PASS: '',
  BOOKING_LINK_SECRET: 'isolated-integration-test-key-at-least-32-characters', CRON_SECRET: 'isolated-test-cron-key',
  TRUST_PROXY: 'false', OPENROUTESERVICE_API_KEY: 'test-only', AIRPORT_TRANSFER_MARKUP_LKR: '300', DAY_TOUR_MARKUP_LKR: '300', ROUND_TOUR_MARKUP_LKR: '300', LKR_PER_USD: '300', EXCHANGE_RATE_API_KEY: '', NEXT_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1',
};
function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { env, stdio: 'inherit' });
    child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Command failed (${code}): ${args.join(' ')}`)));
  });
}
// Keep cleanup bounded: a lingering PostgreSQL socket must not leave a
// completed isolated test run with Node's unsettled-top-level-await exit 13.
async function finishWithin(label, action, timeoutMs = 5000) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(action),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}


const { readFileSync } = await import('node:fs');
const assert = (await import('node:assert/strict')).default;
const resetSql = readFileSync(new URL('./reset-real-fleet.sql', import.meta.url), 'utf8');
let failure;
try {
 await run(['node_modules/prisma/dist/prisma.js', 'db', 'init', '--no-interactive']);
 await database.exec(`
 INSERT INTO "user" ("fullName",email,"passwordHash",role,status,"updatedAt") VALUES
 ('Keep Admin','admin@example.test','keep-hash','SUPER_ADMIN','ACTIVE',now()),
 ('Keep Disabled','disabled@example.test','keep-disabled-hash','ADMIN','DISABLED',now());
 INSERT INTO "session" ("userId","tokenHash","expiresAt") VALUES (1,'session',now());
 INSERT INTO "passwordResetToken" ("userId","tokenHash","expiresAt") VALUES (1,'reset',now());
 INSERT INTO "vehicleType" (name,"passengerCapacity","luggageCapacity","updatedAt") VALUES ('Mock',2,2,now());
 INSERT INTO "customer" ("fullName",email,phone,"updatedAt") VALUES ('Mock','mock@example.test','000',now());
 INSERT INTO "booking" ("bookingReference","customerId","vehicleTypeId","serviceType","travelDate","passengerCount","totalAmount","updatedAt")
 VALUES ('MOCK',1,1,'DAY_TOUR','2026-12-01',2,50,now());
 INSERT INTO "bookingDestination" ("bookingId","nightNumber",destination) VALUES (1,1,'Mock');
 INSERT INTO "payment" ("bookingId",amount,"updatedAt") VALUES (1,50,now());
 INSERT INTO "feedback" ("customerId","bookingId","fullName",rating,message,"updatedAt") VALUES (1,1,'Mock',5,'Mock',now());
 INSERT INTO "pricing" ("fromLocation","toLocation",kilometres,"extraKilometreCharge","updatedAt") VALUES ('A','B',10,90,now());
 INSERT INTO "contactMessage" (name,email,message,"updatedAt") VALUES ('Mock','mock@example.test','Mock',now());
 `);
 const tables = ['user','session','passwordResetToken','vehicleType','customer','booking','bookingDestination','payment','feedback','pricing','contactMessage'];
 const snapshot = async () => Object.fromEntries(await Promise.all(tables.map(async t => [t,(await database.query(`SELECT * FROM "${t}" ORDER BY id`)).rows])));
 const before = await snapshot();
 const broken = resetSql.replace('COMMIT;', "SELECT 1/0; COMMIT;");
 await assert.rejects(database.exec(broken));
 await database.exec('ROLLBACK;');
 assert.deepEqual(await snapshot(), before, 'Failure must preserve every original row');
 await database.exec(resetSql);
 const after = await snapshot();
 assert.deepEqual(after.user,before.user,'Every user field must remain identical');
 for (const t of tables.filter(t => !['user','vehicleType'].includes(t))) assert.equal(after[t].length,0,t);
 assert.deepEqual(after.vehicleType.map(v => [v.name,v.passengerCapacity,v.luggageCapacity,v.ratePerKm,v.driverBattaPerDayLkr]),[
 ['Sedan Car',2,2,90,5500],['Benz Vito',4,4,330,8000],['Flat Roof',4,4,120,5500],['Mini Coach',12,8,160,5500]]);
 assert(after.vehicleType.every(v => v.id > 1), 'New vehicles must not reuse deleted IDs');
 for (const v of after.vehicleType) assert(readFileSync(new URL('../public'+v.imageUrl,import.meta.url)).length > 0);
 console.log('PASS: actual project schema; all users unchanged; all ten other tables reset; four vehicles correct; failures roll back; IDs not reused; assets exist.');
} catch (error) { failure=error; console.error(error); }
finally {
 for (const [label,action] of [['socket',()=>socket.stop()],['database',()=>database.close()]]) {
  try { await finishWithin(label,action); } catch {}
 }
}
process.exit(failure ? 1 : 0);
