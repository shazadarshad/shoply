import type { Product, SortOption } from "@/types";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}

// Pure, client-and-server-safe filtering + sorting. Does not touch the DB.
export function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = products;

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (typeof filters.minPrice === "number") {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (typeof filters.maxPrice === "number") {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  return sortProducts(result, filters.sort);
}

export function sortProducts(products: Product[], sort?: SortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy;
  }
}
