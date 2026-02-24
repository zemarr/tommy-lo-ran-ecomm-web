'use client'

import React from 'react'
import { Order } from '@/types';
import OrderDetailsTable from './order-details-table';

const OrderDetails = ({ order, paypalClientId, paystackPublicKey, isAdmin }: { order: Omit<Order, 'paymentResult'>; paypalClientId: string; paystackPublicKey: string; isAdmin: boolean; }) => {
  return (
    <OrderDetailsTable
      order={order}
      paystackPublicKey={paystackPublicKey}
      paypalClientId={paypalClientId}
      isAdmin={isAdmin}
    />
  )
}

export default OrderDetails