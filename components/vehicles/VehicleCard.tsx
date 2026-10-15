import Image from "@/components/vehicles/VehicleImage";
import Button from "@/components/ui/Button";

interface VehicleCardProps {
  name: string;
  image: string;
  passengers: number;
  luggage: number;
  category: string;
  href: string;
  available?: boolean;
}

export default function VehicleCard({
  name,
  image,
  passengers,
  luggage,
  category,
  href,
  available = true,
}: VehicleCardProps) {
  return (
    <div
      data-vehicle-status={available ? "active" : "inactive"}
      className={`
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-[var(--border-light)]
        bg-white/95
        p-0
        transition-[transform,box-shadow,background-color]
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${available
          ? "hover:-translate-y-2 hover:bg-white hover:shadow-[0_22px_50px_rgba(0,0,0,0.22)]"
          : "cursor-not-allowed opacity-60 saturate-50"}
      `}
    >
      {/* Vehicle image */}
      <div className="relative h-[220px] w-full">
        <Image
          src={image}
          unoptimized
          alt={name}
          fill
          sizes="(min-width: 1280px) 390px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />

        {!available && (
          <span className="absolute right-4 top-4 rounded-full bg-[#304F5F] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white shadow-sm">
            Unavailable
          </span>
        )}

        {/* Category badge */}
        <span
          className="
            absolute
            left-4
            top-4
            rounded-full
            bg-[#FFD34E]
            px-3
            py-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-[var(--green-dark)]
            shadow-sm
          "
        >
          {category}
        </span>
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
        {available ? (
          <Button href={href} className="mt-4 w-full">
            View Details
          </Button>
        ) : (
          <span
            aria-label={`${name} is currently unavailable for booking`}
            className="mt-4 flex w-full cursor-not-allowed items-center justify-center rounded-md border border-gray-300 bg-gray-200 px-6 py-3 text-[13px] font-semibold text-gray-600"
          >
            Currently Unavailable
          </span>
        )}
      </div>
    </div>
  );
}