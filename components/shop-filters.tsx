"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product } from "@/lib/generated/prisma/client";
import { NAIRA_SIGN } from "@/lib/constants";
import Price from "./shared/price";

interface ShopFiltersProps {
  products: Product[];
  categories?: string[];
  onCategoryChange?: (category: string | null) => void;
  onSortChange?: (sort: string) => void;
  selectedCategory?: string | null;
  selectedSort?: string;
}

export function ShopFilters({
  products,
  onSortChange,
  selectedSort,
}: ShopFiltersProps) {
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["category"]);
  const [selectedPrice, setSelectedPrice] = useState<[number, number]>([0, 200000]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const totalCartItems = useCartStore((state) => state.getTotalItems());
  const [newProductSet, setNewProductSet] = useState<Product | null>(null)

  const onCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    console.log("getCategoryOfProducts", getCategoryOfProducts)

  }
  const getCategoryOfProducts = useMemo(() => {
    console.log("selectedCategory", selectedCategory)
    if (selectedCategory !== selectedCategory) {
      return false;
    }
    const prods = products.filter((product) => selectedCategory === product.category)
    console.log("prods", prods)
    return prods
  }, [])
  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    // console.log("new cats", cats.sort())
    return cats.sort();
  }, []);

  // Filter, search, and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (
        Number(product.price) < priceRange[0] ||
        Number(product.price) > priceRange[1]
      ) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.materials.some((m) =>
            m.toLowerCase().includes(query)
          )
        );
      }

      return true;
    });

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "popular":
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)); // Remove the Number class if id is uuid format.
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const toggleFilter = (filter: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handlePriceChange = (range: [number, number]) => {
    setSelectedPrice(range);
    setPriceRange(range);
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
                  onChange={(e) => onCategoryChange(category)}
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
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <span className="text-sm text-foreground">
                {/* {selectedPrice[0]} */}
                <Price
                  className="text-xs"
                  amount={selectedPrice[0].toString()}
                  currencyCode={"NGN"}
                  currencyCodeClassName="hidden @[275px]/label:inline"
                />
              </span>
              <span className="text-sm text-muted-foreground w-2 h-px border-black border-[0.5px]"></span>
              <span className="text-sm text-foreground">
                {/* {selectedPrice[1]} */}
                <Price
                  className="text-xs"
                  amount={selectedPrice[1].toString()}
                  currencyCode={"NGN"}
                  currencyCodeClassName="hidden @[275px]/label:inline"
                />
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

        {/* {expandedFilters.includes("sort") && (
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
        )} */}
      </div>
    </div>
  );
}
