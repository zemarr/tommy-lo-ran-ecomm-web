import React from "react"
import type { Metadata } from 'next'
import Header from "@/components/shared/header/header";


export const metadata: Metadata = {
  title: 'Tómmy ló ràn | Collections',
  description: 'Rooted in culture. Tailored for now. Discover contemporary menswear inspired by African heritage, crafted with intentional artistry and timeless elegance.',
}

export const revalidate = 0;

export default function CheckoutRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="font-sans antialiased">
      <Header />
      {children}
      {/* <Footer /> */}
    </div>
  )
}
