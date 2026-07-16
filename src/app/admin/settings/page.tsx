import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatToman } from "@/lib/pricing";

export const dynamic = "force-dynamic";

async function updateSettingsAction(formData: FormData) {
  "use server";
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const pricePerGram = Number(formData.get("pricePerGram"));
  const orderValidityMins = Number(formData.get("orderValidityMins"));
  if (!Number.isFinite(pricePerGram) || pricePerGram <= 0) {
    redirect("/admin/settings?error=rate");
  }

  await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      pricePerGram: Math.round(pricePerGram),
      priceUpdatedAt: new Date(),
      bankCardNumber: String(formData.get("bankCardNumber") ?? "").trim(),
      bankCardHolder: String(formData.get("bankCardHolder") ?? "").trim(),
      bankName: String(formData.get("bankName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      telegram: String(formData.get("telegram") ?? "").trim(),
      instagram: String(formData.get("instagram") ?? "").trim(),
      orderValidityMins: Number.isFinite(orderValidityMins)
        ? Math.max(5, Math.round(orderValidityMins))
        : 20,
      shippingNote: String(formData.get("shippingNote") ?? "").trim(),
      pickupNote: String(formData.get("pickupNote") ?? "").trim(),
    },
  });

  redirect("/admin/settings?saved=1");
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const params = await searchParams;
  const settings = await prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } });

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

      <h1>نرخ طلا و تنظیمات فروشگاه</h1>
      {params.saved ? <div className="alert">ذخیره شد.</div> : null}
      {params.error ? (
        <div className="alert alert-warn">نرخ واردشده معتبر نیست.</div>
      ) : null}

      <form action={updateSettingsAction} className="panel form-grid">
        <label>
          نرخ هر گرم (تومان) — الان {formatToman(settings.pricePerGram)}
          <input
            name="pricePerGram"
            type="number"
            defaultValue={settings.pricePerGram}
            required
          />
        </label>
        <label>
          مهلت پرداخت سفارش (دقیقه)
          <input
            name="orderValidityMins"
            type="number"
            defaultValue={settings.orderValidityMins}
            min={5}
            required
          />
        </label>
        <label>
          شماره کارت
          <input name="bankCardNumber" defaultValue={settings.bankCardNumber} required />
        </label>
        <label>
          نام صاحب کارت
          <input name="bankCardHolder" defaultValue={settings.bankCardHolder} required />
        </label>
        <label>
          بانک
          <input name="bankName" defaultValue={settings.bankName} required />
        </label>
        <label>
          تلفن
          <input name="phone" defaultValue={settings.phone} required />
        </label>
        <label>
          واتساپ (مثلاً 98912...)
          <input name="whatsapp" defaultValue={settings.whatsapp} required />
        </label>
        <label>
          تلگرام
          <input name="telegram" defaultValue={settings.telegram} />
        </label>
        <label>
          اینستاگرام (بدون @)
          <input name="instagram" defaultValue={settings.instagram} />
        </label>
        <label>
          متن ارسال
          <textarea name="shippingNote" rows={2} defaultValue={settings.shippingNote} />
        </label>
        <label>
          متن تحویل حضوری
          <textarea name="pickupNote" rows={2} defaultValue={settings.pickupNote} />
        </label>
        <button type="submit" className="btn btn-gold">
          ذخیره تنظیمات
        </button>
      </form>
    </section>
  );
}
