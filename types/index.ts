// Shared domain and API types used across the app (client + server).

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string; // matches Category.categoryId
  imageUrl: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// A cart item stored in DynamoDB (keyed by userId + productId).
export interface CartItem {
  userId: string;
  productId: string;
  quantity: number;
  addedAt: string;
}

// A cart item enriched with product details for display.
export interface CartItemWithProduct extends CartItem {
  product: Product;
  lineTotal: number;
}

export interface WishlistItem {
  userId: string;
  productId: string;
  addedAt: string;
}

// Sorting options supported by the product listing.
export type SortOption = "price-asc" | "price-desc" | "name-asc";

// Standard API success/error envelopes.
export interface ApiError {
  message: string;
  code: string;
}

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: ApiError };
