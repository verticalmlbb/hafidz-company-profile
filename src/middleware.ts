import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const AUTH_COOKIE_NAME = "hafidz_auth_token";
const DEFAULT_SECRET = "hafidz_company_secure_jwt_secret_token_2026";
const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET || DEFAULT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);

  // 1. Proteksi rute /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!cookie || !cookie.value) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(cookie.value, SECRET_KEY);
      if (payload.role !== "admin") {
        // Bukan admin, lempar keluar dari dashboard
        const homeUrl = new URL("/", req.url);
        homeUrl.searchParams.set("error", "unauthorized_role");
        return NextResponse.redirect(homeUrl);
      }
    } catch {
      // Token tidak valid atau kedaluwarsa
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect jika admin sudah login dan mengakses /login atau /register
  if (pathname === "/login" || pathname === "/register") {
    if (cookie && cookie.value) {
      try {
        const { payload } = await jwtVerify(cookie.value, SECRET_KEY);
        if (payload.role === "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      } catch {
        // Token tidak valid, biarkan di halaman login/register
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
