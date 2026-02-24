import { auth } from "@/auth";
import { getMyCart } from "@/lib/server/actions/cart.actions";
import { getUserById } from "@/lib/server/actions/user.actions";
import { redirect } from "next/navigation";
import { Spinner } from "../../../../components/ui/spinner";

export default async function CheckoutPage() {
  const cart = await getMyCart();

  if (!cart || cart?.items?.length === 0) redirect('/shop');

  const session = await auth();

  if (!session) redirect('/sign-in');

  const userId = session?.user?.id;

  if (!userId) throw new Error('No user id');

  const user = await getUserById(userId);

  if (user && cart?.items?.length > 0) redirect('/checkout/shipping-address');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Spinner className="size-10 mx-auto" />
    </div>
  )
}
