'use client'
import { useActionComponentStore } from '../store/action-components-store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import Link from 'next/link';

const OrderActions = ({ order }: { order: { id: string; orderItems: any[] }; }) => {
  const { setDeleting, setConfirmDelete } = useActionComponentStore();

  const handleDeleteOrder = () => {
    setConfirmDelete(true)
    setDeleting(order.id, order.orderItems)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={"flex items-center justify-center"}>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>
            <Link href={`/order/${order.id}`}>
              <span className="">Order details</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteOrder()} className='text-destructive'>
            Delete order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default OrderActions;