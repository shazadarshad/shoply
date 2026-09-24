import { describe, it, expect, beforeEach, vi } from "vitest";

const { fake } = await vi.hoisted(async () => {
  const { FakeDocClient } = await import("./helpers/fake-doc-client");
  return {
    fake: new FakeDocClient({
      Shoply_Cart: { hashKey: "userId", rangeKey: "productId" },
    }),
  };
});

vi.mock("@/lib/dynamodb/client", () => ({ docClient: fake }));

import {
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "@/lib/dynamodb/cart";

const USER = "guest-1";

describe("cart data layer", () => {
  beforeEach(() => {
    fake.clear();
  });

  it("adds an item to the cart", async () => {
    await addCartItem(USER, "p1", 2);
    const items = await getCartItems(USER);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("merges quantity instead of creating a duplicate row", async () => {
    await addCartItem(USER, "p1", 2);
    await addCartItem(USER, "p1", 3);
    const items = await getCartItems(USER);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5);
  });

  it("keeps different products as separate rows", async () => {
    await addCartItem(USER, "p1", 1);
    await addCartItem(USER, "p2", 1);
    expect(await getCartItems(USER)).toHaveLength(2);
  });

  it("updates an item's quantity to an exact value", async () => {
    await addCartItem(USER, "p1", 2);
    await updateCartItemQuantity(USER, "p1", 7);
    const items = await getCartItems(USER);
    expect(items[0].quantity).toBe(7);
  });

  it("removes an item", async () => {
    await addCartItem(USER, "p1", 1);
    await removeCartItem(USER, "p1");
    expect(await getCartItems(USER)).toHaveLength(0);
  });

  it("clears the whole cart", async () => {
    await addCartItem(USER, "p1", 1);
    await addCartItem(USER, "p2", 1);
    await clearCart(USER);
    expect(await getCartItems(USER)).toHaveLength(0);
  });

  it("scopes carts by user", async () => {
    await addCartItem(USER, "p1", 1);
    await addCartItem("guest-2", "p1", 1);
    expect(await getCartItems(USER)).toHaveLength(1);
    expect(await getCartItems("guest-2")).toHaveLength(1);
  });
});
