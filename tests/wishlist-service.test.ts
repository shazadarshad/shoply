import { describe, it, expect, beforeEach, vi } from "vitest";

// Mocks for the two dependencies the helper composes, created in a hoisted
// block so the (hoisted) vi.mock factories can reference them.
const { getGuestUserIdMock, getWishlistItemsMock } = vi.hoisted(() => ({
  getGuestUserIdMock: vi.fn(),
  getWishlistItemsMock: vi.fn(),
}));

vi.mock("@/lib/utils/guest-user", () => ({
  getGuestUserId: getGuestUserIdMock,
}));

vi.mock("@/lib/dynamodb/wishlist", () => ({
  getWishlistItems: getWishlistItemsMock,
}));

import { getGuestWishlistProductIds } from "@/lib/services/wishlist";

describe("getGuestWishlistProductIds", () => {
  beforeEach(() => {
    getGuestUserIdMock.mockReset();
    getWishlistItemsMock.mockReset();
  });

  it("returns an empty list and skips the DB when there is no guest cookie", async () => {
    getGuestUserIdMock.mockResolvedValue(null);

    const ids = await getGuestWishlistProductIds();

    expect(ids).toEqual([]);
    expect(getWishlistItemsMock).not.toHaveBeenCalled();
  });

  it("returns the product ids from the guest's wishlist", async () => {
    getGuestUserIdMock.mockResolvedValue("guest-1");
    getWishlistItemsMock.mockResolvedValue([
      { userId: "guest-1", productId: "p1", addedAt: "now" },
      { userId: "guest-1", productId: "p2", addedAt: "now" },
    ]);

    const ids = await getGuestWishlistProductIds();

    expect(getWishlistItemsMock).toHaveBeenCalledWith("guest-1");
    expect(ids).toEqual(["p1", "p2"]);
  });

  it("returns an empty list when the wishlist is empty", async () => {
    getGuestUserIdMock.mockResolvedValue("guest-1");
    getWishlistItemsMock.mockResolvedValue([]);

    expect(await getGuestWishlistProductIds()).toEqual([]);
  });
});
