import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  getActiveProductsCached,
  getProductBySlugCached,
  getSiteSettingsCached,
} from "@/lib/catalog";
import { categoryLabels } from "@/lib/config";
import {
  calculateUnitPriceToman,
  formatFaDateTime,
  formatToman,
  formatWeightGrams,
} from "@/lib/pricing";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getActiveProductsCached();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugCached(slug);
  return { title: product?.title ?? "محصول" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlugCached(slug),
    getSiteSettingsCached(),
  ]);

  if (!product || !product.active || !settings) notFound();

  const price = calculateUnitPriceToman({
    weightGrams: product.weightGrams,
    pricePerGram: settings.pricePerGram,
    wagePercent: product.wagePercent,
    fixedMarkup: product.fixedMarkup,
  });

  return (
    <section className="section">
      <div className="shell two-col">
        <div className="panel stack">
          <p className="eyebrow">{categoryLabels[product.category]}</p>
          <h1 style={{ margin: 0 }}>{product.title}</h1>
          <p className="muted">{product.description}</p>
          <dl className="stack" style={{ gap: "0.4rem" }}>
            <div>
              <dt className="muted">وزن</dt>
              <dd style={{ margin: 0 }}>{formatWeightGrams(product.weightGrams)}</dd>
            </div>
            <div>
              <dt className="muted">اجرت</dt>
              <dd style={{ margin: 0 }}>
                {new Intl.NumberFormat("fa-IR").format(product.wagePercent)}٪
              </dd>
            </div>
            <div>
              <dt className="muted">موجودی</dt>
              <dd style={{ margin: 0 }}>
                {product.stock > 0 ? "موجود" : "ناموجود"}
              </dd>
            </div>
          </dl>
        </div>

        <aside className="panel stack">
          <p className="eyebrow">قیمت لحظه‌ای</p>
          <p className="price" style={{ fontSize: "1.6rem" }}>
            {formatToman(price)}
          </p>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            بر اساس نرخ {formatToman(settings.pricePerGram)} / گرم —{" "}
            {formatFaDateTime(settings.priceUpdatedAt)}
          </p>
          <div className="alert alert-warn">
            قیمت طلا نوسان دارد. مبلغ نهایی هنگام ثبت سفارش قفل می‌شود و تا{" "}
            {settings.orderValidityMins} دقیقه برای پرداخت معتبر است.
          </div>
          {product.stock > 0 ? (
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              title={product.title}
              weightGrams={product.weightGrams}
            />
          ) : (
            <p className="muted">این محصول فعلاً موجود نیست.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
