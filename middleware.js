// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect these routes
  const protectedPaths = [
    "/dashboard",
    "/dashboard/",
    "/dashboard/index",
    "/dashboard/",
    "/my-wishes",
    "/wish/new",
    "/donate",
    "/donate/",
  ];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Supabase stores session token cookie prefixed with "sb:" — check presence of cookie
  // For most Supabase setups cookie name is `sb:token` or `sb:...` depending on adapter.
  const cookie = req.cookies.get("sb:token") || req.cookies.get("sb-session") || req.cookies.get("supabase-auth-token") || null;

  if (!cookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// apply to all routes, middleware will early return if route not protected
export const config = {
  matcher: [
    /*
      You can also restrict with "/dashboard/:path*"
    */
    "/dashboard/:path*",
    "/wish/new",
    "/my-wishes/:path*",
    "/donate/:path*",
  ],
};
