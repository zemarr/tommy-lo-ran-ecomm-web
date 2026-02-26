// proxy (middleware)

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PROTECTED_ROUTES } from "@/lib/constants";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // 🔐 1️⃣ Protect routes using regex patterns
  if (
    !isAuthenticated &&
    PROTECTED_ROUTES.some((pattern) => pattern.test(pathname))
  ) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 🛒 2️⃣ Ensure sessionCartId cookie exists
  const sessionCartId = req.cookies.get("sessionCartId");

  if (!sessionCartId) {
    const response = NextResponse.next();

    response.cookies.set("sessionCartId", crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [ "/((?!api|_next|favicon.ico).*)" ],
};