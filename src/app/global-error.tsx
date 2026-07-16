"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#14110f",
          color: "#f3ebe0",
          fontFamily: "Tahoma, sans-serif",
          padding: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "24rem" }}>
          <h1 style={{ marginTop: 0 }}>صفحه بارگذاری نشد</h1>
          <p style={{ opacity: 0.8 }}>
            یک‌بار دیگر تلاش کنید. اگر از ایران هستید، دامنه اختصاصی
            MelliZarr.ir پایدارتر از vercel.app است.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: 0,
              borderRadius: 999,
              padding: "0.7rem 1.2rem",
              background: "linear-gradient(135deg,#e2c27a,#8d6b2f)",
              color: "#1a140c",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  );
}
