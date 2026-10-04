export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
export function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function validPhone(value: string) {
  return /^\+?[0-9]{7,15}$/.test(value.replace(/[\s().-]/g, ""));
}
export function parseVehicleRate(value: unknown) {
  if (typeof value !== "number" && typeof value !== "string") return NaN;
  const text = String(value).trim();
  if (!/^(?:Rs\.\s*)?\d+(?:\.\d{1,2})?(?:\s*\/km)?$/i.test(text)) return NaN;
  const rate = Number(text.replace(/^Rs\.\s*/i, "").replace(/\s*\/km$/i, ""));
  return Number.isSafeInteger(rate) && rate > 0 && rate <= 1000000 ? rate : NaN;
}
export function validateBody(body: unknown, path: string) {
  if (!isRecord(body)) throw new HttpError(400, "Send a JSON object.");
  const limits: Record<string, number> = {
    email: 254, password: 128, confirmPassword: 128, token: 512,
    fullName: 120, name: 120, username: 50, phone: 40, contact: 40,
    passport: 20, passportNumber: 20, nationality: 100, address: 500,
    pickupLocation: 500, dropoffLocation: 500, flightNumber: 30,
    specialRequests: 2000, specialRequirements: 2000, message: path === "/api/contact" ? 5000 : 2000,
    feedback: 2000, model: 120, description: 2000, imageUrl: 2048,
    bookingReference: 80, transmission: 60, fuelType: 60, status: 30,
    serviceType: 30, travelDate: 10, returnDate: 10,
  };
  for (const [key, max] of Object.entries(limits)) {
    const value = body[key];
    if (value === undefined || value === null) continue;
    if (typeof value !== "string" || value.length > max || value.includes("\0")) {
      throw new HttpError(400, `${key} must be text with at most ${max} characters.`);
    }
  }
  for (const key of ["remember", "reservationOnly"]) {
    if (body[key] !== undefined && typeof body[key] !== "boolean") throw new HttpError(400, `${key} must be true or false.`);
  }
  if (path === "/api/bookings" && body.customer !== undefined) {
    if (!isRecord(body.customer)) throw new HttpError(400, "Invalid customer details.");
    validateBody(body.customer, path);
  }
  if (body.destinations !== undefined && (!Array.isArray(body.destinations) || body.destinations.length > 30 || body.destinations.some(v => typeof v !== "string" || !v.trim() || v.length > 500))) {
    throw new HttpError(400, "Enter up to 30 valid destinations.");
  }
  if (body.waypoints !== undefined && (!Array.isArray(body.waypoints) || body.waypoints.length > 30 || body.waypoints.some(v => typeof v !== "string" || !v.trim() || v.length > 500))) throw new HttpError(400, "Enter up to 30 valid waypoints.");
  for (const key of ["vehicleTypeId", "passengers", "luggage", "passengerCount", "luggageCount", "numberOfNights", "rating"]) {
    const value = body[key];
    if (value === undefined || value === null || value === "") continue;
    if ((typeof value !== "number" && typeof value !== "string") || !/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) > 2147483647) {
      throw new HttpError(400, `${key} must be a valid whole number.`);
    }
  }
  for (const key of ["phone", "contact"]) {
    if (typeof body[key] === "string" && body[key] && !validPhone(body[key])) throw new HttpError(400, "Enter a valid phone number (7–15 digits).");
  }
  if (typeof body.username === "string" && !/^[a-zA-Z0-9_.-]{3,50}$/.test(body.username.trim())) throw new HttpError(400, "Username must contain 3–50 letters, digits, dots, underscores or hyphens.");
  if (typeof body.email === "string" && body.email && !validEmail(body.email.trim())) throw new HttpError(400, "Enter a valid email address.");
  if (path.startsWith("/api/admin/feedback") && body.status !== undefined && !["visible", "hidden"].includes(String(body.status))) throw new HttpError(400, "Invalid feedback visibility.");
}

export async function readJson(request: Request) {
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) throw new HttpError(415, "Use application/json.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "A JSON body is required.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  // Leave room for a 2 MB profile photo encoded as base64, plus JSON overhead.
  const maxLength = new URL(request.url).pathname === "/api/auth/me" ? 3 * 1024 * 1024 : 64 * 1024;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxLength) { void reader.cancel(); throw new HttpError(413, "Request is too large."); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown; }
  catch { throw new HttpError(400, "Invalid JSON body."); }
}
