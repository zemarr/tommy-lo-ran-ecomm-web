'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatUUID } from '../../../../lib/utils'
import ProductTableActions from '../../../../components/shared/action-components/delete-option/product-table-actions'
import { useActionComponentStore } from '../../../../components/shared/action-components/store/action-components-store'
import DeleteDialog from '../../../../components/shared/action-components/delete-option/delete-dialog'
import { deleteProduct } from '../../../../lib/server/actions/product.actions'
import { Product } from '../../../../lib/types'

const ProductsTable = ({ products, page }: { products: any, page: number }) => {
  const { deleting, confirmDelete } = useActionComponentStore();

  return (
    <>
      <div className={"border! border-espresso/15! rounded-md overflow-hidden px-2 py-2"}>
        <Table className='mb-4'>
          <TableHeader className={"bg-espresso/10 rounded-md!"}>
            <TableRow>
              <TableHead className={"font-semibold"}>ID</TableHead>
              <TableHead className={"font-semibold"}>NAME</TableHead>
              <TableHead className={"font-semibold text-left"}>PRICE</TableHead>
              <TableHead className={"font-semibold"}>CATEGORY</TableHead>
              <TableHead className={"font-semibold text-center"}>VARIATIONS</TableHead>
              <TableHead className={"font-semibold text-center"}>STOCK</TableHead>
              <TableHead className={"font-semibold text-center"}>RATING</TableHead>
              <TableHead className={"w-[100px] flex items-center justify-end font-semibold"}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>{formatUUID(product.id)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{(product?.hasVariants ? `From ${ formatCurrency(product.price) }` : formatCurrency(product.price))}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <span className="flex items-center justify-center w-full font-medium text-sm">
                    {product?.hasVariants ? "YES" : "NO"}
                  </span>
                </TableCell>
                <TableCell className={"text-center"}>{product.hasVariants ? 'Varies' : product.stock}</TableCell>
                <TableCell className={"text-center"}>
                  {product.rating} / 5
                </TableCell>
                <TableCell className={"flex items-center justify-end"}>
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
      </div>
    </>
  )
}

export default ProductsTable