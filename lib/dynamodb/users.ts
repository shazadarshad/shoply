import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "./client";
import { TABLES } from "./tables";
import type { User } from "@/types";

export async function getUser(userId: string): Promise<User | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.users,
      Key: { userId },
    }),
  );
  return (result.Item as User | undefined) ?? null;
}

// Create a user record. Used to lazily persist a guest user on first use.
export async function createUser(userId: string): Promise<User> {
  const now = new Date().toISOString();
  const user: User = {
    userId,
    name: "Guest",
    email: "",
    createdAt: now,
    updatedAt: now,
  };
  await docClient.send(new PutCommand({ TableName: TABLES.users, Item: user }));
  return user;
}

// Return the user if it exists, otherwise create it. Keeps callers simple.
export async function getOrCreateUser(userId: string): Promise<User> {
  const existing = await getUser(userId);
  return existing ?? createUser(userId);
}
