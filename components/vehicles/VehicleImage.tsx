"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
export default function VehicleImage(props: ImageProps) {
  const [failedSource, setFailedSource] = useState<ImageProps["src"] | null>(null);
  const source = failedSource === props.src ? "/images/vehicle-placeholder.svg" : props.src;
  return <Image {...props} alt={props.alt} src={source} unoptimized onError={() => setFailedSource(props.src)} />;
}
