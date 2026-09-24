"use client";

import { useEffect, useState, useCallback } from "react";
import type { CartItemWithProduct } from "@/types";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Spinner } from "@/components/ui/LoadingState";

type Status = "loading" | "ready" | "error";

export function CartView() {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to load cart");
      const { data } = await res.json();
      setItems(data.items);
      setSubtotal(data.subtotal);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function changeQuantity(productId: string, quantity: number) {
    setBusyId(productId);
    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error();
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(productId: string) {
    setBusyId(productId);
    try {
      const res = await fetch(`/api/cart/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (status === "loading") return <Spinner label="Loading cart" />;
  if (status === "error") return <ErrorState message="We couldn't load your cart." onRetry={load} />;

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse our products and add something you like."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            onQuantityChange={changeQuantity}
            onRemove={remove}
            busy={busyId === item.productId}
          />
        ))}
      </div>
      <div>
        <CartSummary subtotal={subtotal} itemCount={items.reduce((n, i) => n + i.quantity, 0)} />
      </div>
    </div>
  );
}
