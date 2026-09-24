import type { Product } from "@/types";
import { ProductGrid } from "./ProductGrid";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Related products</h2>
      <ProductGrid products={products} />
    </section>
  );
}
