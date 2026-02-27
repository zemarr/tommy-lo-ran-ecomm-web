import React from "react"
import type { Metadata } from 'next'
import '@/app/globals.css'
import '@/styles/photography.css'
import { Footer } from "@/components/footer"
import { auth } from "@/auth"
import Header from "@/components/shared/header/header"

export const metadata: Metadata = {
  title: 'Tómmy ló ràn | Collections',
  description: 'Rooted in culture. Tailored for now. Discover contemporary menswear inspired by African heritage, crafted with intentional artistry and timeless elegance.',
}

export const revalidate = 0;

export default async function CollectionsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth();

  return (
    <>
      <Header />
      <div className={"mx-auto max-w-10xl px-6 lg:px-16"}>
        {children}
      </div>
      <Footer />
    </>
  )
}
