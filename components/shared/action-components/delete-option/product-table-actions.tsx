'use client'
import React from 'react'
import { useActionComponentStore } from '../store/action-components-store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import Link from 'next/link';

const ProductTableActions = ({ product }: { product: { id: string; name: string }; }) => {
  const { setDeleting, setConfirmDelete } = useActionComponentStore();
  const handleDeleteProduct = () => {
    setConfirmDelete(true)
    setDeleting(product.id, [product.name])
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem>
            <Link href={`/admin/products/${product.id}`}>Edit product</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteProduct()} className='text-destructive'>
            Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ProductTableActions;