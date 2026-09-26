import {
  randomBytes,
  scrypt,
  timingSafeEqual,
} from "node:crypto";

const KEY_LENGTH = 64;
const N = 16384;
const R = 8;
const P = 1;
const MAX_MEMORY = 64 * 1024 * 1024;

function scryptAsync(
  password: string,
  salt: string,
  keyLength: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      keyLength,
      {
        N,
        r: R,
        p: P,
        maxmem: MAX_MEMORY,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      }
    );
  });
}

export async function hashPassword(
  password: string
): Promise<string> {
  if (password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters."
    );
  }

  const salt = randomBytes(16).toString("hex");

  const derivedKey = await scryptAsync(
    password,
    salt,
    KEY_LENGTH
  );

  return [
    "scrypt",
    N,
    R,
    P,
    salt,
    derivedKey.toString("hex"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  storedPassword: string
): Promise<boolean> {
  try {
    const [
      algorithm,
      nValue,
      rValue,
      pValue,
      salt,
      storedHash,
    ] = storedPassword.split("$");

    if (
      algorithm !== "scrypt" ||
      !nValue ||
      !rValue ||
      !pValue ||
      !salt ||
      !storedHash
    ) {
      return false;
    }

    const expectedHash =
      Buffer.from(storedHash, "hex");

    const actualHash =
      await scryptAsync(
        password,
        salt,
        expectedHash.length
      );

    if (
      expectedHash.length !==
      actualHash.length
    ) {
      return false;
    }

    return timingSafeEqual(
      expectedHash,
      actualHash
    );
  } catch {
    return false;
  }
}