import { getProduct } from "@/lib/dynamodb/products";
import { ok, errors, handleServerError } from "@/lib/api/response";
import { isValidId } from "@/lib/utils/validation";

// GET /api/products/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return errors.invalidInput("Invalid product id.");
    }

    const product = await getProduct(id);
    if (!product) {
      return errors.notFound("Product not found.");
    }

    return ok(product);
  } catch (error) {
    return handleServerError("GET /api/products/[id]", error);
  }
}
