import React from "react"
import type { Metadata } from 'next'
import Header from "@/components/shared/header/header";


export const metadata: Metadata = {
  title: 'Tómmy ló ràn | Checkout',
  description: '',
}

export default function CheckoutRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <div className="font-sans antialiased">
      <Header />
      <div className={"flex-1 space-y-4 p-4 container mx-auto"}>
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  )
}
