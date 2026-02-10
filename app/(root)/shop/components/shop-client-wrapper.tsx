'use client';

import { Suspense, useEffect, useState } from 'react';
import { Product } from '@/lib/generated/prisma/client';
import { useShopStore } from '@/lib/store/shop-store';
import { ShopFilters } from '@/components/shop-filters';
import { ShopProductGrid } from '@/components/shop-product-grid';
import { Skeleton } from '@/components/ui/skeleton';

interface ShopClientProps {
  products: Product[];
}

export function ShopClient({ products }: ShopClientProps) {
  const setProducts = useShopStore((s) => s.setProducts);
  const { filteredProducts, resetFilters } = useShopStore();
  const [filtersOpen, setfiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1">
        <div className="sticky top-32">
          <div className="flex items-center md:justify-start justify-end gap-4">
            <button onClick={() => setfiltersOpen(!filtersOpen)} className="text-sm font-normal text-sidebar bg-foreground rounded-sm mb-3 px-3 py-2">
              {`${!filtersOpen ? '' : 'Close'} Filter/Sort`}
            </button>
            {filtersOpen && <button onClick={() => resetFilters()} className="text-sm font-normal border-b mb-3 px-3 py-2">
              {`Clear all`}
            </button>}
          </div>
          {filtersOpen ? <ShopFilters /> : <Skeleton />}
        </div>
      </aside>

      {/* Products Grid */}
      <section className="lg:col-span-3">
        <Suspense fallback={<div className="w-screen h-screen absolute top-0 left-0 bg-black/20 transition-all"></div>}>
          <ShopProductGrid
            products={filteredProducts()}
            resultsCount={filteredProducts().length}
          />
        </Suspense>
      </section>
    </div>
  );
}