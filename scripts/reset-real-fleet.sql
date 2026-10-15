-- Executed only by reset-real-fleet.sh after a successful full database backup.
BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '60s';
LOCK TABLE public."user" IN SHARE MODE;
LOCK TABLE public."session", public."passwordResetToken", public."customer",
 public."vehicleType", public."booking", public."bookingDestination", public."pricing",
 public."payment", public."feedback", public."contactMessage" IN ACCESS EXCLUSIVE MODE;
CREATE TEMP TABLE preserved_users ON COMMIT DROP AS SELECT * FROM public."user";
DELETE FROM public."feedback";
DELETE FROM public."payment";
DELETE FROM public."bookingDestination";
DELETE FROM public."booking";
DELETE FROM public."customer";
DELETE FROM public."pricing";
DELETE FROM public."contactMessage";
DELETE FROM public."session";
DELETE FROM public."passwordResetToken";
DELETE FROM public."vehicleType";
-- Do not restart sequences: old booking drafts must not match new vehicles.
INSERT INTO public."vehicleType"
 (name, description, "passengerCapacity", "luggageCapacity", "ratePerKm",
  "driverBattaPerDayLkr", transmission, "fuelType", "airConditioning",
  "chauffeurIncluded", "chauffeurLanguage", "imageUrl", status, "updatedAt")
VALUES
 ('Sedan Car', 'Comfortable sedan for up to 2 guests and approximately 2 standard bags. Representative illustration; luggage space and vehicle specifications should be confirmed before travel.',
  2, 2, 90, 5500, 'Automatic', 'Petrol', true, true, NULL, '/images/vehicles/sedan-car.png', 'ACTIVE', now()),
 ('Benz Vito', 'Spacious Mercedes-Benz Vito passenger van for up to 4 guests and approximately 4 standard bags. Representative illustration; luggage space and vehicle specifications should be confirmed before travel.',
  4, 4, 330, 8000, 'Automatic', 'Diesel', true, true, NULL, '/images/vehicles/benz-vito.png', 'ACTIVE', now()),
 ('Flat Roof', 'Low-roof passenger van for up to 4 guests and approximately 4 standard bags. Representative illustration; luggage space and vehicle specifications should be confirmed before travel.',
  4, 4, 120, 5500, 'Manual', 'Diesel', true, true, NULL, '/images/vehicles/flat-roof.png', 'ACTIVE', now()),
 ('Mini Coach', 'Compact coach for up to 12 guests and approximately 8 standard bags. Representative illustration; luggage space and vehicle specifications should be confirmed before travel.',
  12, 8, 160, 5500, 'Manual', 'Diesel', true, true, NULL, '/images/vehicles/mini-coach.png', 'ACTIVE', now());
DO $$
BEGIN
 IF EXISTS ((SELECT * FROM public."user" EXCEPT SELECT * FROM preserved_users)
 UNION ALL (SELECT * FROM preserved_users EXCEPT SELECT * FROM public."user")) THEN
  RAISE EXCEPTION 'User preservation check failed';
 END IF;
 IF (SELECT count(*) FROM public."vehicleType") <> 4 THEN
  RAISE EXCEPTION 'Expected exactly four vehicles';
 END IF;
END $$;
SELECT name, "passengerCapacity", "luggageCapacity", "ratePerKm", "driverBattaPerDayLkr"
 FROM public."vehicleType" ORDER BY id;
COMMIT;
