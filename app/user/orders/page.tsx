import React from 'react'
import { Metadata } from "next";
import { APP_NAME } from '@/lib/constants';
import { getMyOrders } from '@/lib/server/actions/order.actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { formatCurrency, formatDateTime, formatUUID } from '@/lib/utils';
import Pagination from '@/components/shared/pagination/pagination';

export const metadata: Metadata = {
  title: `My orders | ${ APP_NAME }`
}

const UserOrdersPage = async (props: {
  searchParams: Promise<{
    page: string
  }>
}) => {
  const { page } = await props.searchParams;
  const orders = await getMyOrders({ page: Number(page) || 1 });

  return (
    <div className='space-y-2 mt-30'>
      <h2 className="mb-2 font-semibold text-xl uppercase!">My Orders</h2>
      <div className="overflow-x-auto border! border-espresso/15! rounded-md overflow-hidden px-2 py-2">
        <Table className='mb-4'>
          <TableHeader className={"bg-espresso/10 rounded-md!"}>
            <TableRow>
              <TableHead className={"font-semibold"}>ID</TableHead>
              <TableHead className={"font-semibold"}>DATE</TableHead>
              <TableHead className={"font-semibold"}>TOTAL</TableHead>
              <TableHead className={"font-semibold"}>PAID</TableHead>
              <TableHead className={"font-semibold"}>DELIVERED</TableHead>
              <TableHead className={"flex items-center justify-center font-semibold min-w-[100px]"}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatUUID(order.id)}</TableCell>
                <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice.toString())}</TableCell>
                <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'Unpaid'}</TableCell>
                <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'Not delivered'}</TableCell>
                <TableCell className={"flex items-center justify-center"}>
                  <Link href={`/order/${ order.id }`}>
                    <span className="px-2">View details</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {
          orders.totalPages > 1 && (
            <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
          )
        }
      </div>
    </div>
  )
}

export default UserOrdersPage