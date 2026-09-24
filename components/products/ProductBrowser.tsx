"use client";

import { useMemo, useState } from "react";
import type { Category, Product, SortOption } from "@/types";
import { SearchBar } from "./SearchBar";
import { FilterControls } from "./FilterControls";
import { ProductGrid } from "./ProductGrid";
import { applyFilters } from "@/lib/utils/product-filters";

interface ProductBrowserProps {
  products: Product[];
  categories: Category[];
  wishlistIds?: string[];
}

// Client-side search/filter/sort over the full product list provided by the
// server. The catalogue is small, so filtering in the browser keeps the UX
// instant without extra API round-trips.
export function ProductBrowser({ products, categories, wishlistIds = [] }: ProductBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<SortOption | "">("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q),
        )
      : products;

    return applyFilters(searched, {
      category: category || undefined,
      sort: sort || undefined,
    });
  }, [products, query, category, sort]);

  const hasSearch = query.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="md:max-w-sm md:flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <FilterControls
          categories={categories}
          category={category}
          sort={sort}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />
      </div>

      <ProductGrid
        products={visible}
        wishlistIds={wishlistIds}
        emptyTitle={hasSearch ? "No results" : "No products found"}
        emptyMessage={hasSearch ? "Try another search term." : "Try a different category."}
      />
    </div>
  );
}
