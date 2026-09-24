import { requireGuestUserId } from "@/lib/utils/guest-user";
import { getCartItems, addCartItem } from "@/lib/dynamodb/cart";
import { getProduct, listProducts } from "@/lib/dynamodb/products";
import { buildCartView, calculateSubtotal } from "@/lib/services/cart";
import { ok, errors, handleServerError } from "@/lib/api/response";
import { isValidId, isValidQuantity } from "@/lib/utils/validation";

// GET /api/cart -> the current guest's cart with product details and subtotal.
export async function GET() {
  try {
    const userId = await requireGuestUserId();
    const items = await getCartItems(userId);

    const products = await listProducts();
    const productsById = new Map(products.map((p) => [p.productId, p]));

    const cartItems = buildCartView(items, productsById);
    const subtotal = calculateSubtotal(cartItems);

    return ok({ items: cartItems, subtotal });
  } catch (error) {
    return handleServerError("GET /api/cart", error);
  }
}

// POST /api/cart { productId, quantity } -> add to cart (merges quantity).
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const productId = body?.productId;
    const quantity = body?.quantity ?? 1;

    if (!isValidId(productId)) {
      return errors.invalidInput("Invalid product id.");
    }
    if (!isValidQuantity(quantity)) {
      return errors.invalidInput("Quantity must be a positive integer.");
    }

    // Never trust the client: confirm the product exists before adding it.
    const product = await getProduct(productId);
    if (!product) {
      return errors.notFound("Product not found.");
    }

    const userId = await requireGuestUserId();
    await addCartItem(userId, productId, quantity);

    return ok({ productId, added: quantity }, 201);
  } catch (error) {
    return handleServerError("POST /api/cart", error);
  }
}
