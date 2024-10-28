import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is authenticated
  // This is a placeholder. Replace with your actual authentication check
  const isAuthenticated = checkAuthStatus(request);

  // Get the pathname of the request (e.g. /, /profile, /profile/auth)
  const pathname = request.nextUrl.pathname;

  // If the user is not authenticated and trying to access protected routes
  if (
    !isAuthenticated &&
    pathname.startsWith("/profile") &&
    !pathname.startsWith("/profile/auth")
  ) {
    return NextResponse.redirect(new URL("/profile/auth", request.url));
  }

  // If the user is authenticated and trying to access /profile/auth
  if (isAuthenticated && pathname === "/profile/auth") {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Add your protected routes here
export const config = {
  matcher: [
    "/profile",
    "/profile/auth",
    "/profile/edit/:path*",
    "/profile/address/:path*",
    "/profile/orders/:path*",
  ],
};

// This is a placeholder function. Replace with your actual auth check logic
function checkAuthStatus(request: NextRequest): boolean {
  // Example: Check for a session token in cookies
  const sessionToken = request.cookies.get("auth_token") || false; /////////////////////////////// true for protection dev mode.
  return !!sessionToken;
}
