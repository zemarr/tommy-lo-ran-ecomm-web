import React from 'react'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation';
import { getOrderById } from '@/lib/server/actions/order.actions';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';
import OrderDetails from '../components/order-details';

export const metadata: Metadata = {
  title: `Order Details`
}

const OrderDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  const user = session?.user;

  if (!user) redirect('/shop')

  return (
    <div className={"mt-30"}>
      {/* {id} */}
      <OrderDetails
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
          itemsPrice: order.itemsPrice.toString(),
          totalPrice: order.totalPrice.toString(),
          shippingPrice: order.shippingPrice.toString(),
          taxPrice: order.taxPrice.toString(),
          orderItems: order.orderItems.map((item) => ({
            ...item,
            price: item.price.toString(),
          })),
          paidAt: order.paidAt ?? new Date(0),
          deliveredAt: order.deliveredAt ?? new Date(0),
        }}
        paystackPublicKey={process.env.PAYSTACK_PUBLIC_KEY || "pk"}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user?.role === 'admin' || false}
      />
    </div>
  )
}

export default OrderDetailsPage