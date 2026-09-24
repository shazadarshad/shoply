/**
 * A tiny in-memory stand-in for the DynamoDB DocumentClient, used in tests so
 * we don't need a running DynamoDB. It supports only the command shapes the
 * data layer actually uses (Get, Scan, Query, Put, Update, Delete, BatchWrite).
 *
 * Items are stored per table keyed by a composite of their key attributes.
 */

type AnyItem = Record<string, unknown>;

interface TableConfig {
  hashKey: string;
  rangeKey?: string;
}

export class FakeDocClient {
  private tables = new Map<string, Map<string, AnyItem>>();
  private configs: Record<string, TableConfig>;

  constructor(configs: Record<string, TableConfig>) {
    this.configs = configs;
    for (const name of Object.keys(configs)) {
      this.tables.set(name, new Map());
    }
  }

  private keyFor(tableName: string, item: AnyItem): string {
    const config = this.configs[tableName];
    const hash = String(item[config.hashKey]);
    if (config.rangeKey) {
      return `${hash}::${String(item[config.rangeKey])}`;
    }
    return hash;
  }

  // Seed a table directly (test setup helper).
  seed(tableName: string, items: object[]) {
    const table = this.tables.get(tableName)!;
    for (const item of items) {
      table.set(this.keyFor(tableName, item as AnyItem), item as AnyItem);
    }
  }

  // Empty all tables (test reset helper).
  clear() {
    for (const table of this.tables.values()) {
      table.clear();
    }
  }

  all(tableName: string): AnyItem[] {
    return [...this.tables.get(tableName)!.values()];
  }

  // Mimics DynamoDBDocumentClient.send(command).
  async send(command: { constructor: { name: string }; input: AnyItem }) {
    const name = command.constructor.name;
    const input = command.input;
    const tableName = input.TableName as string;
    const table = this.tables.get(tableName)!;

    switch (name) {
      case "GetCommand": {
        const key = this.keyFor(tableName, input.Key as AnyItem);
        return { Item: table.get(key) };
      }
      case "ScanCommand": {
        return { Items: [...table.values()] };
      }
      case "QueryCommand": {
        // Only supports "attr = :val" equality used by the data layer.
        const expr = input.KeyConditionExpression as string;
        const values = input.ExpressionAttributeValues as AnyItem;
        const match = expr.match(/(\w+)\s*=\s*(:\w+)/);
        if (!match) return { Items: [] };
        const [, attr, placeholder] = match;
        const wanted = values[placeholder];
        const items = [...table.values()].filter((i) => i[attr] === wanted);
        return { Items: items };
      }
      case "PutCommand": {
        const item = input.Item as AnyItem;
        table.set(this.keyFor(tableName, item), item);
        return {};
      }
      case "UpdateCommand": {
        const key = this.keyFor(tableName, input.Key as AnyItem);
        const existing = table.get(key) ?? { ...(input.Key as AnyItem) };
        // Supports simple "SET a = :a, b = :b" expressions.
        const expr = (input.UpdateExpression as string).replace(/^SET\s+/i, "");
        const values = input.ExpressionAttributeValues as AnyItem;
        const updated: AnyItem = { ...existing };
        for (const assignment of expr.split(",")) {
          const [attr, placeholder] = assignment.split("=").map((s) => s.trim());
          updated[attr] = values[placeholder];
        }
        table.set(key, updated);
        return { Attributes: updated };
      }
      case "DeleteCommand": {
        const key = this.keyFor(tableName, input.Key as AnyItem);
        table.delete(key);
        return {};
      }
      case "BatchWriteCommand": {
        const requestItems = input.RequestItems as Record<
          string,
          Array<{ PutRequest?: { Item: AnyItem }; DeleteRequest?: { Key: AnyItem } }>
        >;
        for (const [name, requests] of Object.entries(requestItems)) {
          const t = this.tables.get(name)!;
          for (const req of requests) {
            if (req.PutRequest) {
              t.set(this.keyFor(name, req.PutRequest.Item), req.PutRequest.Item);
            } else if (req.DeleteRequest) {
              t.delete(this.keyFor(name, req.DeleteRequest.Key));
            }
          }
        }
        return {};
      }
      default:
        throw new Error(`FakeDocClient: unsupported command ${name}`);
    }
  }
}
