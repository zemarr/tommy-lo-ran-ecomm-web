'use client'

// import DeleteDialog from '@/components/shared/action-components/delete-option/delete-dialog'
// import OrderActions from '@/components/shared/action-components/delete-option/order-table-actions'
// import { useActionComponentStore } from '@/components/shared/action-components/store/action-components-store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { formatCurrency, formatDateTime, formatUUID } from '@/lib/utils'
// import { deleteOrder } from '@/lib/server/actions/order.actions'
import React from 'react'

const OrdersTable = ({ orders }: { orders: any }) => {
  // const { deleting, deletingProduct, confirmDelete } = useActionComponentStore();

  return (
    <>
      {/* <div>
        <Table className='mb-4'>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>BUYER</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell>{formatUUID(order.id)}</TableCell>
                <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'Unpaid'}</TableCell>
                <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'Not delivered'}</TableCell>
                <TableCell>
                  <OrderActions order={{ id: order.id, orderitems: order.orderitems.map((item: any) => item['product']['name']) }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {
          (deleting?.id && confirmDelete) && (
            <DeleteDialog key={deleting?.id} id={deleting?.id} action={deleteOrder} />)
        }
      </div> */}
    </>
  )
}

export default OrdersTable