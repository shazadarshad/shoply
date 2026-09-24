"use client";

import type { Category, SortOption } from "@/types";

interface FilterControlsProps {
  categories: Category[];
  category: string;
  sort: SortOption | "";
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortOption | "") => void;
}

export function FilterControls({
  categories,
  category,
  sort,
  onCategoryChange,
  onSortChange,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-col">
        <label htmlFor="category-filter" className="sr-only">
          Filter by category
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="sort-order" className="sr-only">
          Sort products
        </label>
        <select
          id="sort-order"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption | "")}
          className="rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
}
