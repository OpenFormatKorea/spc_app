// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes (e.g., /dashboard)
const protectedRoutes = ["/dashboard", "/mypage", "/item", "/campaign"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_standalone");

  // Check if the request is for a protected route
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    // If no token, redirect to the login page
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to proceed if authenticated or not accessing protected routes
  return NextResponse.next();
}

// Optional: Define which paths this middleware applies to
export const config = {
  matcher: ["/dashboard", "/mypage", "/item", "/campaign"], // Add your protected routes here
};
