
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { CartSidebar } from "@/components/cart-sidebar";
import TommyLoRanText from "../tommy-lo-ran-text";
import { signOutUser } from "../../lib/server/actions/user.actions";
import { Session } from "next-auth";
import UserMenu from "../shared/header/user-menu";
import AdminMobileMenu from "./admin-mobile-menu";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop Products", href: "/admin/products" },
  { name: "Shop Orders", href: "/admin/orders" },
  // { name: "Analytics", href: "/admin/analytics" },
  // { name: "Edit Contents", href: "/admin/edit-content" },
];

export function AdminHeader({ userSession }: { userSession: Session }) {
  const user = userSession?.user;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto max-w-10xl px-6 lg:px-14">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-transparent rounded-md p-1 overflow-hidden">
                <Image src={"https://9f0567cfj6.ufs.sh/f/XHGN3lvVNzO7FDcBZnJ5is1LYfXzQwVjyF48AZCWa3o7cD06"} alt={"TLR_Logo"} width={50} height={50} className={"md:w-[50px] w-[35px] md:h-[50px] h-[35px]"} />
              </div>
              <TommyLoRanText classname="font-cursive text-2xl md:text-3xl tracking-[-1] text-foreground" />
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex lg:items-center lg:gap-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              <Link href="/shop">
                <Button className="bg-charcoal text-cream hover:bg-espresso tracking-[0.15em] uppercase text-xs px-6 py-5">
                  Shop
                </Button>
              </Link>
              {/* User menu */}
              {userSession?.user?.name ? (
                <UserMenu />
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center w-max text-foreground text-xs tracking-[0.2em] leading-4 uppercase p-1 border-b border-espresso"
                // onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-4">
              <AdminMobileMenu user={user} />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
