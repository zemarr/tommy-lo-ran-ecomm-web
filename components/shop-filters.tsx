"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ShopFiltersProps {
  categories: string[];
  onCategoryChange: (category: string | null) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSortChange: (sort: string) => void;
  selectedCategory: string | null;
  selectedSort: string;
}

export function ShopFilters({
  categories,
  onCategoryChange,
  onPriceRangeChange,
  onSortChange,
  selectedCategory,
  selectedSort,
}: ShopFiltersProps) {
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["category"]);
  const [selectedPrice, setSelectedPrice] = useState<[number, number]>([0, 100000]);

  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handlePriceChange = (range: [number, number]) => {
    setSelectedPrice(range);
    onPriceRangeChange(range);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="border-b border-border pb-8">
        <button
          onClick={() => toggleFilter("category")}
          className="flex items-center justify-between w-full mb-4 hover:text-gold transition-colors"
        >
          <h3 className="font-heading text-lg font-light text-foreground">
            Category
          </h3>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expandedFilters.includes("category") ? "rotate-180" : ""
              }`}
          />
        </button>

        {expandedFilters.includes("category") && (
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === null}
                onChange={() => onCategoryChange(null)}
                className="w-4 h-4 border border-border rounded"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                All Products
              </span>
            </label>
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => onCategoryChange(category)}
                  className="w-4 h-4 border border-border rounded"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-border pb-8">
        <button
          onClick={() => toggleFilter("price")}
          className="flex items-center justify-between w-full mb-4 hover:text-gold transition-colors"
        >
          <h3 className="font-heading text-lg font-light text-foreground">
            Price Range
          </h3>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expandedFilters.includes("price") ? "rotate-180" : ""
              }`}
          />
        </button>

        {expandedFilters.includes("price") && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Min Price</label>
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={selectedPrice[0]}
                onChange={(e) =>
                  handlePriceChange([Number(e.target.value), selectedPrice[1]])
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Max Price</label>
              <input
                type="range"
                min="0"
                max="100000"
                step="100"
                value={selectedPrice[1]}
                onChange={(e) =>
                  handlePriceChange([selectedPrice[0], Number(e.target.value)])
                }
                className="w-full"
              />
            </div>
            <div className="flex gap-4 pt-4 border-t border-border">
              <span className="text-sm text-foreground">
                NGN{selectedPrice[0].toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">—</span>
              <span className="text-sm text-foreground">
                NGN{selectedPrice[1].toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sort Filter */}
      <div>
        <button
          onClick={() => toggleFilter("sort")}
          className="flex items-center justify-between w-full hover:text-gold transition-colors"
        >
          <h3 className="font-heading text-lg font-light text-foreground">
            Sort By
          </h3>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expandedFilters.includes("sort") ? "rotate-180" : ""
              }`}
          />
        </button>

        {expandedFilters.includes("sort") && (
          <div className="space-y-3 mt-4">
            {[
              { label: "Newest", value: "newest" },
              { label: "Price: Low to High", value: "price-asc" },
              { label: "Price: High to Low", value: "price-desc" },
              { label: "Best Sellers", value: "popular" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={selectedSort === option.value}
                  onChange={() => onSortChange(option.value)}
                  className="w-4 h-4 border border-border rounded"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
