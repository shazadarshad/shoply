"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand-600">
          Shoply
        </Link>

        <form onSubmit={submitSearch} className="hidden flex-1 md:block" role="search">
          <label htmlFor="header-search" className="sr-only">
            Search products
          </label>
          <input
            id="header-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </form>

        <nav className="ml-auto flex items-center gap-1" aria-label="Primary">
          <Link
            href="/products"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:block"
          >
            Products
          </Link>
          <Link
            href="/wishlist"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Wishlist
          </Link>
          <Link
            href="/cart"
            className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Cart
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle search"
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.58 3.58a1 1 0 01-1.42 1.42l-3.58-3.58A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 px-4 py-3 md:hidden">
          <form onSubmit={submitSearch} role="search">
            <label htmlFor="header-search-mobile" className="sr-only">
              Search products
            </label>
            <input
              id="header-search-mobile"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </form>
        </div>
      )}
    </header>
  );
}
