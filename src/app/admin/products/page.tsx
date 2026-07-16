import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { categoryLabels } from "@/lib/config";
import { prisma } from "@/lib/db";
import { formatWeightGrams } from "@/lib/pricing";

export const dynamic = "force-dynamic";

async function updateProductAction(formData: FormData) {
  "use server";
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const wagePercent = Number(formData.get("wagePercent"));
  const fixedMarkup = Number(formData.get("fixedMarkup"));
  const stock = Number(formData.get("stock"));
  const active = formData.get("active") === "on";

  await prisma.product.update({
    where: { id },
    data: {
      wagePercent: Number.isFinite(wagePercent) ? wagePercent : 2,
      fixedMarkup: Number.isFinite(fixedMarkup) ? Math.round(fixedMarkup) : 0,
      stock: Number.isFinite(stock) ? Math.max(0, Math.round(stock)) : 0,
      active,
    },
  });

  redirect("/admin/products?saved=1");
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const params = await searchParams;
  const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <section className="admin-shell stack">
      <div className="admin-nav">
        <Link href="/admin" className="btn btn-ghost btn-sm">
          داشبورد
        </Link>
        <Link href="/admin/settings" className="btn btn-ghost btn-sm">
          نرخ و تنظیمات
        </Link>
        <Link href="/admin/products" className="btn btn-ghost btn-sm">
          محصولات
        </Link>
        <Link href="/admin/orders" className="btn btn-ghost btn-sm">
          سفارش‌ها
        </Link>
      </div>

      <h1>محصولات</h1>
      {params.saved ? <div className="alert">ذخیره شد.</div> : null}

      <div className="stack">
        {products.map((product) => (
          <form key={product.id} action={updateProductAction} className="panel form-grid">
            <input type="hidden" name="id" value={product.id} />
            <div>
              <strong>{product.title}</strong>
              <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                {categoryLabels[product.category]} — {formatWeightGrams(product.weightGrams)}
              </p>
            </div>
            <div className="two-col">
              <label>
                اجرت ٪
                <input
                  name="wagePercent"
                  type="number"
                  step="0.1"
                  defaultValue={product.wagePercent}
                />
              </label>
              <label>
                مبلغ ثابت اضافه (تومان)
                <input
                  name="fixedMarkup"
                  type="number"
                  defaultValue={product.fixedMarkup}
                />
              </label>
              <label>
                موجودی
                <input name="stock" type="number" defaultValue={product.stock} />
              </label>
              <label style={{ alignContent: "end" }}>
                <span>
                  <input
                    name="active"
                    type="checkbox"
                    defaultChecked={product.active}
                  />{" "}
                  فعال در فروشگاه
                </span>
              </label>
            </div>
            <button type="submit" className="btn btn-ghost btn-sm">
              ذخیره این محصول
            </button>
          </form>
        ))}
      </div>
    </section>
  );
}
