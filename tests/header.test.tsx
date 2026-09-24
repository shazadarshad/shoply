import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layout/Header";

// The Header uses useRouter; provide a minimal mock.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Header", () => {
  it("renders the logo and primary navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Shoply" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Cart" })).toHaveAttribute("href", "/cart");
    expect(screen.getByRole("link", { name: "Wishlist" })).toHaveAttribute("href", "/wishlist");
  });

  it("renders an accessible search input", () => {
    render(<Header />);
    // There are search inputs (desktop + mobile share the label text).
    expect(screen.getAllByLabelText("Search products").length).toBeGreaterThan(0);
  });
});
