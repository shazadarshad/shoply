import { WishlistView } from "@/components/wishlist/WishlistView";

export const metadata = { title: "Wishlist | Shoply" };

export default function WishlistPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Wishlist</h1>
      <WishlistView />
    </main>
  );
}
