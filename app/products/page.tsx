import { listProducts } from "@/lib/dynamodb/products";
import { ProductGrid } from "@/components/products/ProductGrid";

// Reads from DynamoDB at request time.
export const dynamic = "force-dynamic";

export const metadata = { title: "Products | Shoply" };

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">All Products</h1>
      <ProductGrid products={products} />
    </main>
  );
}
