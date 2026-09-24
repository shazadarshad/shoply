import { Spinner } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Spinner label="Loading product" />
    </main>
  );
}
