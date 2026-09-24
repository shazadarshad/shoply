# Shoply

A small, functional e-commerce demo application built with Next.js and AWS DynamoDB.
Users can browse products, search and filter, view product details with related
items, manage a shopping cart, and keep a wishlist.

> This is a learning/demo project. It intentionally keeps things simple: there is
> no real authentication and no payment processing.

## Overview

Shoply is a modern storefront that demonstrates a clean full-stack setup:

- A **Next.js App Router** front end using React Server Components for data reads.
- **Route Handlers** (API endpoints) for cart and wishlist mutations and search.
- A dedicated **DynamoDB data layer** that keeps all database access on the server.

## Features

- Browse all products and browse by category
- Search products by name, description, or category
- Filter by category and sort by price or name
- Product detail pages with stock info and related products
- Shopping cart: add, change quantity, remove, live subtotal (duplicates merge)
- Wishlist: add/remove (no duplicates), move an item to the cart
- Loading, empty, and error states throughout
- Responsive layout for mobile, tablet, and desktop
- Basic accessibility: semantic HTML, labels, alt text, keyboard focus states
- Server-side guest user (cookie based) so cart/wishlist persist per browser

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **AWS DynamoDB** (via the AWS SDK for JavaScript v3)
- **Vitest** + React Testing Library (tests)
- **Git / GitHub** (version control)

## Architecture

```
User (browser)
   │
   ▼
Next.js application
  • Server Components read products/categories directly from the data layer
  • Client Components call Route Handlers for cart/wishlist/search
   │
   ▼
Server / API layer  (app/api/**, lib/dynamodb/**)
   │
   ▼
DynamoDB  (local via DYNAMODB_ENDPOINT, or real AWS)
```

All AWS access lives in `lib/dynamodb`. UI never talks to DynamoDB directly.

## Project Structure

```
app/                     Routes (pages + API route handlers)
  api/                   Route Handlers: products, categories, search, cart, wishlist
  products/              Listing + detail pages
  categories/[category]/ Category listing page
  cart/  wishlist/       Cart and wishlist pages
components/
  layout/                Header, Footer
  products/              ProductCard, ProductGrid, SearchBar, FilterControls, etc.
  cart/  wishlist/        Cart and wishlist UI
  ui/                    Button, EmptyState, ErrorState, LoadingState
lib/
  dynamodb/              DynamoDB client + per-entity data access (the only DB layer)
  services/              Pure business logic (cart totals)
  utils/                 Validation, formatting, filters, guest-user cookie
scripts/                 create-tables.ts, seed.ts, seed-data.ts
types/                   Shared TypeScript types
docs/                    Architecture and database design notes
```

## Database Design

Shoply uses **one DynamoDB table per entity**. This is simpler to understand and
explain than a single-table design, which suits a small demo. See
[`docs/database-design.md`](docs/database-design.md) for the full rationale.

| Table              | Partition key | Sort key    | Index           |
| ------------------ | ------------- | ----------- | --------------- |
| `Shoply_Products`  | `productId`   | –           | `CategoryIndex` (PK `category`) |
| `Shoply_Categories`| `categoryId`  | –           | –               |
| `Shoply_Users`     | `userId`      | –           | –               |
| `Shoply_Cart`      | `userId`      | `productId` | –               |
| `Shoply_Wishlist`  | `userId`      | `productId` | –               |

Key access patterns:

- **Products:** get by id (GetItem), list (Scan), by category (Query on `CategoryIndex`), search (Scan + in-memory filter).
- **Cart / Wishlist:** list per user (Query by `userId`); the composite key
  `userId + productId` means adding an existing product updates the row instead
  of creating a duplicate.

## Environment Variables

Copy `.env.example` to `.env.local` and adjust as needed:

| Variable                | Purpose |
| ----------------------- | ------- |
| `AWS_REGION`            | AWS region (used for local and real AWS). |
| `DYNAMODB_ENDPOINT`     | Set to use local DynamoDB (e.g. `http://localhost:8000`). **Leave unset for real AWS.** |
| `AWS_ACCESS_KEY_ID`     | Any dummy value for local; real key for AWS (or omit and use the AWS credential chain). |
| `AWS_SECRET_ACCESS_KEY` | Same as above. |
| `DYNAMODB_TABLE_PREFIX` | Prefix for table names (default `Shoply_`). |

Never commit real credentials. `.env.local` is gitignored.

## Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd shoply
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure DynamoDB** — choose one:

   **Option A — Local DynamoDB (no Docker).** Requires Java (JRE 11+).
   Download [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)
   (the standalone `.jar`) and run it:
   ```bash
   java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
   ```
   Keep `DYNAMODB_ENDPOINT=http://localhost:8000` in `.env.local`.

   **Option B — Real AWS.** Remove/empty `DYNAMODB_ENDPOINT` and provide real AWS
   credentials (or configure the AWS CLI credential chain).

5. **Create tables and seed sample data**
   ```bash
   npm run db:create
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Available Scripts

| Script              | Description |
| ------------------- | ----------- |
| `npm run dev`       | Start the development server. |
| `npm run build`     | Production build. |
| `npm run start`     | Run the production build. |
| `npm run lint`      | Run ESLint. |
| `npm run typecheck` | Run the TypeScript type checker. |
| `npm run test`      | Run the test suite (Vitest). |
| `npm run db:create` | Create the DynamoDB tables. |
| `npm run db:seed`   | Seed sample categories, products, and a demo user. |

## Screenshots

_Add screenshots here (home, product listing, product detail, cart, wishlist)._

## Known Limitations

- **Search** uses a DynamoDB `Scan` with in-memory filtering. This is fine for a
  small demo catalogue but is not how you'd build production text search.
- **Guest user** is a cookie-based demo mechanism, **not** authentication. Anyone
  with the cookie is that guest. The design leaves room to add real auth later.
- **No checkout / payments** by design.

## Future Improvements

- Proper authentication (the guest `userId` would come from a session).
- Payment integration and order management.
- Product administration (admin CRUD).
- A dedicated search service for larger catalogues.
- Inventory management.
