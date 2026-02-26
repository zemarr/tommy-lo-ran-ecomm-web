'use client'
import { useActionComponentStore } from '../store/action-components-store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import Link from 'next/link';

const OrderActions = ({ order }: { order: { id: string; orderitems: [] }; }) => {
  const { setDeleting, setConfirmDelete } = useActionComponentStore();

  const handleDeleteOrder = () => {
    setConfirmDelete(true)
    setDeleting(order.id, order.orderitems)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
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