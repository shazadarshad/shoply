import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "./client";
import { TABLES } from "./tables";
import type { WishlistItem } from "@/types";

export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.wishlist,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    }),
  );
  return (result.Items as WishlistItem[] | undefined) ?? [];
}

// Check whether a product is already in the user's wishlist.
export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.wishlist,
      Key: { userId, productId },
    }),
  );
  return Boolean(result.Item);
}

/**
 * Add a product to the wishlist. Because the key is userId+productId, writing
 * the same product again simply overwrites the existing row, so duplicates are
 * impossible.
 */
export async function addWishlistItem(userId: string, productId: string): Promise<void> {
  const item: WishlistItem = {
    userId,
    productId,
    addedAt: new Date().toISOString(),
  };
  await docClient.send(new PutCommand({ TableName: TABLES.wishlist, Item: item }));
}

export async function removeWishlistItem(userId: string, productId: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLES.wishlist,
      Key: { userId, productId },
    }),
  );
}
