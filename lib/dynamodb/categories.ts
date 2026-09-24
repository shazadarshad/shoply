import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "./client";
import { TABLES } from "./tables";
import type { Category } from "@/types";

// Get a single category by id. Returns null if it does not exist.
export async function getCategory(categoryId: string): Promise<Category | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.categories,
      Key: { categoryId },
    }),
  );
  return (result.Item as Category | undefined) ?? null;
}

// List all categories. The set is small, so a Scan is fine.
export async function listCategories(): Promise<Category[]> {
  const result = await docClient.send(
    new ScanCommand({ TableName: TABLES.categories }),
  );
  return (result.Items as Category[] | undefined) ?? [];
}
