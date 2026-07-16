"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-provider";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") ?? ""),
      customerPhone: String(form.get("customerPhone") ?? ""),
      customerAddress: String(form.get("customerAddress") ?? ""),
      deliveryMethod: String(form.get("deliveryMethod") ?? "TEHRAN_PICKUP"),
      notes: String(form.get("notes") ?? ""),
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const message =
          typeof data === "object" &&
          data &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "ثبت سفارش ناموفق بود.";
        setError(message);
        return;
      }
      const id =
        typeof data === "object" &&
        data &&
        "id" in data &&
        typeof (data as { id: unknown }).id === "string"
          ? (data as { id: string }).id
          : null;
      if (!id) {
        setError("پاسخ سرور نامعتبر بود.");
        return;
      }
      clear();
      router.push(`/order/${id}`);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="shell panel">
          <h1>سبد خالی است</h1>
          <p className="muted">برای ثبت سفارش اول محصول اضافه کنید.</p>
          <Link href="/products" className="btn btn-gold" style={{ marginTop: "1rem" }}>
            محصولات
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="shell two-col">
        <form className="panel form-grid" onSubmit={onSubmit}>
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">تسویه</p>
            <h1 style={{ margin: 0 }}>اطلاعات سفارش</h1>
          </div>

          <label>
            نام و نام خانوادگی
            <input name="customerName" required autoComplete="name" />
          </label>
          <label>
            موبایل
            <input
              name="customerPhone"
              required
              inputMode="tel"
              placeholder="09xxxxxxxxx"
              autoComplete="tel"
            />
          </label>
          <label>
            روش تحویل
            <select name="deliveryMethod" defaultValue="TEHRAN_PICKUP">
              <option value="TEHRAN_PICKUP">تحویل حضوری تهران</option>
              <option value="IRAN_SHIPPING">ارسال سراسر ایران</option>
            </select>
          </label>
          <label>
            آدرس (برای ارسال)
            <textarea name="customerAddress" rows={3} />
          </label>
          <label>
            توضیحات
            <textarea name="notes" rows={2} />
          </label>

          {error ? <div className="alert alert-warn">{error}</div> : null}

          <button type="submit" className="btn btn-gold" disabled={loading}>
            {loading ? "در حال ثبت..." : "ثبت سفارش و دریافت شماره کارت"}
          </button>
        </form>

        <aside className="panel stack">
          <h2 style={{ margin: 0 }}>خلاصه سبد</h2>
          <ul style={{ margin: 0, paddingInlineStart: "1.1rem" }}>
            {items.map((item) => (
              <li key={item.productId}>
                {item.title} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            مبلغ نهایی با نرخ روز در لحظه ثبت سفارش محاسبه و برای مدت محدود قفل
            می‌شود.
          </p>
        </aside>
      </div>
    </section>
  );
}
