import { requireGuestUserId } from "@/lib/utils/guest-user";
import { getWishlistItems, addWishlistItem } from "@/lib/dynamodb/wishlist";
import { getProduct, listProducts } from "@/lib/dynamodb/products";
import { ok, errors, handleServerError } from "@/lib/api/response";
import { isValidId } from "@/lib/utils/validation";

// GET /api/wishlist -> the guest's wishlist products (full product records).
export async function GET() {
  try {
    const userId = await requireGuestUserId();
    const items = await getWishlistItems(userId);

    const products = await listProducts();
    const productsById = new Map(products.map((p) => [p.productId, p]));

    // Include only products that still exist.
    const wishlistProducts = items
      .map((item) => productsById.get(item.productId))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));

    return ok({ products: wishlistProducts });
  } catch (error) {
    return handleServerError("GET /api/wishlist", error);
  }
}

// POST /api/wishlist { productId } -> add (idempotent).
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const productId = body?.productId;

    if (!isValidId(productId)) {
      return errors.invalidInput("Invalid product id.");
    }

    const product = await getProduct(productId);
    if (!product) {
      return errors.notFound("Product not found.");
    }

    const userId = await requireGuestUserId();
    await addWishlistItem(userId, productId);

    return ok({ productId, added: true }, 201);
  } catch (error) {
    return handleServerError("POST /api/wishlist", error);
  }
}
