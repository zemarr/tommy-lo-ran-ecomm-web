'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShopStore } from '@/lib/store/shop-store';
import { useEffect, useState } from 'react';

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('query') || '';

  const setSearchQuery = useShopStore((s) => s.setSearchQuery);
  // const searchQuery = useShopStore((s) => s.searchQuery);

  const [localValue, setLocalValue] = useState(initialQuery);

  // Sync URL → Zustand once on mount
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      setLocalValue(initialQuery);
    }
  }, [initialQuery, setSearchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);      // UI state (instant)
    setSearchQuery(value);    // Zustand state (instant filtering)
  };

  return (
    <div className="w-max-[550px] relative w-full lg:w-80 xl:w-full mb-10">
      <div className="absolute left-0 top-0 ml-3 flex h-full items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5" />
      </div>
      <input
        type="text"
        name="query"
        placeholder="Search Name, Brand or Category"
        autoComplete="off"
        value={localValue}
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
      />
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <div className="absolute left-0 top-0 ml-3 flex h-full items-center cursor-text">
        <MagnifyingGlassIcon className="h-4" />
      </div>
      <input
        placeholder="Search Name, Brand or Category"
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-primary-foreground dark:placeholder:text-neutral-400"
      />
    </form>
  );
}
