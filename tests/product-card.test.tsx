import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

const product: Product = {
  productId: "p-test",
  name: "Test Product",
  description: "A great product",
  price: 24.99,
  category: "electronics",
  imageUrl: "https://picsum.photos/seed/p-test/600/600",
  stock: 5,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("ProductCard", () => {
  it("shows the name, formatted price, category, and links to the detail page", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$24.99")).toBeInTheDocument();
    expect(screen.getByText("electronics")).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/p-test");
  });

  it("renders an accessible image with alt text and a wishlist button", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByAltText("Test Product")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /wishlist/i })).toBeInTheDocument();
  });
});
