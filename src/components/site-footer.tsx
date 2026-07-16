import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-brand">{siteConfig.brandFa}</p>
          <p className="muted">{siteConfig.tagline}</p>
        </div>
        <div className="footer-links">
          <Link href="/products">محصولات</Link>
          <Link href="/faq">راهنما</Link>
          <Link href="/contact">پشتیبانی</Link>
          <Link href="/admin">ورود ادمین</Link>
        </div>
        <p className="footer-note muted">
          قیمت‌ها بر اساس نرخ روز طلا محاسبه می‌شوند و تا زمان تأیید پرداخت
          ممکن است تغییر کنند.
        </p>
      </div>
    </footer>
  );
}
