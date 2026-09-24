import { describe, it, expect, beforeEach, vi } from "vitest";
import { TABLES } from "@/lib/dynamodb/tables";
import type { Product } from "@/types";

// Create the fake client in a hoisted block so vi.mock (also hoisted) can use it.
const { fake } = await vi.hoisted(async () => {
  const { FakeDocClient } = await import("./helpers/fake-doc-client");
  return {
    fake: new FakeDocClient({
      Shoply_Products: { hashKey: "productId" },
    }),
  };
});

vi.mock("@/lib/dynamodb/client", () => ({ docClient: fake }));

import {
  getProduct,
  listProducts,
  listProductsByCategory,
  searchProducts,
  getRelatedProducts,
} from "@/lib/dynamodb/products";

function makeProduct(id: string, category: string, overrides: Partial<Product> = {}): Product {
  return {
    productId: id,
    name: overrides.name ?? id,
    description: overrides.description ?? "A product",
    price: overrides.price ?? 10,
    category,
    imageUrl: "https://example.com/x.jpg",
    stock: overrides.stock ?? 5,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const sample: Product[] = [
  makeProduct("p1", "electronics", { name: "Wireless Earbuds", description: "Bluetooth audio" }),
  makeProduct("p2", "electronics", { name: "USB Charger", description: "Fast charging" }),
  makeProduct("p3", "books", { name: "Clean Code", description: "Software craftsmanship" }),
];

describe("products data layer", () => {
  beforeEach(() => {
    fake.clear();
    fake.seed(TABLES.products, sample);
  });

  it("getProduct returns a product by id", async () => {
    const product = await getProduct("p1");
    expect(product?.name).toBe("Wireless Earbuds");
  });

  it("getProduct returns null for a missing product", async () => {
    const product = await getProduct("does-not-exist");
    expect(product).toBeNull();
  });

  it("listProducts returns all products", async () => {
    const products = await listProducts();
    expect(products).toHaveLength(3);
  });

  it("listProductsByCategory filters by category", async () => {
    const electronics = await listProductsByCategory("electronics");
    expect(electronics).toHaveLength(2);
    const empty = await listProductsByCategory("clothing");
    expect(empty).toHaveLength(0);
  });

  it("searchProducts matches name, description, or category", async () => {
    expect(await searchProducts("earbuds")).toHaveLength(1);
    expect(await searchProducts("charging")).toHaveLength(1);
    expect(await searchProducts("books")).toHaveLength(1);
    expect(await searchProducts("")).toHaveLength(3);
    expect(await searchProducts("nothing-here")).toHaveLength(0);
  });

  it("getRelatedProducts returns same category excluding the current product", async () => {
    const current = await getProduct("p1");
    const related = await getRelatedProducts(current!);
    expect(related).toHaveLength(1);
    expect(related[0].productId).toBe("p2");
  });
});
