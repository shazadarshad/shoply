import {
  GetCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "./client";
import { TABLES, CATEGORY_INDEX } from "./tables";
import type { Product } from "@/types";

// Get a single product by id. Returns null if it does not exist.
export async function getProduct(productId: string): Promise<Product | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.products,
      Key: { productId },
    }),
  );
  return (result.Item as Product | undefined) ?? null;
}

// List all products. The dataset is small, so a Scan is acceptable here.
export async function listProducts(): Promise<Product[]> {
  const result = await docClient.send(
    new ScanCommand({ TableName: TABLES.products }),
  );
  return (result.Items as Product[] | undefined) ?? [];
}

// List products in a category using the CategoryIndex GSI.
export async function listProductsByCategory(
  category: string,
): Promise<Product[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.products,
      IndexName: CATEGORY_INDEX,
      KeyConditionExpression: "category = :category",
      ExpressionAttributeValues: { ":category": category },
    }),
  );
  return (result.Items as Product[] | undefined) ?? [];
}

/**
 * Search products by a free-text term.
 *
 * NOTE: DynamoDB has no native full-text search. For this small demo we Scan
 * the table and filter in memory on name, description, and category. This is
 * fine for a few dozen products but would not scale to a large catalogue.
 */
export async function searchProducts(term: string): Promise<Product[]> {
  const products = await listProducts();
  const q = term.trim().toLowerCase();
  if (!q) return products;

  return products.filter((product) => {
    return (
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q)
    );
  });
}

// Related products: same category, excluding the current product.
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const sameCategory = await listProductsByCategory(product.category);
  return sameCategory
    .filter((p) => p.productId !== product.productId)
    .slice(0, limit);
}
