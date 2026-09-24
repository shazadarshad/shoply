import { describe, it, expect, beforeEach, vi } from "vitest";

const { fake } = await vi.hoisted(async () => {
  const { FakeDocClient } = await import("./helpers/fake-doc-client");
  return {
    fake: new FakeDocClient({
      Shoply_Wishlist: { hashKey: "userId", rangeKey: "productId" },
    }),
  };
});

vi.mock("@/lib/dynamodb/client", () => ({ docClient: fake }));

import {
  getWishlistItems,
  isInWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "@/lib/dynamodb/wishlist";

const USER = "guest-1";

describe("wishlist data layer", () => {
  beforeEach(() => {
    fake.clear();
  });

  it("adds a product to the wishlist", async () => {
    await addWishlistItem(USER, "p1");
    expect(await getWishlistItems(USER)).toHaveLength(1);
  });

  it("prevents duplicates when the same product is added twice", async () => {
    await addWishlistItem(USER, "p1");
    await addWishlistItem(USER, "p1");
    expect(await getWishlistItems(USER)).toHaveLength(1);
  });

  it("isInWishlist reflects membership", async () => {
    expect(await isInWishlist(USER, "p1")).toBe(false);
    await addWishlistItem(USER, "p1");
    expect(await isInWishlist(USER, "p1")).toBe(true);
  });

  it("removes a product", async () => {
    await addWishlistItem(USER, "p1");
    await removeWishlistItem(USER, "p1");
    expect(await isInWishlist(USER, "p1")).toBe(false);
  });

  it("scopes wishlists by user", async () => {
    await addWishlistItem(USER, "p1");
    await addWishlistItem("guest-2", "p2");
    expect(await getWishlistItems(USER)).toHaveLength(1);
    expect(await getWishlistItems("guest-2")).toHaveLength(1);
  });
});
