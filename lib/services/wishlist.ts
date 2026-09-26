import { getGuestUserId } from "@/lib/utils/guest-user";
import { getWishlistItems } from "@/lib/dynamodb/wishlist";

/**
 * Returns the set of product ids in the current guest's wishlist, as a plain
 * array. Read-only and safe to call from Server Components: it uses the
 * cookie-only `getGuestUserId` (which never sets a cookie) and makes a single
 * DynamoDB Query. If there's no guest cookie yet, it returns an empty list
 * without touching the database.
 *
 * Pass the result to ProductGrid/ProductBrowser (as `wishlistIds`) so each
 * card can show the correct wishlist state without a request per product.
 */
export async function getGuestWishlistProductIds(): Promise<string[]> {
  const userId = await getGuestUserId();
  if (!userId) return [];

  const items = await getWishlistItems(userId);
  return items.map((item) => item.productId);
}
