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
      <div className="overflow-x-auto">
        <Table className='mb-4'>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
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
                <TableCell>
                  <Link href={`/order/${ order.id }`}>
                    <span className="px-2">Details</span>
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