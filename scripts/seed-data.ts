import type { Category, Product, User } from "../types";

const now = "2024-01-01T00:00:00.000Z";

// Consistent, freely-usable placeholder images (picsum.photos, seeded by id).
function image(seed: string): string {
  return `https://picsum.photos/seed/${seed}/600/600`;
}

export const categories: Category[] = [
  {
    categoryId: "electronics",
    name: "Electronics",
    description: "Gadgets, audio, and everyday tech.",
    imageUrl: image("electronics"),
  },
  {
    categoryId: "home-kitchen",
    name: "Home & Kitchen",
    description: "Practical things for a comfortable home.",
    imageUrl: image("home-kitchen"),
  },
  {
    categoryId: "clothing",
    name: "Clothing",
    description: "Everyday apparel and accessories.",
    imageUrl: image("clothing"),
  },
  {
    categoryId: "books",
    name: "Books",
    description: "Fiction, non-fiction, and reference.",
    imageUrl: image("books"),
  },
  {
    categoryId: "sports-outdoors",
    name: "Sports & Outdoors",
    description: "Gear for training and the outdoors.",
    imageUrl: image("sports-outdoors"),
  },
];

// Helper to keep product definitions short and consistent.
function product(
  id: string,
  name: string,
  description: string,
  price: number,
  category: string,
  stock: number,
): Product {
  return {
    productId: id,
    name,
    description,
    price,
    category,
    imageUrl: image(id),
    stock,
    createdAt: now,
    updatedAt: now,
  };
}

export const products: Product[] = [
  // Electronics
  product("p-wireless-earbuds", "Wireless Earbuds", "Compact Bluetooth earbuds with a charging case and 20-hour battery life.", 59.99, "electronics", 40),
  product("p-bluetooth-speaker", "Portable Bluetooth Speaker", "Water-resistant speaker with rich bass and 12 hours of playback.", 39.99, "electronics", 25),
  product("p-usb-c-charger", "65W USB-C Charger", "Fast GaN charger that powers laptops, tablets, and phones.", 34.99, "electronics", 60),
  product("p-wireless-mouse", "Wireless Mouse", "Ergonomic silent-click mouse with adjustable DPI.", 19.99, "electronics", 80),
  product("p-mechanical-keyboard", "Mechanical Keyboard", "Compact 75% keyboard with hot-swappable switches.", 89.99, "electronics", 15),

  // Home & Kitchen
  product("p-ceramic-mug", "Ceramic Coffee Mug", "12oz stoneware mug that keeps drinks warm longer.", 12.99, "home-kitchen", 100),
  product("p-chef-knife", "8-inch Chef's Knife", "Stainless steel knife with a comfortable full-tang handle.", 44.99, "home-kitchen", 30),
  product("p-glass-container-set", "Glass Storage Set", "Set of 5 airtight glass containers for leftovers and meal prep.", 29.99, "home-kitchen", 45),
  product("p-french-press", "French Press", "Borosilicate glass press that brews rich coffee in minutes.", 24.99, "home-kitchen", 35),
  product("p-scented-candle", "Scented Soy Candle", "Hand-poured candle with a 45-hour burn time.", 16.99, "home-kitchen", 70),

  // Clothing
  product("p-cotton-tshirt", "Classic Cotton T-Shirt", "Soft, breathable everyday tee in a relaxed fit.", 14.99, "clothing", 120),
  product("p-hoodie", "Fleece Pullover Hoodie", "Cozy midweight hoodie with a kangaroo pocket.", 39.99, "clothing", 55),
  product("p-denim-jeans", "Slim-Fit Denim Jeans", "Stretch denim with a modern slim cut.", 49.99, "clothing", 40),
  product("p-wool-socks", "Merino Wool Socks", "Warm, moisture-wicking socks (3-pack).", 18.99, "clothing", 90),
  product("p-baseball-cap", "Cotton Baseball Cap", "Adjustable cap with a curved brim.", 17.99, "clothing", 65),

  // Books
  product("p-clean-code", "Clean Code (Paperback)", "A practical guide to writing readable, maintainable software.", 32.99, "books", 50),
  product("p-pragmatic-programmer", "The Pragmatic Programmer", "Timeless advice for a modern software career.", 36.99, "books", 42),
  product("p-atomic-habits", "Atomic Habits", "An easy and proven way to build good habits.", 21.99, "books", 75),
  product("p-cookbook", "Everyday Cookbook", "150 simple recipes for weeknight cooking.", 27.99, "books", 38),

  // Sports & Outdoors
  product("p-yoga-mat", "Non-Slip Yoga Mat", "Extra-thick 6mm mat with a carrying strap.", 25.99, "sports-outdoors", 60),
  product("p-water-bottle", "Insulated Water Bottle", "Keeps drinks cold for 24 hours (750ml).", 22.99, "sports-outdoors", 85),
  product("p-dumbbell-set", "Adjustable Dumbbell Set", "Space-saving dumbbells adjustable from 5 to 25 lbs.", 119.99, "sports-outdoors", 12),
  product("p-camping-lantern", "LED Camping Lantern", "Rechargeable lantern with three brightness modes.", 28.99, "sports-outdoors", 48),
  product("p-running-belt", "Running Waist Belt", "Bounce-free belt that holds your phone and keys.", 15.99, "sports-outdoors", 70),
];

export const demoUser: User = {
  userId: "demo-user",
  name: "Demo User",
  email: "demo@shoply.example",
  createdAt: now,
  updatedAt: now,
};
