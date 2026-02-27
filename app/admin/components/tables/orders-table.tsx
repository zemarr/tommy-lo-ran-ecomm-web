'use client'

import DeleteDialog from '@/components/shared/action-components/delete-option/delete-dialog'
import OrderActions from '@/components/shared/action-components/delete-option/order-table-actions'
import { useActionComponentStore } from '@/components/shared/action-components/store/action-components-store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDateTime, formatUUID } from '@/lib/utils'
import { deleteOrder } from '@/lib/server/actions/order.actions'
import { Order } from '../../../../types'

const OrdersTable = ({ orders }: { orders: any }) => {
  const { deleting, confirmDelete } = useActionComponentStore();

  return (
    <>
      <div className={"border! border-espresso/15! rounded-md overflow-hidden px-2 py-2"}>
        <Table className='mb-4'>
          <TableHeader className={"bg-espresso/10 rounded-md!"}>
            <TableRow>
              <TableHead className={"font-semibold"}>ID</TableHead>
              <TableHead className={"font-semibold"}>DATE</TableHead>
              <TableHead className={"font-semibold"}>BUYER</TableHead>
              <TableHead className={"font-semibold"}>TOTAL</TableHead>
              <TableHead className={"font-semibold"}>PAID</TableHead>
              <TableHead className={"font-semibold"}>DELIVERED</TableHead>
              <TableHead className={"flex items-center justify-center font-semibold"}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell>{formatUUID(order.id)}</TableCell>
                <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'Unpaid'}</TableCell>
                <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'Not delivered'}</TableCell>
                <TableCell className={"flex items-center justify-center"}>
                  <OrderActions order={{ id: order.id, orderItems: order.orderItems.map((item: any) => item[ 'product' ][ 'name' ]) }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {
          (deleting?.id && confirmDelete) && (
            <DeleteDialog key={deleting?.id} id={deleting?.id} action={deleteOrder} />)
        }
      </div>
    </>
  )
}

export default OrdersTable