# Architecture

This document explains how Shoply is put together and the main technical
decisions behind it. The guiding principle is **keep it simple and readable** —
this is an intern-level demo, not an enterprise platform.

## High-level flow

```
User (browser)
   │
   ▼
Next.js App Router
  • Server Components  → read products/categories directly via lib/dynamodb
  • Client Components  → call Route Handlers for cart / wishlist / search
   │
   ▼
Route Handlers (app/api/**)
   │
   ▼
Data layer (lib/dynamodb/**)  ← the ONLY place that talks to DynamoDB
   │
   ▼
DynamoDB (local JAR or real AWS)
```

## Rendering strategy

We use the **App Router** with a deliberate split:

- **Reads** (product listing, product detail, category pages, homepage) are
  **React Server Components**. They call the data layer directly, so there's no
  extra API hop and no client-side data fetching for the initial render. These
  pages are marked `dynamic = "force-dynamic"` because they read from DynamoDB at
  request time.
- **Mutations** (add to cart, change quantity, wishlist toggle) and **search**
  go through **Route Handlers** under `app/api`. Client Components call them with
  `fetch`. This keeps interactive behaviour on the client while all database
  access stays on the server.

Product read APIs (`/api/products`, `/api/categories`) also exist for
completeness and to demonstrate the API layer, even though the pages read the
data layer directly.

## Layers

1. **UI components** (`components/`) — presentational and interactive pieces.
   Reusable building blocks (`ui/`), product pieces (`products/`), and
   feature-specific cart/wishlist components. Components never import the AWS SDK.
2. **API layer** (`app/api/`) — validates input, calls the data layer, and
   returns predictable JSON envelopes (`{ data }` or `{ error }`).
3. **Data layer** (`lib/dynamodb/`) — the single boundary to DynamoDB. One file
   per entity (`products`, `categories`, `users`, `cart`, `wishlist`) plus a
   shared `client` and `tables` module.
4. **Services / utils** (`lib/services`, `lib/utils`) — pure logic (cart totals,
   filters, validation, formatting) with no I/O, which makes them easy to test.

## Guest user (auth-free demo)

There is no real authentication. To still exercise per-user cart and wishlist
data, each browser gets a stable **guest id** stored in an httpOnly cookie
(`shoply_guest_id`). It's created and read entirely on the server
(`lib/utils/guest-user.ts`); there is no public users API. On first use a
matching row is created in the `Users` table. This is **not** secure identity —
it just demonstrates the data model and leaves room to drop in real auth later
(the `userId` would simply come from the session).

## Error handling

- The data layer throws on real failures; Route Handlers catch everything and
  return a generic 500 via `handleServerError`, logging the real error server
  side. Internal details and stack traces are never sent to the client.
- Validation errors return 400; missing resources return 404.
- The UI has loading, empty, and error states, plus a route-level
  `app/error.tsx` boundary and `loading.tsx` skeletons.

## Testing

Business logic and the data layer are unit tested with **Vitest**. The data
layer is tested against a small in-memory fake of the DynamoDB Document client
(`tests/helpers/fake-doc-client.ts`), so tests run anywhere without a live
database. Components are tested with React Testing Library.
