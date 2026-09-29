import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET as string);

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    console.log("MIDDLEWARE AUTH FAIL:", err instanceof Error ? err.message : err);
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = { matcher: ["/admin/:path*"] };