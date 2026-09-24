import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.categoryId}`}
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-gray-500">{category.description}</p>
      </div>
    </Link>
  );
}
