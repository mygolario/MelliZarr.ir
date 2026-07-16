import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getFeaturedProductsCached, getSiteSettingsCached } from "@/lib/catalog";
import { siteConfig } from "@/lib/config";
import {
  calculateUnitPriceToman,
  formatFaDateTime,
  formatToman,
} from "@/lib/pricing";

/** CDN/ISR cache — critical for Iran latency vs force-dynamic every hit */
export const revalidate = 60;

export default async function HomePage() {
  let settings: {
    pricePerGram: number;
    priceUpdatedAt: Date;
  } | null = null;
  let featured: Awaited<ReturnType<typeof getFeaturedProductsCached>> = [];
  let dbError = false;

  try {
    const [siteSettings, products] = await Promise.all([
      getSiteSettingsCached(),
      getFeaturedProductsCached(),
    ]);
    settings = siteSettings;
    featured = products;
  } catch {
    dbError = true;
  }

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true" />
        <div className="shell hero-content">
          <p className="hero-brand">{siteConfig.brandFa}</p>
          <h1 className="hero-title">{siteConfig.tagline}</h1>
          <p className="hero-copy">
            سکه الیزابت، پارسیان و سکه‌های غیر بانکی؛ قیمت شفاف بر اساس نرخ روز،
            سفارش آنلاین و پرداخت کارت‌به‌کارت امن.
          </p>
          <div className="hero-cta">
            <Link href="/products" className="btn btn-gold">
              مشاهده محصولات
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              مشاوره خرید
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell stack">
          {dbError || !settings ? (
            <div className="alert alert-warn">
              اتصال به دیتابیس موقتاً برقرار نشد. چند لحظه دیگر صفحه را تازه کنید.
            </div>
          ) : (
            <>
              <div className="rate-banner">
                <div>
                  <p className="eyebrow">نرخ روز طلا</p>
                  <p className="price" style={{ fontSize: "1.35rem" }}>
                    {formatToman(settings.pricePerGram)}
                    <span
                      className="muted"
                      style={{ fontSize: "0.9rem", fontWeight: 500 }}
                    >
                      {" "}
                      / گرم
                    </span>
                  </p>
                </div>
                <p className="muted">
                  آخرین بروزرسانی: {formatFaDateTime(settings.priceUpdatedAt)}
                </p>
              </div>

              <div className="section-head">
                <p className="eyebrow">منتخب فروشگاه</p>
                <h2>شروع از پرفروش‌ترین وزن‌ها</h2>
                <p className="muted">
                  قیمت هر سکه از وزن × نرخ روز + اجرت محاسبه می‌شود.
                </p>
              </div>

              <div className="product-list panel">
                {featured.map((product) => (
                  <ProductCard
                    key={product.id}
                    slug={product.slug}
                    title={product.title}
                    category={product.category}
                    weightGrams={product.weightGrams}
                    priceToman={calculateUnitPriceToman({
                      weightGrams: product.weightGrams,
                      pricePerGram: settings.pricePerGram,
                      wagePercent: product.wagePercent,
                      fixedMarkup: product.fixedMarkup,
                    })}
                  />
                ))}
              </div>

              <div>
                <Link href="/products" className="btn btn-ghost">
                  همه محصولات
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
