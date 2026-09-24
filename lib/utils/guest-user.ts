import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { getOrCreateUser } from "@/lib/dynamodb/users";

/**
 * Guest user mechanism (DEMO / AUTH-FREE).
 *
 * This app has no real authentication. To still exercise per-user cart and
 * wishlist data in DynamoDB, we give each browser a stable "guest" id stored
 * in an httpOnly cookie. This is NOT authentication — anyone with the cookie
 * is that guest — but it keeps the data model realistic and leaves room to add
 * real auth later (the userId would simply come from the session instead).
 *
 * The cookie is httpOnly (not readable by client JS) and created entirely on
 * the server. There is intentionally no public users API.
 */

const COOKIE_NAME = "shoply_guest_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// Read-only: returns the current guest id, or null if none is set yet.
// Safe to call from Server Components (does not attempt to set a cookie).
export async function getGuestUserId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

/**
 * Returns the current guest id, creating and persisting one if needed.
 * Must be called from a context allowed to set cookies (Route Handler or
 * Server Action). Also ensures a matching Users row exists in DynamoDB.
 */
export async function requireGuestUserId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;

  if (existing) {
    return existing;
  }

  const userId = randomUUID();
  store.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  // Lazily create the demo user record on first use.
  await getOrCreateUser(userId);

  return userId;
}
