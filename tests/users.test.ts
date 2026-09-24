import { describe, it, expect, beforeEach, vi } from "vitest";
import { TABLES } from "@/lib/dynamodb/tables";

const { fake } = await vi.hoisted(async () => {
  const { FakeDocClient } = await import("./helpers/fake-doc-client");
  return {
    fake: new FakeDocClient({
      Shoply_Users: { hashKey: "userId" },
    }),
  };
});

vi.mock("@/lib/dynamodb/client", () => ({ docClient: fake }));

import { getUser, createUser, getOrCreateUser } from "@/lib/dynamodb/users";

describe("users data layer", () => {
  beforeEach(() => {
    fake.clear();
  });

  it("getUser returns null for a missing user", async () => {
    expect(await getUser("nobody")).toBeNull();
  });

  it("createUser persists a guest user", async () => {
    const user = await createUser("guest-1");
    expect(user.userId).toBe("guest-1");
    expect(user.name).toBe("Guest");
    expect(await getUser("guest-1")).not.toBeNull();
  });

  it("getOrCreateUser creates then reuses the same user", async () => {
    const created = await getOrCreateUser("guest-2");
    const fetched = await getOrCreateUser("guest-2");
    expect(created.createdAt).toBe(fetched.createdAt);
    expect(fake.all(TABLES.users)).toHaveLength(1);
  });
});
