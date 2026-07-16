"use client";

import { useCart } from "@/components/cart-provider";

type Props = {
  productId: string;
  slug: string;
  title: string;
  weightGrams: number;
};

export function AddToCartButton({ productId, slug, title, weightGrams }: Props) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className="btn btn-gold"
      onClick={() => addItem({ productId, slug, title, weightGrams })}
    >
      افزودن به سبد
    </button>
  );
}
