import { Suspense } from "react";
import { getOrderById } from "../../lib/server/actions/order.actions";
import CheckoutSteps from "./checkout-steps";

export default async function CheckoutForm({ user, orderId, isAdmin }: { user: any, orderId?: string, isAdmin: boolean }) {
  const order = await getOrderById(orderId as string);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <CheckoutSteps user={user} order={order} paystackPublicKey={process.env.PAYSTACK_PUBLIC_KEY
        || "pk"}
        // paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={isAdmin} /> */}
    </Suspense>
  )
}