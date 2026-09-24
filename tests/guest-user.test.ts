import { describe, it, expect, beforeEach, vi } from "vitest";

// A fake cookie store mimicking the subset of next/headers cookies() we use,
// plus a mock for getOrCreateUser. Both created in a hoisted block so the
// (also hoisted) vi.mock factories can reference them.
const { store, createUserMock } = vi.hoisted(() => {
  const map = new Map<string, string>();
  return {
    store: {
      map,
      get: (name: string) => {
        const value = map.get(name);
        return value === undefined ? undefined : { name, value };
      },
      set: (name: string, value: string) => {
        map.set(name, value);
      },
    },
    createUserMock: vi.fn(async (userId: string) => ({
      userId,
      name: "Guest",
      email: "",
      createdAt: "now",
      updatedAt: "now",
    })),
  };
});

vi.mock("next/headers", () => ({
  cookies: async () => store,
}));

vi.mock("@/lib/dynamodb/users", () => ({
  getOrCreateUser: createUserMock,
}));

import { getGuestUserId, requireGuestUserId } from "@/lib/utils/guest-user";

describe("guest user cookie", () => {
  beforeEach(() => {
    store.map.clear();
    createUserMock.mockClear();
  });

  it("getGuestUserId returns null when no cookie is set", async () => {
    expect(await getGuestUserId()).toBeNull();
  });

  it("requireGuestUserId generates, stores, and persists a new guest id", async () => {
    const id = await requireGuestUserId();
    expect(id).toBeTruthy();
    expect(store.map.get("shoply_guest_id")).toBe(id);
    expect(createUserMock).toHaveBeenCalledWith(id);
  });

  it("requireGuestUserId reuses an existing cookie without recreating the user", async () => {
    store.map.set("shoply_guest_id", "existing-id");
    const id = await requireGuestUserId();
    expect(id).toBe("existing-id");
    expect(createUserMock).not.toHaveBeenCalled();
  });

  it("getGuestUserId returns the stored id after one is set", async () => {
    await requireGuestUserId();
    const id = await getGuestUserId();
    expect(id).toBe(store.map.get("shoply_guest_id"));
  });
});
