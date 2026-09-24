import { describe, it, expect } from "vitest";
import type {
  Product,
  Category,
  User,
  CartItem,
  WishlistItem,
  ApiResponse,
} from "@/types";

describe("shared types", () => {
  it("builds a valid Product", () => {
    const product: Product = {
      productId: "p1",
      name: "Test",
      description: "A product",
      price: 9.99,
      category: "electronics",
      imageUrl: "https://example.com/x.jpg",
      stock: 5,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };
    expect(product.price).toBe(9.99);
  });

  it("builds valid Category, User, CartItem, WishlistItem", () => {
    const category: Category = {
      categoryId: "electronics",
      name: "Electronics",
      description: "Gadgets",
      imageUrl: "https://example.com/c.jpg",
    };
    const user: User = {
      userId: "u1",
      name: "Guest",
      email: "guest@example.com",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };
    const cartItem: CartItem = {
      userId: "u1",
      productId: "p1",
      quantity: 2,
      addedAt: "2024-01-01T00:00:00.000Z",
    };
    const wishlistItem: WishlistItem = {
      userId: "u1",
      productId: "p1",
      addedAt: "2024-01-01T00:00:00.000Z",
    };
    expect(category.categoryId).toBe("electronics");
    expect(user.userId).toBe("u1");
    expect(cartItem.quantity).toBe(2);
    expect(wishlistItem.productId).toBe("p1");
  });

  it("models success and error API responses", () => {
    const ok: ApiResponse<{ count: number }> = { data: { count: 1 } };
    const err: ApiResponse<{ count: number }> = {
      error: { message: "Not found", code: "NOT_FOUND" },
    };
    expect(ok.data?.count).toBe(1);
    expect(err.error?.code).toBe("NOT_FOUND");
  });
});
