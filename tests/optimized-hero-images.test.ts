import { test } from "node:test";
import assert from "node:assert/strict";
import { statSync, readFileSync } from "node:fs";

test("hero and CTA use optimized WebP images instead of original 5 MB JPGs", () => {
  for (const name of ["sri-lanka-cta", "sri-lanka-cta2"]) {
    assert.ok(statSync(`public/images/${name}.webp`).size < 1_500_000, `${name}.webp should be below 1.5 MB`);
  }
  const home = readFileSync("app/page.tsx", "utf8");
  const gallery = readFileSync("components/home/HeroGallery.tsx", "utf8");
  assert.doesNotMatch(home + gallery, /sri-lanka-cta2?\.jpg/);
  assert.match(home + gallery, /sri-lanka-cta\.webp/);
});
