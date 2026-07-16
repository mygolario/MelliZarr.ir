"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ReceiptUploadForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = event.currentTarget;
    const body = new FormData(form);

    try {
      const res = await fetch(`/api/orders/${orderId}/receipt`, {
        method: "POST",
        body,
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const message =
          typeof data === "object" &&
          data &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "آپلود ناموفق بود.";
        setError(message);
        return;
      }
      form.reset();
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>
        تصویر یا PDF فیش واریز
        <input name="receipt" type="file" accept="image/*,application/pdf" required />
      </label>
      {error ? <div className="alert alert-warn">{error}</div> : null}
      <button type="submit" className="btn btn-gold" disabled={loading}>
        {loading ? "در حال ارسال..." : "ارسال فیش"}
      </button>
    </form>
  );
}
