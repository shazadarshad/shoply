import { describe, it, expect } from "vitest";
import { lineTotal, calculateSubtotal, buildCartView } from "@/lib/services/cart";
import type { CartItem, Product } from "@/types";

function makeProduct(id: string, price: number): Product {
  return {
    productId: id,
    name: id,
    description: "d",
    price,
    category: "c",
    imageUrl: "x",
    stock: 10,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };
}

function makeItem(productId: string, quantity: number): CartItem {
  return { userId: "u1", productId, quantity, addedAt: "2024-01-01T00:00:00.000Z" };
}

describe("cart service", () => {
  it("lineTotal multiplies price by quantity", () => {
    expect(lineTotal(20, 2)).toBe(40);
    expect(lineTotal(19.99, 3)).toBe(59.97);
  });

  it("buildCartView enriches items and computes line totals", () => {
    const products = new Map([
      ["p1", makeProduct("p1", 20)],
      ["p2", makeProduct("p2", 5)],
    ]);
    const view = buildCartView([makeItem("p1", 2), makeItem("p2", 3)], products);
    expect(view).toHaveLength(2);
    expect(view[0].lineTotal).toBe(40);
    expect(view[1].lineTotal).toBe(15);
  });

  it("buildCartView skips items whose product no longer exists", () => {
    const products = new Map([["p1", makeProduct("p1", 20)]]);
    const view = buildCartView([makeItem("p1", 1), makeItem("gone", 1)], products);
    expect(view).toHaveLength(1);
  });

  it("calculateSubtotal sums line totals", () => {
    const products = new Map([
      ["p1", makeProduct("p1", 20)],
      ["p2", makeProduct("p2", 5)],
    ]);
    const view = buildCartView([makeItem("p1", 2), makeItem("p2", 3)], products);
    expect(calculateSubtotal(view)).toBe(55);
  });
});
