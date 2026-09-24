import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Shoply. A demo project.</p>
        <nav className="flex gap-4" aria-label="Footer">
          <Link href="/products" className="hover:text-gray-700">
            Products
          </Link>
          <Link href="/cart" className="hover:text-gray-700">
            Cart
          </Link>
          <Link href="/wishlist" className="hover:text-gray-700">
            Wishlist
          </Link>
        </nav>
      </div>
    </footer>
  );
}
