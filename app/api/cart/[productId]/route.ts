import { requireGuestUserId } from "@/lib/utils/guest-user";
import { updateCartItemQuantity, removeCartItem } from "@/lib/dynamodb/cart";
import { ok, errors, handleServerError } from "@/lib/api/response";
import { isValidId, isValidQuantity } from "@/lib/utils/validation";

// PATCH /api/cart/[productId] { quantity } -> set an exact quantity.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    if (!isValidId(productId)) {
      return errors.invalidInput("Invalid product id.");
    }

    const body = await request.json().catch(() => null);
    const quantity = body?.quantity;
    if (!isValidQuantity(quantity)) {
      return errors.invalidInput("Quantity must be a positive integer.");
    }

    const userId = await requireGuestUserId();
    await updateCartItemQuantity(userId, productId, quantity);

    return ok({ productId, quantity });
  } catch (error) {
    return handleServerError("PATCH /api/cart/[productId]", error);
  }
}

// DELETE /api/cart/[productId] -> remove an item.
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
    await removeCartItem(userId, productId);

    return ok({ productId, removed: true });
  } catch (error) {
    return handleServerError("DELETE /api/cart/[productId]", error);
  }
}
