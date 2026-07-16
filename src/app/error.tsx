"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section">
      <div className="shell panel stack" style={{ maxWidth: "28rem" }}>
        <h1 style={{ margin: 0 }}>مشکل در بارگذاری</h1>
        <p className="muted">
          ارتباط با سرور قطع شد یا دیتابیس پاسخ نداد. دوباره امتحان کنید.
        </p>
        <button type="button" className="btn btn-gold" onClick={() => reset()}>
          تلاش مجدد
        </button>
      </div>
    </section>
  );
}
