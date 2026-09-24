/**
 * Creates the DynamoDB tables Shoply needs. Safe to run multiple times:
 * tables that already exist are skipped.
 *
 * Run with: npm run db:create
 */
import "dotenv/config";
import {
  CreateTableCommand,
  CreateTableCommandInput,
  DynamoDBClient,
  ResourceInUseException,
} from "@aws-sdk/client-dynamodb";
import { buildClientConfig } from "../lib/dynamodb/client";
import { TABLES, CATEGORY_INDEX } from "../lib/dynamodb/tables";

const client = new DynamoDBClient(buildClientConfig());

const tableDefinitions: CreateTableCommandInput[] = [
  {
    TableName: TABLES.products,
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
      { AttributeName: "productId", AttributeType: "S" },
      { AttributeName: "category", AttributeType: "S" },
    ],
    KeySchema: [{ AttributeName: "productId", KeyType: "HASH" }],
    GlobalSecondaryIndexes: [
      {
        IndexName: CATEGORY_INDEX,
        KeySchema: [{ AttributeName: "category", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
      },
    ],
  },
  {
    TableName: TABLES.categories,
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [{ AttributeName: "categoryId", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "categoryId", KeyType: "HASH" }],
  },
  {
    TableName: TABLES.users,
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
  },
  {
    TableName: TABLES.cart,
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "productId", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
      { AttributeName: "productId", KeyType: "RANGE" },
    ],
  },
  {
    TableName: TABLES.wishlist,
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "productId", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
      { AttributeName: "productId", KeyType: "RANGE" },
    ],
  },
];

async function createTables() {
  for (const definition of tableDefinitions) {
    try {
      await client.send(new CreateTableCommand(definition));
      console.log(`Created table: ${definition.TableName}`);
    } catch (error) {
      if (error instanceof ResourceInUseException) {
        console.log(`Table already exists, skipping: ${definition.TableName}`);
      } else {
        throw error;
      }
    }
  }
  console.log("Done creating tables.");
}

createTables().catch((error) => {
  console.error("Failed to create tables:", error);
  process.exit(1);
});
