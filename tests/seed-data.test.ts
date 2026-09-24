import { describe, it, expect } from "vitest";
import { categories, products, demoUser } from "@/scripts/seed-data";

describe("seed data", () => {
  it("has 4-6 categories", () => {
    expect(categories.length).toBeGreaterThanOrEqual(4);
    expect(categories.length).toBeLessThanOrEqual(6);
  });

  it("has 15-25 products", () => {
    expect(products.length).toBeGreaterThanOrEqual(15);
    expect(products.length).toBeLessThanOrEqual(25);
  });

  it("every product references an existing category", () => {
    const ids = new Set(categories.map((c) => c.categoryId));
    for (const product of products) {
      expect(ids.has(product.category)).toBe(true);
    }
  });

  it("every product has a positive price and non-negative stock", () => {
    for (const product of products) {
      expect(product.price).toBeGreaterThan(0);
      expect(product.stock).toBeGreaterThanOrEqual(0);
    }
  });

  it("product ids are unique", () => {
    const ids = products.map((p) => p.productId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("defines a demo user", () => {
    expect(demoUser.userId).toBe("demo-user");
    expect(demoUser.email).toContain("@");
  });
});
