import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/db/prisma";
import CredentiialsProvider from "next-auth/providers/credentials"
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth"
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PROTECTED_ROUTES } from "./lib/constants";
import { calculateCartPrices } from "./lib/server/actions/cart.actions";
import { CartItem } from "./types";
import { authConfig } from "./auth.config";

export const config = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentiialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        const user = await prisma.user.findFirst({
          where: { email }
        })

        // check the user exists and password is correct
        if (!user || !user.password) return null;

        const isMatch = compareSync(password as string, user.password);

        if (!isMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // set the session user id and role
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
        session.user.name = token.name;
      }

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
        if (user.name === "NO_NAME") {
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

        // check if trigger is sign in or sign up and get the user's session cart from the users' cookies
        if (trigger === "signIn" || trigger === "signUp") {
          const cookieStore = await cookies();
          const sessionCartId = cookieStore.get("sessionCartId")?.value;

          if (!sessionCartId) return token;

          const sessionCart = await prisma.cart.findFirst({
            where: { sessionCartId },
          });

          if (!sessionCart) return token;

          let userCart = await prisma.cart.findFirst({
            where: { userId: user.id },
          });

          if (!userCart) {
            // 🔥 No existing user cart → assign session cart
            await prisma.cart.update({
              where: { id: sessionCart.id },
              data: { userId: user.id },
            });
          } else {
            // 🔥 Merge carts
            // 1️⃣ Start with existing user cart items
            const mergedItems: CartItem[] = [
              ...(userCart.items as CartItem[]),
            ];

            // 2️⃣ Normalize session items
            const sessionItems = sessionCart.items as CartItem[];

            // 3️⃣ Collect all product IDs from session cart
            const sessionProductIds = sessionItems.map(
              item => item.productId
            );

            // 4️⃣ Fetch stock for ALL products in one query
            const products = await prisma.product.findMany({
              where: { id: { in: sessionProductIds } },
              select: { id: true, stock: true },
            });

            // 5️⃣ Build quick lookup map
            const stockMap = new Map(products.map(p => [p.id, p.stock]));

            // 6️⃣ Merge safely using stockMap
            for (const sessionItem of sessionItems) {
              const existingIndex = mergedItems.findIndex(
                i => i.productId === sessionItem.productId
              );

              const maxAllowed = stockMap.get(sessionItem.productId) ?? 0;

              if (existingIndex > -1) {
                const newQty =
                  mergedItems[existingIndex].quantity + sessionItem.quantity;

                mergedItems[existingIndex].quantity = Math.min(newQty, maxAllowed);
              } else {
                mergedItems.push({
                  ...sessionItem,
                  quantity: Math.min(sessionItem.quantity, maxAllowed),
                });
              }
            }

            // 7️⃣ Recalculate totals
            const prices = await calculateCartPrices(mergedItems);

            // 8️⃣ Update user cart
            await prisma.cart.update({
              where: { id: userCart.id },
              data: {
                items: mergedItems,
                ...prices,
              },
            });

            // 9️⃣ Delete session cart
            if (sessionCart?.id) {
              await prisma.cart.delete({ where: { id: sessionCart.id } });
            }
          }
        }
      }

      // handle session updates
      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config)