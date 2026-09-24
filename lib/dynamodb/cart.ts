import {
  BatchWriteCommand,
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "./client";
import { TABLES } from "./tables";
import type { CartItem } from "@/types";

// Get all items in a user's cart.
export async function getCartItems(userId: string): Promise<CartItem[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.cart,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    }),
  );
  return (result.Items as CartItem[] | undefined) ?? [];
}

async function getCartItem(userId: string, productId: string): Promise<CartItem | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.cart,
      Key: { userId, productId },
    }),
  );
  return (result.Item as CartItem | undefined) ?? null;
}

/**
 * Add a product to the cart. If it's already there we increase the quantity
 * instead of creating a duplicate row (the composite key userId+productId
 * guarantees one row per product per user).
 */
export async function addCartItem(
  userId: string,
  productId: string,
  quantity: number,
): Promise<void> {
  const existing = await getCartItem(userId, productId);
  const newQuantity = (existing?.quantity ?? 0) + quantity;

  const item: CartItem = {
    userId,
    productId,
    quantity: newQuantity,
    addedAt: existing?.addedAt ?? new Date().toISOString(),
  };

  await docClient.send(new PutCommand({ TableName: TABLES.cart, Item: item }));
}

// Set an exact quantity for a product already in the cart.
export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number,
): Promise<void> {
  await docClient.send(
    new UpdateCommand({
      TableName: TABLES.cart,
      Key: { userId, productId },
      UpdateExpression: "SET quantity = :quantity",
      ExpressionAttributeValues: { ":quantity": quantity },
    }),
  );
}

export async function removeCartItem(userId: string, productId: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLES.cart,
      Key: { userId, productId },
    }),
  );
}

// Remove every item from a user's cart.
export async function clearCart(userId: string): Promise<void> {
  const items = await getCartItems(userId);
  if (items.length === 0) return;

  // BatchWrite handles up to 25 delete requests per call.
  for (let i = 0; i < items.length; i += 25) {
    const batch = items.slice(i, i + 25);
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [TABLES.cart]: batch.map((item) => ({
            DeleteRequest: { Key: { userId: item.userId, productId: item.productId } },
          })),
        },
      }),
    );
  }
}
