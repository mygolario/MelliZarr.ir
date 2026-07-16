"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatWeightGrams } from "@/lib/pricing";

export default function CartPage() {
  const { items, setQuantity, removeItem, totalCount } = useCart();

  return (
    <section className="section">
      <div className="shell stack">
        <div className="section-head">
          <p className="eyebrow">سبد خرید</p>
          <h1>سفارش شما</h1>
          <p className="muted">
            {totalCount > 0
              ? `${totalCount} قلم در سبد`
              : "سبد خرید خالی است."}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="panel">
            <p className="muted">هنوز محصولی انتخاب نکرده‌اید.</p>
            <Link href="/products" className="btn btn-gold" style={{ marginTop: "1rem" }}>
              رفتن به محصولات
            </Link>
          </div>
        ) : (
          <div className="panel stack">
            <table className="table">
              <thead>
                <tr>
                  <th>محصول</th>
                  <th>وزن</th>
                  <th>تعداد</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <Link href={`/products/${item.slug}`}>{item.title}</Link>
                    </td>
                    <td>{formatWeightGrams(item.weightGrams)}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          setQuantity(item.productId, Number(e.target.value) || 1)
                        }
                        style={{ width: "4.5rem" }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeItem(item.productId)}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <Link href="/checkout" className="btn btn-gold">
                ادامه ثبت سفارش
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
