import { describe, it, expect, beforeEach, vi } from "vitest";
import { TABLES } from "@/lib/dynamodb/tables";
import type { Category } from "@/types";

const { fake } = await vi.hoisted(async () => {
  const { FakeDocClient } = await import("./helpers/fake-doc-client");
  return {
    fake: new FakeDocClient({
      Shoply_Categories: { hashKey: "categoryId" },
    }),
  };
});

vi.mock("@/lib/dynamodb/client", () => ({ docClient: fake }));

import { getCategory, listCategories } from "@/lib/dynamodb/categories";

const sample: Category[] = [
  { categoryId: "electronics", name: "Electronics", description: "Tech", imageUrl: "x" },
  { categoryId: "books", name: "Books", description: "Reading", imageUrl: "y" },
];

describe("categories data layer", () => {
  beforeEach(() => {
    fake.clear();
    fake.seed(TABLES.categories, sample);
  });

  it("getCategory returns a category by id", async () => {
    const category = await getCategory("electronics");
    expect(category?.name).toBe("Electronics");
  });

  it("getCategory returns null for a missing category", async () => {
    expect(await getCategory("missing")).toBeNull();
  });

  it("listCategories returns all categories", async () => {
    const categories = await listCategories();
    expect(categories).toHaveLength(2);
  });
});
