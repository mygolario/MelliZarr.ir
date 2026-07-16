import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { orderStatusLabels } from "@/lib/config";
import { prisma } from "@/lib/db";
import { formatFaDateTime, formatToman } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

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

      <h1>همه سفارش‌ها</h1>
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>کد</th>
              <th>تاریخ</th>
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
                <td>{formatFaDateTime(order.createdAt)}</td>
                <td>
                  {order.customerName}
                  <div className="muted">{order.customerPhone}</div>
                </td>
                <td>{formatToman(order.subtotalToman)}</td>
                <td>{orderStatusLabels[order.status]}</td>
                <td>
                  <Link href={`/admin/orders/${order.id}`}>جزئیات</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
