import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/splash",
  "/location-denied",
  "/network-error",
];

const protectedPrefixes = ["/dashboard", "/api/weather", "/api/forecast"];

const assetExtensions = [".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".css", ".js", ".woff", ".woff2", ".ttf"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guest login via query param — set cookie and redirect cleanly
  if (pathname === "/dashboard" && request.nextUrl.searchParams.get("guest") === "true") {
    const dest = request.nextUrl.clone();
    dest.searchParams.delete("guest");
    const response = NextResponse.redirect(dest);
    response.cookies.set("guest-session", "true", {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  // Always allow static Next.js assets and public paths
  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api/") ||
    publicPaths.includes(pathname) ||
    assetExtensions.some((ext) => pathname.endsWith(ext))
  ) {
    return NextResponse.next();
  }

  // Protect dashboard routes and user-facing API endpoints
  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    const sessionCookie = request.cookies.get("auth-session");
    const guestCookie = request.cookies.get("guest-session");

    if (!sessionCookie?.value && !guestCookie?.value) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
