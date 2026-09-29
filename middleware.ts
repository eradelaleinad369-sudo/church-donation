import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Protects every /admin/* route except /admin/login by checking the
// signed session cookie set in app/api/admin/login/route.ts.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  try {
    jwt.verify(token, process.env.ADMIN_SESSION_SECRET as string);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = { matcher: ["/admin/:path*"] };
