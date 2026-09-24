// Shared server-side validation helpers. Keep these small and predictable.

// Ids are slugs like "p-wireless-earbuds" or "electronics".
const ID_PATTERN = /^[a-z0-9-]+$/i;

export function isValidId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 100 && ID_PATTERN.test(value);
}

// Quantity must be a positive integer.
export function isValidQuantity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}
