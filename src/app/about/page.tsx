import { siteConfig } from "@/lib/config";

export const metadata = { title: "درباره ما" };

export default function AboutPage() {
  return (
    <section className="section">
      <div className="shell panel stack" style={{ maxWidth: "42rem" }}>
        <p className="eyebrow">{siteConfig.brandFa}</p>
        <h1 style={{ margin: 0 }}>درباره ملی‌زر</h1>
        <p>
          ملی‌زر برای خرید شفاف سکه و طلای قطعه‌ای ساخته شده: وزن مشخص، نرخ روز
          قابل‌مشاهده، و مسیر سفارش کوتاه از انتخاب تا واریز کارت‌به‌کارت.
        </p>
        <p className="muted">
          در نسخه اول تمرکز روی اعتماد و سادگی است. در فازهای بعد درگاه آنلاین،
          پیامک وضعیت سفارش و همگام‌سازی خودکار نرخ طلا اضافه می‌شود.
        </p>
      </div>
    </section>
  );
}
