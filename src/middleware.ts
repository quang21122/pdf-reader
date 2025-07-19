import { NextResponse } from "next/server";

export async function middleware() {
  // Disable middleware authentication completely to fix redirect loop
  // Let client-side AuthGuard handle authentication
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|auth|login|register|signup|reset-password|forgot-password|logout|terms|privacy).*)",
  ],
};
