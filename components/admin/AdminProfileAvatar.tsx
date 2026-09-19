import Image from "next/image";

interface AdminProfileAvatarProps {
  name?: string;
  image?: string;
  size?: "small" | "medium" | "large";
}

const sizes = {
  small: 32,
  medium: 40,
  large: 72,
};

export default function AdminProfileAvatar({
  name = "Super Admin",
  image,
  size = "small",
}: AdminProfileAvatarProps) {
  const dimension = sizes[size];

  if (image) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full border border-[var(--border-light)] bg-gray-100"
        style={{
          width: dimension,
          height: dimension,
        }}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-[var(--green-dark)] font-bold text-white"
      style={{
        width: dimension,
        height: dimension,
        fontSize: size === "large" ? 20 : 12,
      }}
    >
      {initials}
    </div>
  );
}