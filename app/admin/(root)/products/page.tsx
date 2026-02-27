// import Pagination from '@/components/shared/pagination/pagination';
import { Button } from '@/components/ui/button';
// import { requireAdmin } from '@/lib/auth-guard';
import { convertToPlainObject } from '@/lib/utils';
import { getAllProducts } from '@/lib/server/actions/product.actions';
import Link from 'next/link';
import React from 'react'
import ProductsTable from '../../components/tables/products-table';
import Pagination from '../../../../components/shared/pagination/pagination';
import { PlusCircle } from 'lucide-react';

const AdminProductsPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  // await requireAdmin();

  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';

  const products = await getAllProducts({
    query: searchText,
    page,
    category
  });
  const plainProductObject = products.data.map((product) => convertToPlainObject(product));


  return (
    <>
      <div className='space-y-2 mt-30'>
        <div className="flex justify-between w-full mb-6">
          <div className="flex items-end gap-3">
            <h1 className="font-semibold md:text-xl text-lg uppercase!">manage products</h1>
            {searchText && (
              <div className='px-2 text-sm text-gray-500'>
                Filtered by <i>&quot;{searchText}&quot;</i>{" "}
                <Link href={`/admin/products`}>
                  <Button variant={"outline"} size={'sm'}>Clear filter</Button>
                </Link>
              </div>
            )}
          </div>
          <Button asChild className="bg-charcoal text-cream hover:bg-espresso tracking-[0.15em] uppercase text-xs px-6 py-5">
            <Link href={'/admin/products/create'}><PlusCircle size={16} /> Add product</Link>
          </Button>

        </div>
        <ProductsTable products={plainProductObject} page={page} />
        {
          products.totalPages > 1 && (
            <Pagination page={Number(page) || 1} totalPages={products.totalPages} />
          )
        }
      </div>
    </>
  )
}

export default AdminProductsPage