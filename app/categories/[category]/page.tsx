import { notFound } from "next/navigation";
import { getCategory } from "@/lib/dynamodb/categories";
import { listProductsByCategory } from "@/lib/dynamodb/products";
import { getGuestWishlistProductIds } from "@/lib/services/wishlist";
import { ProductGrid } from "@/components/products/ProductGrid";
import { isValidId } from "@/lib/utils/validation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryId } = await params;

  if (!isValidId(categoryId)) {
    notFound();
  }

  const category = await getCategory(categoryId);
  if (!category) {
    notFound();
  }

  const [products, wishlistIds] = await Promise.all([
    listProductsByCategory(categoryId),
    getGuestWishlistProductIds(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
      <p className="mt-2 text-gray-600">{category.description}</p>

      <div className="mt-6">
        <ProductGrid
          products={products}
          wishlistIds={wishlistIds}
          emptyTitle="No products in this category yet"
          emptyMessage="Check back soon or browse other categories."
        />
      </div>
    </main>
  );
}
