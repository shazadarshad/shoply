import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">Items</dt>
          <dd className="text-gray-900">{itemCount}</dd>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2">
          <dt className="font-medium text-gray-900">Subtotal</dt>
          <dd className="font-semibold text-gray-900">{formatPrice(subtotal)}</dd>
        </div>
      </dl>

      <Button className="mt-6 w-full" disabled title="Checkout is not implemented in this demo">
        Checkout (not implemented)
      </Button>
      <p className="mt-2 text-center text-xs text-gray-400">
        This demo does not process payments.
      </p>
    </div>
  );
}
