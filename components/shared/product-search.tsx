'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';

export default function ProductSearch() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="w-max-[550px] relative w-full lg:w-80 xl:w-full mb-10">
      <div className="absolute left-0 top-0 ml-3 flex h-full items-center cursor-text">
        <MagnifyingGlassIcon className="h-5" />
      </div>
      <input
        key={searchParams?.get('q')}
        type="text"
        name="q"
        placeholder="Search products by name, brand or category..."
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full pl-12 pr-12 py-4 bg-muted border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
      />
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Search for products..."
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-primary-foreground dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
