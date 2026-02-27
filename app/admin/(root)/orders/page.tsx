import { auth } from '@/auth';
import Pagination from '@/components/shared/pagination/pagination';
import { requireAdmin } from '@/lib/auth-guard';
import { convertToPlainObject } from '@/lib/utils';
import { getAllOrders } from '@/lib/server/actions/order.actions';
import { Metadata } from 'next';
import React from 'react'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import OrdersTable from '../../components/tables/orders-table';

export const metadata: Metadata = {
  title: 'Admin orders'
}
const AdminOrdersPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>
}) => {
  await requireAdmin();

  const { page = '1', query: searchText } = await props.searchParams;

  const session = await auth();
  if (session?.user?.role !== 'admin') throw new Error('Unauthorized user');

  const orders = await getAllOrders({ page: Number(page), query: searchText });
  const plainOrders = orders.data.map((order) => convertToPlainObject(order));

  return (
    <div className='space-y-2 mt-30'>
      <div className="flex items-end gap-3">
        <h1 className="mb-4 font-semibold text-xl uppercase!">All Orders</h1>
        {searchText && (
          <div className='px-2 text-sm text-gray-500 flex items-center gap-2'>
            Filtered by <i>&quot;{searchText}&quot;</i>{" "}
            <Link href={`/admin/orders`}>
              <Button variant={"outline"} size={'sm'}>Clear filter</Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <OrdersTable orders={plainOrders} />
        {
          orders.totalPages > 1 && (
            <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
          )
        }
      </div>
    </div>
  )
}

export default AdminOrdersPage