import { auth } from "@/auth";
import CheckoutForm from "@/components/checkout/checkout-form";
import OrderSummary from "@/components/checkout/order-summary";
import { getMyCart } from "@/lib/server/actions/cart.actions";
import { getUserById } from "@/lib/server/actions/user.actions";
import { baseUrl } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export default async function CheckoutPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect('/shop');

  const session = await auth();

  if (!session) redirect('/sign-in');

  const userId = session?.user?.id;

  if (!userId) throw new Error('No user id');

  const user = await getUserById(userId)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-27 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading text-3xl font-medium tracking-tight">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Complete your purchase</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form - Left */}
          <div className="lg:col-span-2">
            <div className="rounded-sm border border-border bg-card pt-4 pb-8 md:px-4 px-4 md:text-base! text-sm!">
              <Suspense>
                <CheckoutForm user={user as any} />
              </Suspense>
            </div>
          </div>

          {/* Order Summary - Right */}
          <div>
            <div className="sticky top-20">
              <Suspense>
                <OrderSummary />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
