import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET as string;

export function signSession(email: string) {
  return jwt.sign({ email }, SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string): { email: string } | null {
  try {
    return jwt.verify(token, SECRET) as { email: string };
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

export function getSession(): { email: string } | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}
