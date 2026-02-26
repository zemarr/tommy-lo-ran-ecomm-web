import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils'
import { getOrderSummary } from '@/lib/server/actions/order.actions'
import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import Charts from '../components/charts'
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'Admin dashboard'
}

const AdminOverviewPage = async () => {
  await requireAdmin();

  const summary = await getOrderSummary();

  return (
    <>
      <div className='space-y-4 mt-30'>
        <h1 className='mb-2 font-semibold text-xl uppercase!'>Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className='gap-0'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
              <BadgeDollarSign />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">
                {formatCurrency(summary.totalSales.toString() || 0)}
              </div>
            </CardContent>
          </Card>
          <Card className='gap-0'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Sales</CardTitle>
              <CreditCard />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">
                {formatNumber(summary.ordersCount)}
              </div>
            </CardContent>
          </Card>
          <Card className='gap-0'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Customers</CardTitle>
              <Users />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">
                {formatNumber(summary.usersCount)}
              </div>
            </CardContent>
          </Card>
          <Card className='gap-0'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Products</CardTitle>
              <Barcode />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">
                {formatNumber(summary.productsCount)}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className='lg:col-span-4 col-span-3'>
            <CardHeader>Overview</CardHeader>
            <CardContent>
              <Charts data={{
                salesData: summary.salesData,
              }} />
            </CardContent>
          </Card>
          <Card className='col-span-3'>
            <CardHeader>Recent sales</CardHeader>
            <CardContent className='w-full'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>BUYER</TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead>TOTAL</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.latestSales.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order?.user?.name ? order.user.name : 'Deleted user'}</TableCell>
                      <TableCell>{formatDateTime(order.createdAt).dateOnly}</TableCell>
                      <TableCell>{formatCurrency(order.totalPrice.toString())}</TableCell>
                      <TableCell>
                        <Link href={`/order/${order.id}`} className='px-2'>View</Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default AdminOverviewPage