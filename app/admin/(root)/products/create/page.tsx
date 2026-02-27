import ProductForm from '@/components/admin/product-form';
import { requireAdmin } from '@/lib/auth-guard';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: 'Create product'
}

const CreateProductPage = async () => {
  await requireAdmin();

  return (
    <div className={"mt-30"}>
      <h2 className="mb-2 font-semibold text-xl uppercase!">Create Product</h2>
      <div className="my-8">
        {/* Product Form here */}
        <ProductForm type={'Create'} />
      </div>
    </div>
  )
}

export default CreateProductPage