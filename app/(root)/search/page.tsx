// import ProductCard from '@/components/shared/products/product-card';
import { Button } from '@/components/ui/button';
import { getAllCategories, getAllProducts } from '@/lib/server/actions/product.actions';
import Link from 'next/link';
import React from 'react'
import { ShopProductGrid } from '../../../components/shop-product-grid';
import { AddToCartButton } from '../../../components/add-to-cart-button';
import { SearchFiltersToggle } from './components/search-filters-toggle';

const priceRanges = [
  {
    name: '₦5000 to ₦20000',
    values: '5000-20000'
  },
  {
    name: '₦20001 to ₦50000',
    values: '20001-50000'
  },
  {
    name: '₦50001 to ₦80000',
    values: '50001-80000'
  },
  {
    name: '₦80001 to ₦100000',
    values: '80001-100000'
  },
  {
    name: '₦100001 to ₦300000',
    values: '100001-300000'
  },
]

const ratings = [ 4, 3, 2, 1 ];

const sortOrderValues = [
  'newest',
  'lowest',
  'highest',
  'rating',
]

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>
}) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet = category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search 
      ${ isQuerySet ? q : '' }
       ${ isCategorySet ? `: ${ category } category` : '' }
       ${ isPriceSet ? `: Price ${ price }` : '' }
       ${ isRatingSet ? `: Rating ${ rating }` : '' }
       `
    }
  }

  return {
    title: 'Search products',
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>
}) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams;

  // construct the filter url
  const getFilterUrl = ({ c, s, p, r, pg }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = {
      q,
      category,
      price,
      rating,
      sort,
      page,
    };
    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    return `/search?${ new URLSearchParams(params).toString() }`;
  }

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className={"md:mt-30 mt-18"}>
      <h1 className={"md:text-3xl text-2xl font-medium font-heading mb-4"}>Search</h1>

      <div className='grid md:grid-cols-5 md:gap-5'>
        <SearchFiltersToggle
          categoryLinks={[
            {
              label: 'Any',
              href: getFilterUrl({ c: 'all' }),
              active: category === 'all' || category === '',
            },
            ...categories.map((x) => ({
              label: x.category,
              href: getFilterUrl({ c: x.category }),
              active: category === x.category,
            })),
          ]}
          priceLinks={[
            {
              label: 'Any',
              href: getFilterUrl({ p: 'all' }),
              active: price === 'all',
            },
            ...priceRanges.map((p) => ({
              label: p.name,
              href: getFilterUrl({ p: p.values }),
              active: price === p.values,
            })),
          ]}
          ratingLinks={[
            {
              label: 'Any',
              href: getFilterUrl({ r: 'all' }),
              active: rating === 'all',
            },
            ...ratings.map((r) => ({
              label: `${ r } stars & above`,
              href: getFilterUrl({ r: `${ r }` }),
              active: rating === r.toString(),
            })),
          ]}
        />
        <div className="md:col-span-4 space-y-4">
          <div className="flex-between flex-col my-4 md:flex-row">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mb-4">
              {q !== 'all' && q !== '' && (
                <span>
                  <strong className="font-semibold">Query:</strong>{' '}
                  <span className="text-muted-foreground">"{q}"</span>
                </span>
              )}
              {category !== 'all' && category !== '' && (
                <span>
                  <strong className="font-semibold">Category:</strong>{' '}
                  <span className="text-muted-foreground">"{category}"</span>
                </span>
              )}
              {price !== 'all' && price !== '' && (
                <span>
                  <strong className="font-semibold">Price:</strong>{' '}
                  <span className="text-muted-foreground">"{price}"</span>
                </span>
              )}
              {/* {rating !== "all" && rating !== "" && ' Rating: ' + `"${ rating } stars and above"`} */}
              &nbsp;
              {
                (q !== 'all' && q !== "") ||
                  (category !== 'all' && category !== "") ||
                  (rating !== 'all' && rating !== "") ||
                  (price !== 'all' && price !== "") ? (
                  <button className={"underline! font-medium text-sm"}>
                    <Link href={'/search'}>
                      Clear filters
                    </Link>
                  </button>
                ) : null
              }
            </div>
            <div className='text-sm uppercase! tracking-[1]'>
              {/* Sort */}
              Sort by:{" "}
              {sortOrderValues.map((s) => (
                <Link href={getFilterUrl({ s })} key={s} className={`mx-2  ${ sort == s && 'font-bold underline' }`}>
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Products */}
            {products.data.length === 0 && (
              <div>No products found</div>
            )}
            {products.data.map((product) => (
              <article key={product.id} className="group flex flex-col">
                {/* Product Link */}
                <Link
                  href={`/shop/${ product.slug }`}
                  className="flex-1"
                >
                  {/* Product Image */}
                  <div className="aspect-3/4 overflow-hidden bg-muted mb-6 relative">
                    <img
                      src={product.images[ 0 ] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    {/* Museum lighting effect */}
                    <div className="absolute inset-0 bg-linear-to-b from-charcoal/0 via-transparent to-charcoal/5 pointer-events-none" />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs tracking-widest uppercase text-gold">
                      {product.category}
                    </p>
                    <h3 className="font-sans font-medium text-lg text-foreground group-hover:text-gold transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <p className="text-lg font-medium text-foreground pt-3">
                      ₦{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </Link>

                {/* Add to Cart Button */}
                <AddToCartButton product={product} className="w-full" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage