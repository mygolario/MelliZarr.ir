const faqs = [
  {
    q: "قیمت‌ها چطور محاسبه می‌شود؟",
    a: "قیمت هر سکه از وزن گرم × نرخ روز طلا + درصد اجرت به‌دست می‌آید. نرخ روز را از پنل ادمین به‌روز می‌کنید.",
  },
  {
    q: "چرا مهلت پرداخت محدود است؟",
    a: "نرخ طلا نوسان دارد. با قفل قیمت برای مدت کوتاه، هم خریدار و هم فروشگاه ریسک کمتری می‌گیرند.",
  },
  {
    q: "پرداخت چگونه است؟",
    a: "در فاز اول کارت‌به‌کارت است: مبلغ دقیق سفارش را واریز می‌کنید و فیش را در صفحه سفارش آپلود می‌کنید.",
  },
  {
    q: "ارسال دارید؟",
    a: "بله؛ تحویل حضوری تهران و ارسال بیمه‌شده در سراسر ایران. جزئیات در صفحه تماس آمده است.",
  },
] as const;

export const metadata = { title: "سؤالات متداول" };

export default function FaqPage() {
  return (
    <section className="section">
      <div className="shell stack">
        <div className="section-head">
          <p className="eyebrow">راهنما</p>
          <h1>سؤالات متداول</h1>
        </div>
        <div className="stack">
          {faqs.map((item) => (
            <article key={item.q} className="panel">
              <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>{item.q}</h2>
              <p className="muted" style={{ marginBottom: 0 }}>
                {item.a}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
