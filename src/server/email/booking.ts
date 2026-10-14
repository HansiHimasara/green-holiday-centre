import nodemailer from "nodemailer";

type BookingEmail = {
  to: string;
  name: string;
  reference: string;
  service: string;
  travelDate: string;
  vehicle: string;
  pickup: string;
  dropoff: string;
  amount: number;
  currency: string;
  paymentLink?: string;
};

export async function sendBookingEmail(details: BookingEmail, confirmed = false) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error("Booking email is not configured.");
  }
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 10000,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  const lines = [
    `Hello ${details.name},`,
    confirmed ? "Your payment has been verified and your booking is confirmed." : "Your reservation request has been received. Payment is UNPAID. Online payment is not available yet; contact Green Holiday Centre to arrange payment.",
    `Booking: ${details.reference}`,
    `Service: ${details.service}`,
    `Travel date: ${details.travelDate}`,
    `Vehicle: ${details.vehicle}`,
    `Pickup: ${details.pickup}`,
    `Dropoff: ${details.dropoff}`,
    `Total: ${details.currency} ${details.amount.toFixed(2)}`,
    ...(!confirmed && details.paymentLink ? [`View your reservation: ${details.paymentLink}`] : []),
    "Green Holiday Centre",
  ];
  await transporter.sendMail({
    from: SMTP_FROM,
    to: details.to,
    subject: `${confirmed ? "Booking confirmed" : "Booking reserved"} — ${details.reference}`,
    text: lines.join("\n\n"),
  });
}