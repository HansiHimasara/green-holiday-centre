import { db } from "@/src/prisma/db";
import { withApi } from "@/src/server/http/guard";
import { verifyReceiptToken } from "@/src/server/bookingLinks";

export const runtime = "nodejs";
async function handleGET(request: Request) {
  const params = new URL(request.url).searchParams;
  const id = Number(params.get("booking"));
  const token = params.get("token") || "";
  if (!Number.isSafeInteger(id) || id < 1 || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return Response.json({ error: "A valid booking confirmation link is required." }, { status: 403 });
  }
  const booking = await db.orm.public.Booking.where({ id }).first();
  if (!booking || !verifyReceiptToken(id, booking.bookingReference, token)) {
    return Response.json({ error: "This booking confirmation link is invalid." }, { status: 403 });
  }
  const vehicle = await db.orm.public.VehicleType.where({ id: booking.vehicleTypeId }).first();
  const destinations = await db.orm.public.BookingDestination.where({ bookingId: id }).all();
  return Response.json({ booking: {
    bookingId: id, bookingReference: booking.bookingReference,
    serviceType: booking.serviceType, vehicleTypeId: booking.vehicleTypeId, vehicleName: vehicle?.name,
    travelDate: booking.travelDate, returnDate: booking.returnDate,
    passengerCount: booking.passengerCount, luggageCount: booking.luggageCount,
    numberOfNights: booking.numberOfNights, pickupLocation: booking.pickupLocation,
    dropoffLocation: booking.dropoffLocation,
    destinations: destinations.sort((a, b) => a.nightNumber - b.nightNumber).map(row => row.destination),
    totalAmount: Number(booking.totalAmount), currency: booking.currency,
    status: booking.status, paymentStatus: booking.paymentStatus,
  } });
}
export const GET = withApi(handleGET, "/api/booking-confirmation");
