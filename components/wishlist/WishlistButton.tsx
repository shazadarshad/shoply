"use client";

import { useState } from "react";

interface WishlistButtonProps {
  productId: string;
  initialInWishlist?: boolean;
  // Called after a successful toggle so parents can refresh if needed.
  onToggle?: (inWishlist: boolean) => void;
  className?: string;
}

export function WishlistButton({
  productId,
  initialInWishlist = false,
  onToggle,
  className = "",
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      if (inWishlist) {
        const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to remove from wishlist");
        setInWishlist(false);
        onToggle?.(false);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) throw new Error("Failed to add to wishlist");
        setInWishlist(true);
        onToggle?.(true);
      }
    } catch {
      // Non-fatal: keep the previous state and let the user retry.
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={inWishlist}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : "fill-none text-gray-500"}`}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M12 21s-7.5-4.9-9.5-9.3C1 8.5 2.5 5.5 5.5 5.5c1.9 0 3.2 1.1 4 2.3.8-1.2 2.1-2.3 4-2.3 3 0 4.5 3 3 6.2C19.5 16.1 12 21 12 21z" />
      </svg>
    </button>
  );
}
