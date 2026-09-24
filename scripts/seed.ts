/**
 * Seeds the Shoply tables with sample categories, products, and a demo user.
 * Run with: npm run db:seed  (run db:create first).
 */
import "dotenv/config";
import { BatchWriteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/dynamodb/client";
import { TABLES } from "../lib/dynamodb/tables";
import { categories, products, demoUser } from "./seed-data";

// DynamoDB BatchWrite accepts at most 25 items per request.
function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function batchPut(tableName: string, items: object[]) {
  for (const batch of chunk(items, 25)) {
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch.map((item) => ({ PutRequest: { Item: item } })),
        },
      }),
    );
  }
}

async function seed() {
  await batchPut(TABLES.categories, categories);
  console.log(`Seeded ${categories.length} categories.`);

  await batchPut(TABLES.products, products);
  console.log(`Seeded ${products.length} products.`);

  await docClient.send(new PutCommand({ TableName: TABLES.users, Item: demoUser }));
  console.log("Seeded 1 demo user.");

  console.log("Done seeding.");
}

seed().catch((error) => {
  console.error("Failed to seed data:", error);
  process.exit(1);
});
