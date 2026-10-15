/** Mastercard Payment Gateway Services: never import this server-only module into client components. */
import { isRecord } from "@/src/server/http/validation";

export type GatewayOrder = Record<string, unknown>;
type GatewayConfig = { origin: string; merchantId: string; password: string; appBaseUrl: string; merchantName: string };
const API_VERSION = "100";

export class GatewayError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

export function gatewayConfig(): GatewayConfig {
  const { MPGS_MERCHANT_ID, MPGS_MERCHANT_PASSWORD, MPGS_GATEWAY_URL, APP_BASE_URL, MPGS_MERCHANT_NAME } = process.env;
  if (!MPGS_MERCHANT_ID || !MPGS_MERCHANT_PASSWORD || !MPGS_GATEWAY_URL || !APP_BASE_URL) {
    throw new GatewayError("Online card payments are not configured. Please contact Green Holiday Centre.", 503);
  }
  let gateway: URL;
  let app: URL;
  try {
    gateway = new URL(MPGS_GATEWAY_URL);
    app = new URL(APP_BASE_URL);
  } catch { throw new GatewayError("Payment gateway configuration is invalid.", 503); }
  // The host must be an actual Mastercard Gateway domain; never fetch a user-provided endpoint.
  if (gateway.protocol !== "https:" || !/(?:^|[.-])gateway\.mastercard\.com$/.test(gateway.hostname) ||
      gateway.username || gateway.password || gateway.search || gateway.hash ||
      !["/", "/api/nvp"].includes(gateway.pathname) ||
      !/^[A-Za-z0-9_-]{1,40}$/.test(MPGS_MERCHANT_ID) ||
      !(app.protocol === "https:" || (app.protocol === "http:" && ["localhost", "127.0.0.1"].includes(app.hostname))) ||
      app.username || app.password || app.search || app.hash) {
    throw new GatewayError("Payment gateway configuration is invalid.", 503);
  }
  return { origin: gateway.origin, merchantId: MPGS_MERCHANT_ID, password: MPGS_MERCHANT_PASSWORD,
    appBaseUrl: app.origin, merchantName: (MPGS_MERCHANT_NAME || "Green Holiday Centre").slice(0, 40) };
}

async function gatewayRequest(config: GatewayConfig, url: string, method: "GET" | "POST", body?: unknown) {
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`merchant.${config.merchantId}:${config.password}`).toString("base64")}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new GatewayError("Unable to reach Mastercard. Please try again.");
  }
  let data: unknown;
  try { data = await response.json(); } catch { throw new GatewayError("The gateway returned an unexpected response."); }
  if (!response.ok || !isRecord(data) || data.result === "ERROR") {
    console.error("MPGS API request failed", { status: response.status, action: method });
    throw new GatewayError("Mastercard could not process the payment request. Please try again.");
  }
  return data;
}

export async function initiateHostedCheckout(args: {
  orderId: string;
  amount: string;
  currency: string;
  email: string;
  returnUrl: string;
}) {
  const config = gatewayConfig();
  const data = await gatewayRequest(config,
    `${config.origin}/api/rest/version/${API_VERSION}/merchant/${encodeURIComponent(config.merchantId)}/session`, "POST", {
      apiOperation: "INITIATE_CHECKOUT",
      checkoutMode: "WEBSITE",
      interaction: {
        operation: "PURCHASE",
        returnUrl: args.returnUrl,
        merchant: { name: config.merchantName },
        style: { accentColor: "#0B6B4B" },
        displayControl: { billingAddress: "HIDE" },
      },
      order: { id: args.orderId, reference: args.orderId, amount: args.amount, currency: args.currency, description: "Green Holiday Centre transport booking" },
      customer: { email: args.email },
    });
  const session = isRecord(data.session) ? data.session : null;
  if (typeof session?.id !== "string" || !session.id) throw new GatewayError("The gateway returned no checkout session.");
  return { sessionId: session.id, orderId: args.orderId,
    checkoutScriptUrl: `${config.origin}/static/checkout/checkout.min.js` };
}

export async function retrieveGatewayOrder(orderId: string): Promise<GatewayOrder> {
  if (!/^GHC-[0-9]+-[A-F0-9]{24}$/.test(orderId)) throw new GatewayError("Invalid gateway order reference.", 400);
  const config = gatewayConfig();
  return gatewayRequest(config,
    `${config.origin}/api/rest/version/${API_VERSION}/merchant/${encodeURIComponent(config.merchantId)}/order/${encodeURIComponent(orderId)}`,
    "GET");
}

/** Only a fully captured USD order for the exact stored amount is accepted. */
export function checkCapturedOrder(data: GatewayOrder, orderId: string, amount: string, currency: string): "PAID" | "FAILED" | "PENDING" {
  if (data.id !== orderId || String(data.currency) !== currency || !Number.isFinite(Number(data.amount)) ||
      Math.round(Number(data.amount) * 100) !== Math.round(Number(amount) * 100)) {
    throw new GatewayError("Gateway order details do not match this reservation. Contact our team.", 409);
  }
  if (data.result === "SUCCESS" && data.status === "CAPTURED" &&
      Number.isFinite(Number(data.totalCapturedAmount)) &&
      Math.round(Number(data.totalCapturedAmount) * 100) === Math.round(Number(amount) * 100)) return "PAID";
  if (["FAILED", "CANCELLED", "DECLINED"].includes(String(data.status))) return "FAILED";
  return "PENDING";
}
