import { ProductGridSkeleton } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-gray-200" />
      <ProductGridSkeleton />
    </main>
  );
}
