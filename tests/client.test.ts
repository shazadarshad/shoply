import { describe, it, expect } from "vitest";
import { buildClientConfig } from "@/lib/dynamodb/client";

describe("buildClientConfig", () => {
  it("uses the local endpoint and dummy credentials when DYNAMODB_ENDPOINT is set", () => {
    const config = buildClientConfig({
      AWS_REGION: "eu-west-1",
      DYNAMODB_ENDPOINT: "http://localhost:8000",
    });

    expect(config.region).toBe("eu-west-1");
    expect(config.endpoint).toBe("http://localhost:8000");
    expect(config.credentials).toEqual({
      accessKeyId: "local",
      secretAccessKey: "local",
    });
  });

  it("passes through provided credentials for the local endpoint", () => {
    const config = buildClientConfig({
      DYNAMODB_ENDPOINT: "http://localhost:8000",
      AWS_ACCESS_KEY_ID: "abc",
      AWS_SECRET_ACCESS_KEY: "def",
    });

    expect(config.credentials).toEqual({
      accessKeyId: "abc",
      secretAccessKey: "def",
    });
  });

  it("omits endpoint and credentials for real AWS (default chain)", () => {
    const config = buildClientConfig({ AWS_REGION: "us-east-1" });

    expect(config.region).toBe("us-east-1");
    expect(config.endpoint).toBeUndefined();
    expect(config.credentials).toBeUndefined();
  });

  it("defaults region to us-east-1 when unset", () => {
    const config = buildClientConfig({});
    expect(config.region).toBe("us-east-1");
  });
});
