import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "mz_admin_session";

function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function getAdminCredentials(): { username: string; password: string } {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "mellizarr-admin",
  };
}

export function verifyAdminPassword(username: string, password: string): boolean {
  const creds = getAdminCredentials();
  const userOk =
    username.length === creds.username.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(creds.username));
  const passOk =
    password.length === creds.password.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(creds.password));
  return userOk && passOk;
}

export function createSessionToken(): string {
  const creds = getAdminCredentials();
  return hashSecret(`${creds.username}:${creds.password}:mellizarr`);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const expected = createSessionToken();
  try {
    return (
      token.length === expected.length &&
      timingSafeEqual(Buffer.from(token), Buffer.from(expected))
    );
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
