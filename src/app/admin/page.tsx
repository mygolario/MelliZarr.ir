import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { orderStatusLabels } from "@/lib/config";
import { prisma } from "@/lib/db";
import { formatFaDateTime, formatToman } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata = { title: "پنل ادمین" };

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [settings, orders, productCount] = await Promise.all([
    prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.product.count(),
  ]);

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
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="btn btn-ghost btn-sm">
            خروج
          </button>
        </form>
      </div>

      <div className="section-head">
        <p className="eyebrow">ملی‌زر</p>
        <h1>پنل مدیریت</h1>
      </div>

      <div className="two-col">
        <div className="panel stack">
          <p className="eyebrow">نرخ روز</p>
          <p className="price" style={{ fontSize: "1.4rem" }}>
            {formatToman(settings.pricePerGram)} / گرم
          </p>
          <p className="muted">
            بروزرسانی: {formatFaDateTime(settings.priceUpdatedAt)}
          </p>
          <Link href="/admin/settings" className="btn btn-gold btn-sm">
            ویرایش نرخ و کارت
          </Link>
        </div>
        <div className="panel stack">
          <p className="eyebrow">وضعیت فروشگاه</p>
          <p style={{ margin: 0 }}>{productCount} محصول فعال در کاتالوگ</p>
          <p className="muted" style={{ margin: 0 }}>
            کارت: {settings.bankCardNumber}
          </p>
        </div>
      </div>

      <div className="panel">
        <h2 style={{ marginTop: 0 }}>آخرین سفارش‌ها</h2>
        <table className="table">
          <thead>
            <tr>
              <th>کد</th>
              <th>مشتری</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.publicCode}</td>
                <td>{order.customerName}</td>
                <td>{formatToman(order.subtotalToman)}</td>
                <td>
                  <span className="badge">{orderStatusLabels[order.status]}</span>
                </td>
                <td>
                  <Link href={`/admin/orders/${order.id}`}>مدیریت</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
