import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

/**
 * Builds the DynamoDB client configuration.
 *
 * - If DYNAMODB_ENDPOINT is set we point at a local DynamoDB instance and
 *   supply dummy credentials (DynamoDB Local still requires credentials to be
 *   present, but does not validate them).
 * - If it is not set we rely on the standard AWS credential chain (env vars,
 *   shared config, IAM role, etc.) so the same code works against real AWS.
 *
 * Exported separately so it can be unit-tested without creating a real client.
 */
export function buildClientConfig(
  env: Record<string, string | undefined> = process.env,
): DynamoDBClientConfig {
  const region = env.AWS_REGION ?? "us-east-1";
  const endpoint = env.DYNAMODB_ENDPOINT;

  if (endpoint) {
    return {
      region,
      endpoint,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID ?? "local",
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "local",
      },
    };
  }

  // No endpoint: use real AWS with the default credential provider chain.
  return { region };
}

// Create the base client and wrap it in the Document client, which lets us
// work with plain JS objects instead of DynamoDB attribute-value maps.
const baseClient = new DynamoDBClient(buildClientConfig());

export const docClient = DynamoDBDocumentClient.from(baseClient, {
  marshallOptions: {
    // Match v2 behaviour: drop undefined values instead of erroring.
    removeUndefinedValues: true,
  },
});
