import { HttpError } from "./validation";
export function readProfilePhoto(value: unknown): string | null {
  if (value === null || value === "") return null;
  if (typeof value !== "string") throw new HttpError(400, "Invalid profile photo.");
  const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) throw new HttpError(400, "Choose a PNG, JPEG or WebP photo.");
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 96 * 1024 || bytes.length < 12) throw new HttpError(400, "Photo must be no larger than 96 KB.");
  const valid = match[1] === "png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    : match[1] === "jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!valid) throw new HttpError(400, "The photo format does not match its contents.");
  return value;
}
