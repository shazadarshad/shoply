import { listProducts } from "@/lib/dynamodb/products";
import { listCategories } from "@/lib/dynamodb/categories";
import { getGuestWishlistProductIds } from "@/lib/services/wishlist";
import { ProductBrowser } from "@/components/products/ProductBrowser";

// Reads from DynamoDB at request time.
export const dynamic = "force-dynamic";

export const metadata = { title: "Products | Shoply" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [products, categories, wishlistIds] = await Promise.all([
    listProducts(),
    listCategories(),
    getGuestWishlistProductIds(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">All Products</h1>
      <ProductBrowser
        products={products}
        categories={categories}
        wishlistIds={wishlistIds}
        initialQuery={q ?? ""}
      />
    </main>
  );
}
