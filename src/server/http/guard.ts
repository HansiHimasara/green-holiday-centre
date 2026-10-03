import { readProfilePhoto } from "./profilePhoto";
import { HttpError, readJson, validateBody } from "./validation";

type Actor = { role: string; status: string } | null;
export function authorize(actor: Actor, superAdmin = false) {
  if (!actor || actor.status !== "ACTIVE") throw new HttpError(401, "Not authenticated.");
  if (superAdmin ? actor.role !== "SUPER_ADMIN" : !["ADMIN", "SUPER_ADMIN"].includes(actor.role)) throw new HttpError(403, "You do not have permission for this action.");
}
export function verifyOrigin(request: Request) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return;
  if (request.headers.get("sec-fetch-site") === "cross-site") throw new HttpError(403, "Cross-site requests are not allowed.");
  const origin = request.headers.get("origin");
  const allowed = new Set([new URL(request.url).origin]);
  if (process.env.APP_BASE_URL) allowed.add(new URL(process.env.APP_BASE_URL).origin);
  if (origin && !allowed.has(origin)) throw new HttpError(403, "Invalid request origin.");
}
// Single-process protection. Use a shared reverse-proxy/Redis limiter when running multiple instances.
const attempts = new Map<string, { count: number; until: number }>();
export function consumeLimit(key: string, max: number, now = Date.now()) {
  for (const [id, value] of attempts) if (value.until <= now) attempts.delete(id);
  let value = attempts.get(key);
  if (!value) {
    if (attempts.size >= 10000) throw new HttpError(429, "Too many requests. Try again later.");
    value = { count: 0, until: now + 15 * 60 * 1000 };
    attempts.set(key, value);
  }
  if (++value.count > max) throw new HttpError(429, "Too many attempts. Please try again in 15 minutes.");
}
export function withApi<T extends (...args: never[]) => Promise<Response>>(handler: T, path: string) {
  return async (...args: Parameters<T>): Promise<Response> => {
    try {
      const request = args[0] as Request | undefined;
      if (request) verifyOrigin(request);
      if (path.startsWith("/api/admin/") || path === "/api/auth/me") {
        const { getCurrentUser } = await import("../auth/session");
        authorize(await getCurrentUser(), path.startsWith("/api/admin/users"));
      }
      if (request && ["POST", "PATCH", "PUT"].includes(request.method) && !["/api/auth/logout", "/api/cron/cancel-unpaid", "/api/booking-payment"].includes(path)) {
        // Validate a clone before a handler can coerce input or change the database.
        const body = await readJson(request.clone());
        validateBody(body, path);
        if (path === "/api/auth/me" && Object.hasOwn(body as object, "photo")) readProfilePhoto((body as Record<string, unknown>).photo);
        if (!path.startsWith("/api/admin/") && path !== "/api/auth/me") {
          const record = body as Record<string, unknown>;
          const email = typeof record.email === "string" ? record.email.toLowerCase().trim() : "";
          // Only trust an IP header if a trusted proxy replaces it (see SETUP.md).
          const ip = process.env.TRUST_PROXY === "true" ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown" : "local";
          consumeLimit(`${path}:ip:${ip}`, path.includes("/auth/") ? 50 : 120);
          if (email) consumeLimit(`${path}:email:${email}`, path.includes("/auth/") ? 10 : 30);
        }
      }
      const response = await handler(...args);
      response.headers.set("Cache-Control", "no-store");
      response.headers.set("X-Content-Type-Options", "nosniff");
      return response;
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 503;
      if (!(error instanceof HttpError)) console.error("API request failed:", error);
      return Response.json({ error: error instanceof HttpError ? error.message : "The service is temporarily unavailable. Please try again." }, {
        status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "900" } : {}) },
      });
    }
  };
}
