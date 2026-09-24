"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <ErrorState
        title="Something went wrong"
        message="We couldn't load this page. Please try again."
        onRetry={reset}
      />
    </main>
  );
}
