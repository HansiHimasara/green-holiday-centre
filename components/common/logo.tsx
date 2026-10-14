import Image from "next/image";
import Link from "next/link";

type LogoSize = "small" | "medium" | "large";
type LogoVariant = "green" | "white";

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
  href?: string;
  priority?: boolean;
}

const logoSizes = {
  small: {
    width: 150,
    height: 45,
  },
  medium: {
    width: 190,
    height: 60,
  },
  large: {
    width: 250,
    height: 80,
  },
};

const logoImages = {
  green: "/images/greenlogo.png",
  white: "/images/logo.png",
};

export default function Logo({
  size = "medium",
  variant = "green",
  className = "",
  href = "/",
  priority = false,
}: LogoProps) {
  const { width, height } = logoSizes[size];

  return (
    <Link
      href={href}
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src={logoImages[variant]}
        alt="Green Holiday"
        width={width}
        height={height}
        priority={priority}
        className="object-contain"
      />
    </Link>
  );
}