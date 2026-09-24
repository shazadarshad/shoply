import { requireGuestUserId } from "@/lib/utils/guest-user";
import { removeWishlistItem } from "@/lib/dynamodb/wishlist";
import { ok, errors, handleServerError } from "@/lib/api/response";
import { isValidId } from "@/lib/utils/validation";

// DELETE /api/wishlist/[productId] -> remove from wishlist.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    if (!isValidId(productId)) {
      return errors.invalidInput("Invalid product id.");
    }

    const userId = await requireGuestUserId();
    await removeWishlistItem(userId, productId);

    return ok({ productId, removed: true });
  } catch (error) {
    return handleServerError("DELETE /api/wishlist/[productId]", error);
  }
}
