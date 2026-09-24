import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shoply",
  description: "A small demo e-commerce store built with Next.js and DynamoDB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
