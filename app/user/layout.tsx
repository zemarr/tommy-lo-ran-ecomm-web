import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import MainNav from "./components/main-nav";
import Header from "../../components/shared/header/header";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";

const links = [
  {
    title: 'Orders',
    href: '/user/orders',
  },
  {
    title: 'Profile',
    href: '/user/profile',
  },
]

export default async function UserLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <>
      <SessionProvider session={session}>
        <div className="font-sans antialiased">
          <Header />
          <div className={"flex-1 space-y-4 mx-auto max-w-10xl px-6 lg:px-14 min-h-screen"}>
            {children}
          </div>
          {/* <Footer /> */}
        </div>
      </SessionProvider>
    </>
  )
}