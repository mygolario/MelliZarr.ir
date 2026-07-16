import { getSiteSettingsCached } from "@/lib/catalog";

export const revalidate = 60;
export const metadata = { title: "تماس" };

export default async function ContactPage() {
  const settings = await getSiteSettingsCached();
  if (!settings) {
    return (
      <section className="section">
        <div className="shell panel">
          <p className="muted">اطلاعات تماس فعلاً در دسترس نیست.</p>
        </div>
      </section>
    );
  }

  const wa = settings.whatsapp.replace(/\D/g, "");

  return (
    <section className="section">
      <div className="shell panel stack" style={{ maxWidth: "40rem" }}>
        <p className="eyebrow">پشتیبانی</p>
        <h1 style={{ margin: 0 }}>تماس با ملی‌زر</h1>
        <p className="muted">
          برای مشاوره وزن، موجودی یا پیگیری سفارش از راه‌های زیر استفاده کنید.
        </p>
        <ul style={{ margin: 0, paddingInlineStart: "1.1rem" }}>
          <li>تلفن: {settings.phone}</li>
          <li>
            واتساپ:{" "}
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
              شروع گفتگو
            </a>
          </li>
          {settings.instagram ? <li>اینستاگرام: @{settings.instagram}</li> : null}
        </ul>
        <p className="muted" style={{ fontSize: "0.9rem" }}>
          {settings.pickupNote}
          <br />
          {settings.shippingNote}
        </p>
      </div>
    </section>
  );
}
