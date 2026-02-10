'use client'

// import DeleteDialog from '@/components/shared/action-components/delete-option/delete-dialog'
// import ProductTableActions from '@/components/shared/action-components/delete-option/product-table-actions'
// import { useActionComponentStore } from '@/components/shared/action-components/store/action-components-store'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { formatCurrency, formatUUID } from '@/lib/utils'
// import { deleteProduct } from '@/lib/server/actions/product.actions'
import React from 'react'

const ProductsTable = ({ products, page }: { products: any, page: number }) => {
  // const { deleting, confirmDelete } = useActionComponentStore();

  return (
    <>
      {/* <div>
        <Table className='mb-4'>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead className='text-left'>PRICE</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead className='w-[100px]'>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>{formatUUID(product.id)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {product.rating} / 5
                </TableCell>
                <TableCell>
                  <ProductTableActions product={{ id: product.id, name: product.name }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {
          (deleting?.id && confirmDelete) && (
            <DeleteDialog key={deleting?.id} id={deleting?.id} action={deleteProduct} />)
        }
      </div> */}
    </>
  )
}

export default ProductsTable