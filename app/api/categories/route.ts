import { listCategories } from "@/lib/dynamodb/categories";
import { ok, handleServerError } from "@/lib/api/response";

// GET /api/categories
export async function GET() {
  try {
    const categories = await listCategories();
    return ok(categories);
  } catch (error) {
    return handleServerError("GET /api/categories", error);
  }
}
