// proxy.ts
import { NextRequest, NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { auth } from "./auth"

export async function proxy(req: NextRequest) {
  const session = await auth()

  if (!session && req.nextUrl.pathname.startsWith("/checkout")) {
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("callbackUrl", "/checkout")
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/checkout/:path*"],
}