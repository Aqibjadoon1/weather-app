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

    if (!sessionCookie?.value) {
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
