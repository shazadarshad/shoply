import { CartView } from "@/components/cart/CartView";

export const metadata = { title: "Cart | Shoply" };

export default function CartPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Cart</h1>
      <CartView />
    </main>
  );
}
