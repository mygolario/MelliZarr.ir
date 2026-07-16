"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartBadge() {
  const { totalCount } = useCart();
  return (
    <Link href="/cart" className="cart-link">
      سبد خرید
      {totalCount > 0 ? <span className="cart-count">{totalCount}</span> : null}
    </Link>
  );
}
