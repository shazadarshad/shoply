import { describe, it, expect } from "vitest";
import { applyFilters, sortProducts } from "@/lib/utils/product-filters";
import type { Product } from "@/types";

function make(id: string, category: string, price: number, name: string): Product {
  return {
    productId: id,
    name,
    description: "desc",
    price,
    category,
    imageUrl: "x",
    stock: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };
}

const products: Product[] = [
  make("a", "electronics", 30, "Zeta"),
  make("b", "electronics", 10, "Alpha"),
  make("c", "books", 20, "Mid"),
];

describe("sortProducts", () => {
  it("sorts price ascending", () => {
    expect(sortProducts(products, "price-asc").map((p) => p.price)).toEqual([10, 20, 30]);
  });

  it("sorts price descending", () => {
    expect(sortProducts(products, "price-desc").map((p) => p.price)).toEqual([30, 20, 10]);
  });

  it("sorts name A-Z", () => {
    expect(sortProducts(products, "name-asc").map((p) => p.name)).toEqual(["Alpha", "Mid", "Zeta"]);
  });

  it("returns unchanged order when no sort given", () => {
    expect(sortProducts(products).map((p) => p.productId)).toEqual(["a", "b", "c"]);
  });

  it("does not mutate the input array", () => {
    const before = products.map((p) => p.productId);
    sortProducts(products, "price-asc");
    expect(products.map((p) => p.productId)).toEqual(before);
  });
});

describe("applyFilters", () => {
  it("filters by category", () => {
    const result = applyFilters(products, { category: "electronics" });
    expect(result).toHaveLength(2);
  });

  it("filters by price range", () => {
    const result = applyFilters(products, { minPrice: 15, maxPrice: 25 });
    expect(result.map((p) => p.productId)).toEqual(["c"]);
  });

  it("combines category filter with sort", () => {
    const result = applyFilters(products, { category: "electronics", sort: "price-asc" });
    expect(result.map((p) => p.price)).toEqual([10, 30]);
  });

  it("returns all products with empty filters", () => {
    expect(applyFilters(products, {})).toHaveLength(3);
  });
});
