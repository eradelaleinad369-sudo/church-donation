import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET as string);

export async function signSession(email: string) {
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { email: string };
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export async function getSession(): Promise<{ email: string } | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySession(token);
}