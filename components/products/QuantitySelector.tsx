"use client";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  function update(next: number) {
    const clamped = Math.max(min, Math.min(max, next));
    onChange(clamped);
  }

  return (
    <div className="inline-flex items-center rounded-md border border-gray-300">
      <button
        type="button"
        onClick={() => update(quantity - 1)}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
        className="px-3 py-2 text-lg leading-none text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-40"
      >
        −
      </button>
      <input
        type="number"
        value={quantity}
        min={min}
        max={max}
        onChange={(e) => update(Number(e.target.value))}
        aria-label="Quantity"
        className="w-12 border-x border-gray-300 py-2 text-center text-sm [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => update(quantity + 1)}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className="px-3 py-2 text-lg leading-none text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
