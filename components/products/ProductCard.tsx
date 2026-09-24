import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils/format";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

interface ProductCardProps {
  product: Product;
  initialInWishlist?: boolean;
}

export function ProductCard({ product, initialInWishlist }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <div className="absolute right-2 top-2 z-10">
        <WishlistButton productId={product.productId} initialInWishlist={initialInWishlist} />
      </div>

      <Link href={`/products/${product.productId}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-3">
          <p className="text-xs uppercase tracking-wide text-gray-400">{product.category.replace(/-/g, " ")}</p>
          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-auto pt-2 text-base font-semibold text-gray-900">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  );
}
