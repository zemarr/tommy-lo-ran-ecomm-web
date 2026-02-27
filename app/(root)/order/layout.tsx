import React from "react"
import type { Metadata } from 'next'
import Header from "@/components/shared/header/header";
import { getMyCart } from "../../../lib/server/actions/cart.actions";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { getUserById } from "../../../lib/server/actions/user.actions";


export const metadata: Metadata = {
  title: 'Tómmy ló ràn | Order',
  description: 'View purchase',
}

export const revalidate = 0;

export default async function OrderRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="font-sans antialiased">
      <Header />
      <div className={"flex-1 space-y-4 mx-auto max-w-10xl px-6 lg:px-16"}>
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  )
}
