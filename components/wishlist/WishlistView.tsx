"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Spinner } from "@/components/ui/LoadingState";

type Status = "loading" | "ready" | "error";

export function WishlistView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setProducts(data.products);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(productId: string) {
    setBusyId(productId);
    try {
      const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } finally {
      setBusyId(null);
    }
  }

  async function moveToCart(productId: string) {
    setBusyId(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error();
      // Remove from wishlist once it's in the cart.
      await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } finally {
      setBusyId(null);
    }
  }

  if (status === "loading") return <Spinner label="Loading wishlist" />;
  if (status === "error") return <ErrorState message="We couldn't load your wishlist." onRetry={load} />;

  if (products.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        message="Tap the heart on any product to save it here."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  return (
    <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
      {products.map((product) => (
        <li key={product.productId} className="flex gap-4 p-4">
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
              <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
            </div>

            <div className="mt-auto flex items-center gap-3 pt-3">
              <Button
                onClick={() => moveToCart(product.productId)}
                disabled={busyId === product.productId || product.stock <= 0}
              >
                {product.stock <= 0 ? "Out of stock" : "Add to cart"}
              </Button>
              <button
                type="button"
                onClick={() => remove(product.productId)}
                disabled={busyId === product.productId}
                className="text-sm text-gray-500 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
