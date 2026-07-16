import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { deliveryLabels, orderStatusLabels } from "@/lib/config";
import { prisma } from "@/lib/db";
import { formatFaDateTime, formatToman, formatWeightGrams } from "@/lib/pricing";
import type { OrderStatus } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const statuses: OrderStatus[] = [
  "PENDING_PAYMENT",
  "AWAITING_REVIEW",
  "CONFIRMED",
  "SHIPPED",
  "CANCELLED",
];

async function updateOrderAction(formData: FormData) {
  "use server";
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const adminNote = String(formData.get("adminNote") ?? "");

  if (!statuses.includes(status)) {
    redirect(`/admin/orders/${id}?error=1`);
  }

  await prisma.order.update({
    where: { id },
    data: { status, adminNote },
  });

  redirect(`/admin/orders/${id}?saved=1`);
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: Props & { searchParams: Promise<{ saved?: string; error?: string }> }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const query = await searchParams;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <section className="admin-shell stack">
      <div className="admin-nav">
        <Link href="/admin/orders" className="btn btn-ghost btn-sm">
          بازگشت به لیست
        </Link>
        <Link href={`/order/${order.id}`} className="btn btn-ghost btn-sm">
          صفحه مشتری
        </Link>
      </div>

      <h1>{order.publicCode}</h1>
      {query.saved ? <div className="alert">ذخیره شد.</div> : null}
      {query.error ? <div className="alert alert-warn">وضعیت نامعتبر.</div> : null}

      <div className="two-col">
        <div className="panel stack">
          <p>
            {order.customerName} — {order.customerPhone}
          </p>
          <p className="muted">
            {deliveryLabels[order.deliveryMethod]}
            <br />
            {order.customerAddress || "—"}
          </p>
          <p className="muted">ثبت: {formatFaDateTime(order.createdAt)}</p>
          <p className="price">{formatToman(order.subtotalToman)}</p>
          <table className="table">
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.titleSnap} × {item.quantity}
                  </td>
                  <td>{formatWeightGrams(item.weightGramsSnap)}</td>
                  <td>{formatToman(item.lineTotalToman)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {order.receiptPath ? (
            <a href={order.receiptPath} target="_blank" rel="noreferrer">
              مشاهده فیش آپلودشده
            </a>
          ) : (
            <p className="muted">هنوز فیشی ارسال نشده.</p>
          )}
        </div>

        <form action={updateOrderAction} className="panel form-grid">
          <input type="hidden" name="id" value={order.id} />
          <label>
            وضعیت
            <select name="status" defaultValue={order.status}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {orderStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
          <label>
            یادداشت ادمین
            <textarea name="adminNote" rows={4} defaultValue={order.adminNote} />
          </label>
          <button type="submit" className="btn btn-gold">
            بروزرسانی سفارش
          </button>
        </form>
      </div>
    </section>
  );
}
