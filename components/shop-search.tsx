"use client";

import React from "react"

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface ShopSearchProps {
  onSearch: (query: string) => void;
}

export function ShopSearch({ onSearch }: ShopSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value)
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="relative w-full mb-12">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          key={searchParams?.get('q')}
          type="text"
          name="q"
          placeholder="Search products by name, type, or material..."
          defaultValue={searchParams?.get('q') || ''}
          autoComplete="off"
          onChange={handleChange}
          className="w-full pl-12 pr-12 py-4 bg-muted border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
