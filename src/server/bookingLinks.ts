import { createHmac, timingSafeEqual } from "node:crypto";

export function paymentLinkToken(id: number, email: string): string {
  const secret = process.env.BOOKING_LINK_SECRET;
  if (!secret || secret.length < 32) throw new Error("BOOKING_LINK_SECRET must be configured (32+ characters).");
  return createHmac("sha256", secret).update(`${id}:${email.toLowerCase()}`).digest("base64url");
}

export function verifyPaymentLink(id: number, email: string, token: string): boolean {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const expected = paymentLinkToken(id, email);
  return token.length === expected.length && timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function receiptToken(id: number, reference: string): string {
  return paymentLinkToken(id, `receipt:${reference}`);
}
export function verifyReceiptToken(id: number, reference: string, token: string): boolean {
  return verifyPaymentLink(id, `receipt:${reference}`, token);
}
