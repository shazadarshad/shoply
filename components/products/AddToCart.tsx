"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { QuantitySelector } from "./QuantitySelector";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { Button } from "@/components/ui/Button";

interface AddToCartProps {
  product: Product;
  initialInWishlist?: boolean;
}

type Status = "idle" | "adding" | "added" | "error";

export function AddToCart({ product, initialInWishlist }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<Status>("idle");

  const outOfStock = product.stock <= 0;

  async function addToCart() {
    setStatus("adding");
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.productId, quantity }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <QuantitySelector
          quantity={quantity}
          onChange={setQuantity}
          max={Math.max(1, product.stock)}
          disabled={outOfStock}
        />
        <WishlistButton productId={product.productId} initialInWishlist={initialInWishlist} />
      </div>

      <Button onClick={addToCart} disabled={outOfStock || status === "adding"} className="w-full sm:w-auto">
        {outOfStock ? "Out of stock" : status === "adding" ? "Adding…" : "Add to cart"}
      </Button>

      {status === "added" && (
        <p className="text-sm text-green-600" role="status">
          Added to cart.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          Couldn&apos;t add to cart. Please try again.
        </p>
      )}
    </div>
  );
}
