import Link from "next/link";
import { categoryLabels } from "@/lib/config";
import { formatToman, formatWeightGrams } from "@/lib/pricing";
import type { ProductCategory } from "@/generated/prisma/client";

type ProductCardProps = {
  slug: string;
  title: string;
  category: ProductCategory;
  weightGrams: number;
  priceToman: number;
};

export function ProductCard({
  slug,
  title,
  category,
  weightGrams,
  priceToman,
}: ProductCardProps) {
  return (
    <article className="product-row">
      <div className="product-row-main">
        <p className="eyebrow">{categoryLabels[category]}</p>
        <h3>
          <Link href={`/products/${slug}`}>{title}</Link>
        </h3>
        <p className="muted">{formatWeightGrams(weightGrams)}</p>
      </div>
      <div className="product-row-side">
        <p className="price">{formatToman(priceToman)}</p>
        <Link href={`/products/${slug}`} className="btn btn-ghost btn-sm">
          جزئیات
        </Link>
      </div>
    </article>
  );
}
