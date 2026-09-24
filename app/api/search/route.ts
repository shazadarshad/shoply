import { NextRequest } from "next/server";
import { searchProducts } from "@/lib/dynamodb/products";
import { ok, handleServerError } from "@/lib/api/response";

// GET /api/search?q=term
//
// NOTE: DynamoDB has no native full-text search. searchProducts() scans the
// (small) products table and filters in memory. This is acceptable for a demo
// catalogue but would need a dedicated search service at scale.
export async function GET(request: NextRequest) {
  try {
    const term = request.nextUrl.searchParams.get("q") ?? "";
    const products = await searchProducts(term);
    return ok(products);
  } catch (error) {
    return handleServerError("GET /api/search", error);
  }
}
