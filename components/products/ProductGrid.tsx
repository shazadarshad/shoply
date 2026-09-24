import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProductGridProps {
  products: Product[];
  wishlistIds?: string[];
  emptyTitle?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  wishlistIds = [],
  emptyTitle = "No products found",
  emptyMessage = "Try a different search or category.",
}: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  const wishlistSet = new Set(wishlistIds);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          product={product}
          initialInWishlist={wishlistSet.has(product.productId)}
        />
      ))}
    </div>
  );
}
