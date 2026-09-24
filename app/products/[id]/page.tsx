import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts } from "@/lib/dynamodb/products";
import { formatPrice } from "@/lib/utils/format";
import { isValidId } from "@/lib/utils/validation";
import { AddToCart } from "@/components/products/AddToCart";
import { RelatedProducts } from "@/components/products/RelatedProducts";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidId(id)) {
    notFound();
  }

  const product = await getProduct(id);
  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/products" className="hover:text-gray-700">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <Link
            href={`/categories/${product.category}`}
            className="text-xs uppercase tracking-wide text-brand-600 hover:underline"
          >
            {product.category.replace(/-/g, " ")}
          </Link>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{formatPrice(product.price)}</p>

          <p className="mt-2 text-sm text-gray-500">
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </p>

          <p className="mt-6 text-gray-700">{product.description}</p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>
        </div>
      </div>

      <RelatedProducts products={related} />
    </main>
  );
}
