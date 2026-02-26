import React from "react"
import type { Metadata } from 'next'
import Header from "@/components/shared/header/header";


export const metadata: Metadata = {
  title: 'Tómmy ló ràn | Collections',
  description: 'Rooted in culture. Tailored for now. Discover contemporary menswear inspired by African heritage, crafted with intentional artistry and timeless elegance.',
}

export const revalidate = 0;

export default function CartRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="font-sans antialiased">
      <Header />
      <div className={"flex-1 space-y-4 mx-auto max-w-10xl px-6 lg:px-14"}>
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  )
}
