"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItemWithProduct } from "@/types";
import { formatPrice } from "@/lib/utils/format";
import { QuantitySelector } from "@/components/products/QuantitySelector";

interface CartItemRowProps {
  item: CartItemWithProduct;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  busy?: boolean;
}

export function CartItemRow({ item, onQuantityChange, onRemove, busy }: CartItemRowProps) {
  const { product } = item;

  return (
    <div className="flex gap-4 border-b border-gray-100 py-4">
      <Link
        href={`/products/${product.productId}`}
        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
      >
        <Image src={product.imageUrl} alt={product.name} fill sizes="80px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <Link href={`/products/${product.productId}`} className="text-sm font-medium text-gray-900 hover:underline">
            {product.name}
          </Link>
          <span className="text-sm font-semibold text-gray-900">{formatPrice(item.lineTotal)}</span>
        </div>
        <p className="text-xs text-gray-500">{formatPrice(product.price)} each</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(q) => onQuantityChange(product.productId, q)}
            max={Math.max(1, product.stock)}
            disabled={busy}
          />
          <button
            type="button"
            onClick={() => onRemove(product.productId)}
            disabled={busy}
            className="text-sm text-gray-500 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
