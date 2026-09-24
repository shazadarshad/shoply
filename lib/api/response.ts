import { NextResponse } from "next/server";
import type { ApiError } from "@/types";

// Wrap successful data in the { data } envelope.
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

// Wrap an error in the { error } envelope with a safe, user-facing message.
export function fail(message: string, code: string, status: number) {
  const error: ApiError = { message, code };
  return NextResponse.json({ error }, { status });
}

// Common error responses.
export const errors = {
  invalidInput: (message = "Invalid request.") => fail(message, "INVALID_INPUT", 400),
  notFound: (message = "Resource not found.") => fail(message, "NOT_FOUND", 404),
  server: (message = "Something went wrong. Please try again.") =>
    fail(message, "SERVER_ERROR", 500),
};

/**
 * Logs the real error server-side (for debugging) but never leaks internal
 * details to the client. Returns a generic 500 response.
 */
export function handleServerError(context: string, error: unknown) {
  console.error(`[${context}]`, error);
  return errors.server();
}
