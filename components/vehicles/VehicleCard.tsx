import Image from "next/image";
import Button from "@/components/ui/Button";

interface VehicleCardProps {
  name: string;
  image: string;
  passengers: number;
  luggage: number;
  href: string;
}

export default function VehicleCard({
  name,
  image,
  passengers,
  luggage,
  href,
}: VehicleCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">
      {/* Vehicle image */}
      <div className="relative h-[220px] w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Vehicle information */}
      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold text-[var(--green-dark)]">
          {name}
        </h3>

        {/* Passenger and luggage details */}
        <div className="mt-2 flex items-center gap-5 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="7" r="3" />
              <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
            </svg>

            {passengers} Passengers
          </span>

          <span className="flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect
                x="6"
                y="7"
                width="12"
                height="14"
                rx="2"
              />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>

            {luggage} Bags
          </span>
        </div>

        {/* Vehicle details page link */}
        <Button
          href={href}
          className="mt-4 w-full"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}