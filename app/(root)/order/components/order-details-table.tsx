'use client'
import React, { useTransition } from 'react'
import { Order } from '@/types'
import { formatCurrency, formatDateTime, formatError, nairaToKobo } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import Image from 'next/image'
// import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import {
  // createPaypalOrder, 
  // approvePaypalOrder, 
  createPaystackOrder,
  approvePaystackOrder,
  updateCODOrderToPaid,
  deliverOrder
} from '@/lib/server/actions/order.actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

const PaystackButton = dynamic(
  () => import('react-paystack').then(mod => mod.PaystackButton),
  { ssr: false }
)


const OrderDetailsTable = ({ order, paypalClientId, paystackPublicKey, isAdmin }: { order: Omit<Order, 'paymentResult'>; paypalClientId: string; paystackPublicKey: string | null; isAdmin: boolean; }) => {
  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    totalPrice,
    shippingPrice,
    taxPrice,
    paymentMethod,
    // id,
    // createdAt,
    isPaid,
    paidAt,
    isDelivered,
    // deliveredAt
    user

  } = order;

  // const PrintLoadingState = () => {
  //   const [ { isPending, isRejected } ] = usePayPalScriptReducer();
  //   let status = "";

  //   if (isPending) {
  //     status = "Loading PayPal"
  //   } else if (isRejected) {
  //     status = "Error loading PayPal"
  //   }
  //   return status;
  // }

  if (!paystackPublicKey) toast.error("Paystack public key not found");

  const paystackConfig = {
    publicKey: paystackPublicKey || '',
    // token: "test",
    currency: "NGN",
    email: user?.email,
    amount: nairaToKobo(Number(totalPrice)),
    reference: (new Date()).getTime().toString(),
    callback: (data: any) => {
      console.log(data, 'payment data');
    },
    metadata: {
      custom_fields: [
        {
          display_name: 'Email',
          variable_name: 'email',
          value: user?.email
        },
        {
          display_name: 'Amount',
          variable_name: 'amount',
          value: Number(totalPrice)
        },
        {
          display_name: 'Currency',
          variable_name: 'currency',
          value: 'Naira'
        }
      ]
    },
    onSuccess: () => {
      toast.success('Payment successful');
    },
    onClose: () => {
      console.log('Payment cancelled');
    },
    onError: () => {
      console.log('Payment failed. Please try again');
    }
  }

  // const handleCreatePaypalOrder = async () => {
  //   const res = await createPaypalOrder(order.id);
  //   if (!res.success) {
  //     toast.error(res.message);
  //   }

  //   return res.data;
  // }
  // const handleCreatePaystackOrder = async () => {
  //   try {
  //     const res = await createPaystackOrder(user?.email, order.id);
  //     if (res.success) {
  //       console.log(res.data)
  //       // window.location.href = res.data.authorization_url;
  //     } else {
  //       throw new Error(res.message);
  //     }
  //   } catch (error) {
  //     toast.error(formatError(error) || 'An error occurred');
  //   }
  // }

  // const handleApprovePaypalOrder = async (data: { orderID: string }) => {
  //   const res = await approvePaypalOrder(order.id, data);

  //   if (!res.success) {
  //     toast.error(res.message);
  //   } else {
  //     toast.success(res.message)
  //   }
  //   return
  // }

  const handleApprovePaystackOrder = async (reference: string) => {
    const res = await approvePaystackOrder(order.id, reference);

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message)
    }
    return
  }

  // Buttons
  const MarkAsPaidButton = () => {
    const [ isPending, startTransition ] = useTransition();

    return (
      <Button
        type={'button'}
        disabled={isPending}
        className={"w-full py-6 text-xs tracking-[1] uppercase!"}
        onClick={() => startTransition(async () => {
          const res = await updateCODOrderToPaid(order.id);
          toast.success(res.message)
        })}
      >
        {isPending ? 'Processing...' : 'Mark as paid'}
      </Button>
    )
  }
  const MarkAsDeliveredButton = () => {
    const [ isPending, startTransition ] = useTransition();

    return (
      <Button
        type={'button'}
        disabled={isPending}
        className={"w-full py-6 text-xs tracking-[1] uppercase!"}
        onClick={() => startTransition(async () => {
          const res = await deliverOrder(order.id);
          toast.success(res.message)
        })}
      >
        {isPending ? 'Processing...' : 'Mark as delivered'}
      </Button>
    )
  }

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card className="rounded-sm">
            <CardContent className='pb-4 gap-4'>
              <h2 className='mb-4 font-semibold text-lg uppercase!'>Payment</h2>
              <div className='mb-1 font-semibold flex items-center gap-3'><p>Payment method: {paymentMethod}</p> {isPaid && <CheckCircle size={16} />}</div>
              {
                isPaid ? (<Badge variant={"secondary"}>Paid on {formatDateTime(paidAt!).dateTime}</Badge>)
                  :
                  (<Badge variant={"destructive"}>Unpaid</Badge>)
              }
            </CardContent>
          </Card>
          <Card className="rounded-sm">
            <CardContent className='pb-4 gap-4'>
              <h2 className='mb-4 font-semibold text-lg uppercase!'>Shipping address</h2>
              <p className='mb-1'>{shippingAddress.fullName}, {shippingAddress.streetAddress}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {
                isDelivered ? (<Badge variant={"secondary"}>Delivered on {formatDateTime(paidAt!).dateTime}</Badge>)
                  :
                  (<Badge variant={"destructive"}>Not delivered</Badge>)
              }
            </CardContent>
          </Card>
          <Card className="rounded-sm">
            <CardContent className='pb-4 gap-4'>
              <h2 className='mb-4 font-semibold text-lg uppercase!'>Ordered items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/products/${ item.slug }`} className='flex items-center'>
                          <Image src={item.image} alt={item.name} width={50} height={50} className='rounded-sm' />
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className='px-2'>{item.quantity}</span>
                      </TableCell>
                      <TableCell>
                        <span className='px-2'>{formatCurrency(item.price)}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className={"md:col-span-1 col-span-2"}>
          <Card className="rounded-sm">
            <CardContent className='px-4 gap-4 space-y-4 text-sm'>
              <div className="flex justify-between px-3 rounded-sm w-full">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between px-3 rounded-sm w-full opacity-15">
                <div>V.A.T</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between px-3 rounded-sm w-full">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between p-3 rounded-sm w-full bg-foreground/7 font-semibold">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {/* Paystack payment */}
              {
                !isPaid && paymentMethod === 'Paystack' && (
                  <>
                    {/* <Button className='w-full' onClick={handleCreatePaystackOrder}>Pay via Paystack</Button> */}
                    <PaystackButton text='Pay via Paystack'
                      className={"w-full p-4 text-xs tracking-[1] uppercase! bg-foreground text-background rounded-sm cursor-pointer"}
                      {...paystackConfig}
                      onSuccess={(data) => {
                        handleApprovePaystackOrder(data.reference)
                      }}
                    />
                  </>
                )
              }
              {/* Paypal payment */}
              {/* {
                !isPaid && paymentMethod === 'Paypal' && (
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons createOrder={handleCreatePaypalOrder} onApprove={handleApprovePaypalOrder} />
                  </PayPalScriptProvider>
                )
              } */}

              {/* Cash on Delivery */}
              {
                isAdmin && !isPaid && paymentMethod === 'PayOnDelivery' && (
                  <MarkAsPaidButton />
                )
              }
              {
                isAdmin && isPaid && !isDelivered && (
                  <MarkAsDeliveredButton />
                )
              }
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}

export default OrderDetailsTable