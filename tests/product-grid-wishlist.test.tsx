import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Product } from "@/types";

function make(id: string): Product {
  return {
    productId: id,
    name: id,
    description: "d",
    price: 10,
    category: "electronics",
    imageUrl: "https://example.com/x.jpg",
    stock: 5,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };
}

describe("ProductGrid wishlist initial state", () => {
  it("marks the wishlist button pressed for products in wishlistIds", () => {
    render(<ProductGrid products={[make("p1"), make("p2")]} wishlistIds={["p1"]} />);

    const buttons = screen.getAllByRole("button", { name: /wishlist/i });
    // Two cards -> two wishlist buttons.
    expect(buttons).toHaveLength(2);

    const pressed = buttons.filter((b) => b.getAttribute("aria-pressed") === "true");
    const notPressed = buttons.filter((b) => b.getAttribute("aria-pressed") === "false");

    // Exactly one product (p1) starts as wishlisted.
    expect(pressed).toHaveLength(1);
    expect(notPressed).toHaveLength(1);
  });

  it("shows all wishlist buttons inactive when no wishlistIds are given", () => {
    render(<ProductGrid products={[make("p1"), make("p2")]} />);

    const buttons = screen.getAllByRole("button", { name: /wishlist/i });
    expect(buttons.every((b) => b.getAttribute("aria-pressed") === "false")).toBe(true);
  });
});
