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
  TRUST_PROXY: 'false', OPENROUTESERVICE_API_KEY: 'test-only', AIRPORT_TRANSFER_MARKUP_LKR: '300', DAY_TOUR_MARKUP_LKR: '300', ROUND_TOUR_MARKUP_LKR: '300', LKR_PER_USD: '300', NEXT_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1',
};
function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { env, stdio: 'inherit' });
    child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Command failed (${code}): ${args.join(' ')}`)));
  });
}
let app;
try {
  await run(['node_modules/prisma/dist/prisma.js', 'db', 'init', '--no-interactive']);
  // Fixtures are inserted into the temporary database only.
  const { scryptSync, createHash } = await import('node:crypto');
  const password = 'Integration-password-47';
  const salt = '00112233445566778899aabbccddeeff';
  const hash = `scrypt$16384$8$1$${salt}$${scryptSync(password, salt, 64).toString('hex')}`;
  await database.query(`INSERT INTO "user" ("fullName", username, email, "passwordHash", role, status, "updatedAt") VALUES
    ('Test Super','testsuper','super@example.test',$1,'SUPER_ADMIN','ACTIVE',now()),
    ('Test Admin','testadmin','admin@example.test',$1,'ADMIN','ACTIVE',now()),
    ('Disabled','disabled','disabled@example.test',$1,'ADMIN','DISABLED',now())`, [hash]);
  await database.query(`INSERT INTO "vehicleType" (name, "passengerCapacity", "luggageCapacity", "ratePerKm", "updatedAt") VALUES ('Fixture Vehicle', 4, 2, 150, now())`);
  await database.query(`INSERT INTO "customer" ("fullName", email, phone, "passportNumber", "updatedAt") VALUES ('Original Guest', 'owner@example.test', '+94770000000', 'A123456', now())`);
  await database.query(`INSERT INTO "vehicleType" (name, "passengerCapacity", "luggageCapacity", "ratePerKm", "updatedAt") VALUES ('Unpriced Vehicle', 4, 2, 0, now())`);
  const expired = createHash('sha256').update('x'.repeat(43)).digest('hex');
  await database.query(`INSERT INTO "session" ("userId", "tokenHash", "expiresAt") SELECT id, $1, now() - interval '1 hour' FROM "user" WHERE email='admin@example.test'`, [expired]);
  const reset = createHash('sha256').update('r'.repeat(43)).digest('hex');
  await database.query(`INSERT INTO "passwordResetToken" ("userId", "tokenHash", "expiresAt") SELECT id, $1, now() + interval '30 minutes' FROM "user" WHERE email='admin@example.test'`, [reset]);
  app = spawn(process.execPath, ['--import', './tests/integration/network-fixtures.mjs', 'node_modules/next/dist/bin/next', 'start', '-p', String(appPort), '-H', '127.0.0.1'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = ''; app.stdout.on('data', c => { logs += c; }); app.stderr.on('data', c => { logs += c; });
  let ready = false;
  for (let n = 0; n < 100; n++) {
    try { const response = await fetch(env.TEST_BASE_URL + '/api/auth/me'); if (response.status === 401) { ready = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  if (!ready) throw new Error('App failed to start: ' + logs);
  try { await run(['--import', 'tsx', '--test', 'tests/integration/api.test.ts']); }
  catch (error) { console.error(logs); throw error; }
} finally {
  if (app) { app.kill('SIGTERM'); await once(app, 'exit').catch(() => {}); }
  await socket.stop(); await database.close();
}
