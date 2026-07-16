import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderPaymentPanel } from "@/components/order-payment-panel";
import { deliveryLabels, orderStatusLabels } from "@/lib/config";
import { prisma } from "@/lib/db";
import { formatFaDateTime, formatToman, formatWeightGrams } from "@/lib/pricing";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      include: { items: true },
    }),
    prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } }),
  ]);

  if (!order) notFound();

  return (
    <section className="section">
      <div className="shell two-col">
        <div className="panel stack">
          <div>
            <p className="eyebrow">پیگیری سفارش</p>
            <h1 style={{ margin: 0 }}>{order.publicCode}</h1>
            <p className="muted">وضعیت: {orderStatusLabels[order.status]}</p>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>محصول</th>
                <th>وزن</th>
                <th>تعداد</th>
                <th>مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.titleSnap}</td>
                  <td>{formatWeightGrams(item.weightGramsSnap)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatToman(item.lineTotalToman)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="price" style={{ fontSize: "1.3rem" }}>
            جمع: {formatToman(order.subtotalToman)}
          </p>
          <p className="muted">
            روش تحویل: {deliveryLabels[order.deliveryMethod]}
            <br />
            مهلت پرداخت: {formatFaDateTime(order.expiresAt)}
          </p>
        </div>

        <aside className="panel stack">
          <h2 style={{ margin: 0 }}>پرداخت کارت‌به‌کارت</h2>
          <div className="alert">
            <p style={{ margin: "0 0 0.4rem" }}>
              مبلغ دقیق <strong>{formatToman(order.subtotalToman)}</strong> را به
              کارت زیر واریز کنید:
            </p>
            <p style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>
              {settings.bankCardNumber}
            </p>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              به نام {settings.bankCardHolder} — بانک {settings.bankName}
            </p>
          </div>

          <OrderPaymentPanel
            orderId={order.id}
            status={order.status}
            expiresAtIso={order.expiresAt.toISOString()}
            receiptPath={order.receiptPath}
          />

          <p className="muted" style={{ fontSize: "0.88rem" }}>
            بعد از تأیید فیش، وضعیت به «تأیید شده» تغییر می‌کند و برای ارسال/تحویل
            با شما هماهنگ می‌شود.
          </p>
          <Link href="/contact" className="btn btn-ghost btn-sm">
            نیاز به پشتیبانی؟
          </Link>
        </aside>
      </div>
    </section>
  );
}
