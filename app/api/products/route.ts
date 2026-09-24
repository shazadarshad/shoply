import { NextRequest } from "next/server";
import { listProducts, listProductsByCategory } from "@/lib/dynamodb/products";
import { ok, handleServerError } from "@/lib/api/response";

// GET /api/products            -> all products
// GET /api/products?category=x -> products in a category
export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category");
    const products = category
      ? await listProductsByCategory(category)
      : await listProducts();
    return ok(products);
  } catch (error) {
    return handleServerError("GET /api/products", error);
  }
}
