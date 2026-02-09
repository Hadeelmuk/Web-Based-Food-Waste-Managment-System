// Lightweight middleware: allow all requests to reach the route handlers.
// We rely on the per-route x-user-id guards in /api/_auth instead of NextAuth.
import { NextResponse } from "next/server"

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
