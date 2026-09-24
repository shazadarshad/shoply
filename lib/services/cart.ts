import type { CartItem, CartItemWithProduct, Product } from "@/types";

// Pure helpers for cart maths. Kept separate from DB access so they're easy to
// unit-test and reason about.

export function lineTotal(price: number, quantity: number): number {
  return Math.round(price * quantity * 100) / 100;
}

export function calculateSubtotal(items: CartItemWithProduct[]): number {
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return Math.round(total * 100) / 100;
}

/**
 * Combine raw cart items with their product records for display. Items whose
 * product no longer exists (e.g. deleted) are skipped so the cart never shows
 * a broken row.
 */
export function buildCartView(
  items: CartItem[],
  productsById: Map<string, Product>,
): CartItemWithProduct[] {
  const view: CartItemWithProduct[] = [];
  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product) continue;
    view.push({
      ...item,
      product,
      lineTotal: lineTotal(product.price, item.quantity),
    });
  }
  return view;
}
