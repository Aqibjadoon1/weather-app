import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/register", "/forgot-password", "/splash", "/location-denied", "/network-error"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname === "/favicon.ico" || pathname.endsWith(".svg") || pathname.endsWith(".png") || pathname.endsWith(".jpg")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const session = request.cookies.get("auth-session")?.value;
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
