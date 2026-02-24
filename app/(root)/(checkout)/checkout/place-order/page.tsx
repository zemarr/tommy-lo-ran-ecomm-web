import React from 'react'
import { Metadata } from 'next'
import { getMyCart } from '@/lib/server/actions/cart.actions'
import { auth } from '@/auth'
import { getUserById } from '@/lib/server/actions/user.actions'
import { redirect } from 'next/navigation'
import { ShippingAddress } from '@/types'
import CheckoutSteps from '@/components/shared/checkout/checkout-steps'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import PlaceOrderForm from './components/place-order-form'

export const metadata: Metadata = {
  title: 'Place order'
}

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id

  if (!userId) throw new Error('User not found')

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping-address')
  if (!user.paymentMethod) redirect('/payment-method');

  const userAddress = user.address as ShippingAddress;

  return (
    <div>
      <CheckoutSteps currentStep={2} />
      <h1 className="mb-4 font-semibold text-xl uppercase!">
        Place order
      </h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className='md:col-span-2 overflow-x-auto space-y-4'>
          <Card>
            <CardContent className='px-4 gap-4'>
              <h2 className="text-base pb-4 mt-4 font-semibold uppercase!">Shipping address</h2>
              <p className='font-semibold'>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{' '}
                {userAddress.postalCode}, {userAddress.country}{' '}
              </p>
              <p>{userAddress.phoneNumber}</p>

              <div className="mt-3">
                <Link href="/checkout/shipping-address">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='px-4 gap-4'>
              <h2 className="text-base pb-4 mt-4 font-semibold uppercase!">Payment method</h2>
              <p>{user.paymentMethod}</p>

              <div className="mt-3">
                <Link href="/checkout/payment-method">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='px-4 gap-4'>
              <h2 className="text-base pb-4 mt-4 font-semibold uppercase!">Order items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item?.product?.slug}>
                      <TableCell>
                        <Link href={`/products/${ item?.product?.slug }`} className='flex items-center'>
                          <Image src={item?.product?.images[ 0 ]} alt={item?.product?.name} width={50} height={50} className='rounded-md' />
                          <span className='px-2'>{item?.product?.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className='px-2'>{item.quantity}</span>
                      </TableCell>
                      <TableCell>
                        <span className='px-2'>{formatCurrency(item?.product?.price)}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-3">
                <Link href="/cart">
                  <Button variant={"outline"}>Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='px-4 gap-4 space-y-4 text-sm'>
              <div className="flex justify-between px-3 rounded-md w-full">
                <div>Items</div>
                <div>{formatCurrency(cart.itemsPrice)}</div>
              </div>
              <div className="flex justify-between px-3 rounded-md w-full opacity-15">
                <div>V.A.T</div>
                <div>{formatCurrency(cart.taxPrice)}</div>
              </div>
              <div className="flex justify-between px-3 rounded-md w-full">
                <div>Shipping</div>
                <div>{formatCurrency(cart.shippingPrice)}</div>
              </div>
              <div className="flex justify-between p-3 rounded-md w-full bg-foreground/7 font-semibold">
                <div>Total</div>
                <div>{formatCurrency(cart.totalPrice)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderPage