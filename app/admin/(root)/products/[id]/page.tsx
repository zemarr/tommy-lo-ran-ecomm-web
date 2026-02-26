import { requireAdmin } from '@/lib/auth-guard';
import { getProductById } from '@/lib/server/actions/product.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/product-form';
import { normalizeProduct } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Update product'
}

const AdminProductUpdatePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  await requireAdmin();
  const { id } = await props.params;

  const product = await getProductById(id);
  if (!product) return notFound();

  const normalizedProduct = normalizeProduct({
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
    createdAt: product.createdAt ? product.createdAt.toString() : "",
    updatedAt: product.updatedAt ? product.updatedAt.toString() : "",
  });

  return (
    <>
      <div className='space-y-8 mx-auto my-30'>
        <h1 className="mb-2 font-semibold text-xl uppercase!">Update product</h1>

        <ProductForm
          type='Update'
          product={normalizedProduct}
          productId={product.id}
        />
      </div>
    </>
  )
}

export default AdminProductUpdatePage