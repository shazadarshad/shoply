import { describe, it, expect } from "vitest";
import { isValidId, isValidQuantity } from "@/lib/utils/validation";

describe("isValidId", () => {
  it("accepts slug-like ids", () => {
    expect(isValidId("p-wireless-earbuds")).toBe(true);
    expect(isValidId("electronics")).toBe(true);
  });

  it("rejects empty, non-string, or malformed ids", () => {
    expect(isValidId("")).toBe(false);
    expect(isValidId(123)).toBe(false);
    expect(isValidId("has space")).toBe(false);
    expect(isValidId("bad/slash")).toBe(false);
    expect(isValidId("a".repeat(101))).toBe(false);
  });
});

describe("isValidQuantity", () => {
  it("accepts positive integers", () => {
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity(10)).toBe(true);
  });

  it("rejects zero, negatives, non-integers, and non-numbers", () => {
    expect(isValidQuantity(0)).toBe(false);
    expect(isValidQuantity(-1)).toBe(false);
    expect(isValidQuantity(1.5)).toBe(false);
    expect(isValidQuantity("2")).toBe(false);
    expect(isValidQuantity(NaN)).toBe(false);
  });
});
