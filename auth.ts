import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/db/prisma";
import CredentiialsProvider from "next-auth/providers/credentials"
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth"
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PROTECTED_ROUTES } from "./lib/constants";

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentiialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email } = credentials as { email: string; password: string }
        const user = await prisma.user.findFirst({
          where: {
            email: email as string,
          }
        })

        // check the user exists and password is correct
        if (user && user.password) {
          const isMatch = compareSync(credentials?.password as string, user.password)

          if (!isMatch) {
            throw new Error("Invalid password")
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        }
        // return null if user does not exist or passwords do not match
        return null
      }
    })
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // set the session user id and role
      session.user.id = token.sub as string
      session.user.role = token.role;
      session.user.name = token.name;

      // console.log("Session", session);

      // if there is an update trigger, set the user name
      if (trigger === "update" && user) {
        session.user.name = user.name
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // assign user fields to the token
      // set the user id and role
      if (user) {
        token.id = user.id
        token.role = user.role

        // if use has no name use the name part of their email
        if (user.name = "NO_NAME") {
          const email = user.email as string
          const name = email!.split("@")[0];
          token.name = name.charAt(0).toUpperCase() + name.slice(1)
          // update db to refelct tooken name
          await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              name: token.name
            }
          })
        }

        // check if trigger is sign in or sign up and get  the user's session cart from the users' cookies
        // if (trigger === "signIn" || trigger === "signUp") {
        //   const cookiesObject = await cookies();
        //   const sessionCartId = cookiesObject.get('sessionCartId')?.value;

        //   if (sessionCartId) {
        //     const sessionCart = await prisma.cart.findFirst({
        //       where: { sessionCartId }
        //     });

        //     if (sessionCart) {
        //       // delete current cart for user
        //       await prisma.cart.deleteMany({
        //         where: {
        //           userId: user.id
        //         }
        //       })

        //       // assign new cart
        //       await prisma.cart.update({
        //         where: {
        //           id: sessionCart.id
        //         },
        //         data: { userId: user.id },
        //       })
        //     }
        //   }
        // }
      }

      // handle session updates
      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name
      }
      return token;
    },
    authorized({
      request,
      auth
    }: any) {
      // Array of regex patterns for paths we want to protect
      const protectedPaths = PROTECTED_ROUTES;

      // get path name from the request url object
      const { pathname } = request.nextUrl;

      // if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false; //this would send the user to '/sign-in

      // check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {

        // generate neew session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // create new response and add the new headers containing the session cart id
        // and set the cookie
        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // generate a new session cart id and store in the response cookie
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config)