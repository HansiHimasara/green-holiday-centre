import Image from "next/image";

interface DecorativePatternProps {
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
}

export default function DecorativePattern({
  position,
}: DecorativePatternProps) {
  const positionClasses = {
    "top-left": "-left-28 -top-28 rotate-[160deg]",
    "top-right": "-right-28 -top-28 rotate-[-160deg]",
    "bottom-left": "-left-28 -bottom-28 rotate-[10deg]",
    "bottom-right": "-right-28 -bottom-28 rotate-[-60deg]",
  };

  return (
    <Image
      src="/images/leaf-pattern.png"
      alt=""
      width={360}
      height={360}
      className={`pointer-events-none absolute ${positionClasses[position]} opacity-[0.50]`}
      aria-hidden="true"
    />
  );
}