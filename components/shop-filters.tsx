"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product } from "@/lib/generated/prisma/client";
import { NAIRA_SIGN } from "@/lib/constants";
import Price from "./shared/price";
import { useShopStore } from "@/lib/store/shop-store";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { convertToPlainObject } from "@/lib/utils";

export function ShopFilters() {
  const [selectedPrice, setSelectedPrice] = useState<[number, number]>([0, 200000]);

  const {
    categories,
    expandedFilters,
    selectedCategory,
    priceRange,
    onCategoryChange,
    handlePriceChange,
    toggleFilter,
    setSearchQuery,
    setSortBy,
    resetFilters
  } = useShopStore();

  return (
    <div className="space-y-0">
      {/* Category Filter */}
      <div className="border-b border-border pb-0">
        <button
          onClick={() => toggleFilter("category")}
          className="flex items-center justify-between w-full mb-0 hover:text-gold transition-colors"
        >
          <h3 className="font-sans md:text-base text-sm text-left font-medium my-3">
            Category
          </h3>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedFilters.includes("category") ? "rotate-180" : ""
              }`}
          />
        </button>

        {expandedFilters.includes("category") && (
          <div className="space-y-3">
            <RadioGroup name="sort" defaultValue="all" className="flex flex-col items-start gap-3 cursor-pointer group pb-3 w-fit">
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value={""}
                  id={"all"}
                  checked={selectedCategory === null}
                  onClick={() => onCategoryChange(null)}
                />
                <Label htmlFor={"all"}>{"All Products"}</Label>
              </div>
              {categories().map((category: string) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3" >
                    <RadioGroupItem
                      value={category}
                      id={category}
                      onClick={() => onCategoryChange(category)}
                    />
                    <Label htmlFor={category}>{category}</Label>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-border pb-0">
        <button
          onClick={() => toggleFilter("price")}
          className="flex items-center justify-between w-full mb-0 hover:text-gold transition-colors"
        >
          <h3 className="font-sans md:text-base text-sm text-left font-medium my-3">
            Price Range
          </h3>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedFilters.includes("price") ? "rotate-180" : ""
              }`}
          />
        </button>

        {expandedFilters.includes("price") && (
          <div className="space-y-4 pb-3">

            <div className="space-y-2">
              {/* <label className="text-xs text-muted-foreground">Price</label> */}
              <Slider
                defaultValue={priceRange}
                max={500000}
                step={100}
                onValueChange={(e) => {
                  handlePriceChange(e)
                }}
                className="mx-auto w-full"
              />
            </div>
            <div className="flex items-center justify-between gap-4 pt-0">
              <span className="text-sm text-foreground">
                <Price
                  className="text-xs"
                  amount={priceRange[0].toString()}
                  currencyCode={"NGN"}
                  currencyCodeClassName="hidden @[275px]/label:inline"
                />
              </span>
              {/* <span className="text-sm text-muted-foreground w-2 h-px border-black border-[0.5px]"></span> */}
              <span className="text-sm text-foreground">
                <Price
                  className="text-xs"
                  amount={priceRange[1].toString()}
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
          <h3 className="font-sans md:text-base text-sm text-left font-medium my-3">
            More
          </h3>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedFilters.includes("sort") ? "rotate-180" : ""
              }`}
          />
        </button>

        {expandedFilters.includes("sort") && (
          <div className="space-y-3 mt-2 pb-3">
            <RadioGroup name="sort" defaultValue="newest" className="w-fit">
              {[
                { label: "Newest", value: "newest" },
                { label: "Price: Low to High", value: "price-asc" },
                { label: "Price: High to Low", value: "price-desc" },
                { label: "Best Sellers", value: "popular" },
              ].map((option) => (
                <React.Fragment key={option.value}>

                  <div className="flex items-center gap-3" >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      onClick={(e) => setSortBy(option.value as any)}
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                </React.Fragment>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
}
