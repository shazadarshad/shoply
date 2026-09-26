import Link from "next/link";
import { listProducts } from "@/lib/dynamodb/products";
import { listCategories } from "@/lib/dynamodb/categories";
import { getGuestWishlistProductIds } from "@/lib/services/wishlist";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryCard } from "@/components/products/CategoryCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories, wishlistIds] = await Promise.all([
    listProducts(),
    listCategories(),
    getGuestWishlistProductIds(),
  ]);
  const featured = products.slice(0, 8);

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple shopping, done well
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Browse a curated selection of everyday products. Add favourites to your
            wishlist and build your cart.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center rounded-md bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Shop all products
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Categories */}
        {categories.length > 0 && (
          <section aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="mb-4 text-xl font-semibold text-gray-900">
              Shop by category
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((category) => (
                <CategoryCard key={category.categoryId} category={category} />
              ))}
            </div>
          </section>
        )}

        {/* Featured products */}
        <section aria-labelledby="featured-heading" className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="featured-heading" className="text-xl font-semibold text-gray-900">
              Featured products
            </h2>
            <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <ProductGrid products={featured} wishlistIds={wishlistIds} />
        </section>
      </div>
    </main>
  );
}
