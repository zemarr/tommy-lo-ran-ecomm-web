import type { NextAuthConfig } from "next-auth"

export const authConfig: Partial<NextAuthConfig> = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
}