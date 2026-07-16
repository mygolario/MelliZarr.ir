import { ProductCard } from "@/components/product-card";
import { categoryLabels } from "@/lib/config";
import { prisma } from "@/lib/db";
import { calculateUnitPriceToman, formatFaDateTime, formatToman } from "@/lib/pricing";
import type { ProductCategory } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";
export const metadata = { title: "محصولات" };

const order: ProductCategory[] = ["ELIZABETH_PARSIAN", "NON_BANK"];

export default async function ProductsPage() {
  const [settings, products] = await Promise.all([
    prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <section className="section">
      <div className="shell stack">
        <div className="section-head">
          <p className="eyebrow">کاتالوگ</p>
          <h1>محصولات ملی‌زر</h1>
          <p className="muted">
            نرخ روز: {formatToman(settings.pricePerGram)} / گرم — بروزرسانی{" "}
            {formatFaDateTime(settings.priceUpdatedAt)}
          </p>
        </div>

        {order.map((category) => {
          const list = products.filter((p) => p.category === category);
          if (list.length === 0) return null;
          return (
            <div key={category} className="stack">
              <h2>{categoryLabels[category]}</h2>
              <div className="product-list panel">
                {list.map((product) => (
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
