import React from "react"
import type { Metadata } from 'next'
import '@/app/globals.css'
import '@/styles/photography.css'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: 'Tómmy ló ràn | Collections',
  description: 'Rooted in culture. Tailored for now. Discover contemporary menswear inspired by African heritage, crafted with intentional artistry and timeless elegance.',
}

export default function CheckoutRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="font-sans antialiased">
        <Header />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  )
}
