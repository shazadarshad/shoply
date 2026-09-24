# Database Design

Shoply stores its data in **AWS DynamoDB**. This document describes the tables,
keys, indexes, and access patterns, and explains why the design was chosen.

## Design choice: one table per entity

DynamoDB experts often recommend *single-table design*, where many entity types
share one table with generic keys. It's powerful but hard to read and hard to
explain. For a small demo where clarity matters more than squeezing out request
units, we use **one table per entity**. Each table maps directly to a concept
(`Products`, `Categories`, `Users`, `Cart`, `Wishlist`), which is easy to reason
about and to describe in an interview.

All tables use **on-demand billing** (`PAY_PER_REQUEST`) so there's no capacity
to manage. Table names are prefixed (default `Shoply_`) so several environments
can coexist in one AWS account.

## Tables

### Shoply_Products
- **Partition key:** `productId` (string)
- **GSI `CategoryIndex`:** partition key `category` (string)
- **Attributes:** name, description, price, category, imageUrl, stock, createdAt, updatedAt

### Shoply_Categories
- **Partition key:** `categoryId` (string)
- **Attributes:** name, description, imageUrl

### Shoply_Users
- **Partition key:** `userId` (string)
- **Attributes:** name, email, createdAt, updatedAt

### Shoply_Cart
- **Partition key:** `userId` (string)
- **Sort key:** `productId` (string)
- **Attributes:** quantity, addedAt

### Shoply_Wishlist
- **Partition key:** `userId` (string)
- **Sort key:** `productId` (string)
- **Attributes:** addedAt

## Access patterns → operations

| Need | Operation |
| ---- | --------- |
| Get product by id | `GetItem` on `Products` |
| List all products | `Scan` on `Products` |
| Products in a category | `Query` on `CategoryIndex` |
| Search products | `Scan` + in-memory filter on name/description/category |
| Related products | `Query` on `CategoryIndex`, exclude the current id |
| Get / list categories | `GetItem` / `Scan` on `Categories` |
| Get / create user | `GetItem` / `PutItem` on `Users` |
| Get a user's cart | `Query` on `Cart` by `userId` |
| Add to cart | read existing then `PutItem` with merged quantity |
| Update cart quantity | `UpdateItem` on `Cart` |
| Remove cart item | `DeleteItem` on `Cart` |
| Clear cart | `BatchWriteItem` (delete) |
| Get a user's wishlist | `Query` on `Wishlist` by `userId` |
| Add to wishlist | `PutItem` (idempotent — same key overwrites) |
| Check wishlist membership | `GetItem` on `Wishlist` |
| Remove wishlist item | `DeleteItem` on `Wishlist` |

## Preventing duplicates

Cart and wishlist rows are keyed by the **composite key `userId + productId`**.
Because a partition+sort key pair is unique, writing the same product again for
the same user simply overwrites the existing row rather than creating a second
one:

- **Cart:** adding a product that's already in the cart increases its quantity.
- **Wishlist:** adding a product that's already saved is a no-op (idempotent).

## Search limitation

DynamoDB has no built-in full-text search. `searchProducts` performs a `Scan`
and filters in memory across name, description, and category. This is perfectly
fine for a demo catalogue of a few dozen products, but for a real, large
catalogue you would use a dedicated search service (e.g. OpenSearch) — which is
intentionally **out of scope** here.

## Why no GSIs on cart/wishlist?

Every cart/wishlist access is "for a specific user", which the base table's
partition key (`userId`) already serves via `Query`. Adding indexes would be
unused complexity, so we don't.
