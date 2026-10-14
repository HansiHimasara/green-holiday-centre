"use client";

import { useState, useRef } from "react";

const photos = ["/images/Hero Section.png", "/images/sri-lanka-cta.jpg", "/images/sri-lanka-cta2.jpg"];

export default function HeroGallery() {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const move = (direction: number) => setIndex((current) => (current + direction + photos.length) % photos.length);
  return (
    <div className="absolute inset-0" onTouchStart={(event) => { touchX.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => { if (touchX.current !== null) { const delta = event.changedTouches[0]?.clientX - touchX.current; if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1); touchX.current = null; } }}>
      {photos.map((photo, position) => (
        <div key={photo} role="img" aria-label={`Sri Lanka travel photo ${position + 1}`}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${index === position ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url("${photo}")` }} />
      ))}
      <div className="absolute bottom-5 right-6 z-20 flex gap-2">
        <button aria-label="Previous photo" onClick={() => move(-1)} className="rounded-full bg-black/40 px-3 py-2 text-white">←</button>
        <button aria-label="Next photo" onClick={() => move(1)} className="rounded-full bg-black/40 px-3 py-2 text-white">→</button>
      </div>
    </div>
  );
}