import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}

export function EmptyState({ title, message, actionLabel, actionHref, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {message && <p className="mt-2 max-w-sm text-sm text-gray-500">{message}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
