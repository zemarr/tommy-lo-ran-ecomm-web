import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cormorant_Garamond, Great_Vibes } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import '@/styles/photography.css'
import Script from "next/script"
import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cursive"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-accent"
});

export const metadata: Metadata = {
  title: 'Tómmy ló ràn | Modern African Menswear',
  description: 'Rooted in culture. Tailored for now. Discover contemporary menswear inspired by African heritage, crafted with intentional artistry and timeless elegance.',
}

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning={true} className={`${playfair.variable} ${inter.variable} ${cormorant.variable} ${greatVibes.variable}`}>
      <SessionProvider session={session}>
        <body className="font-sans antialiased">
          {children}
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="afterInteractive"
          />
          {/* <Analytics /> */}
        </body>
      </SessionProvider>
    </html>
  )
}
