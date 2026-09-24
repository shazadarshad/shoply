// Central place for DynamoDB table names. Every table name is prefixed so
// multiple environments can share one AWS account without colliding.

const prefix = process.env.DYNAMODB_TABLE_PREFIX ?? "Shoply_";

export const TABLES = {
  products: `${prefix}Products`,
  categories: `${prefix}Categories`,
  users: `${prefix}Users`,
  cart: `${prefix}Cart`,
  wishlist: `${prefix}Wishlist`,
} as const;

// GSI used to query products by category.
export const CATEGORY_INDEX = "CategoryIndex";
