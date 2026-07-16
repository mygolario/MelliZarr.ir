import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { CartBadge } from "@/components/cart-badge";

const links = [
  { href: "/products", label: "محصولات" },
  { href: "/about", label: "درباره ما" },
  { href: "/faq", label: "سؤالات متداول" },
  { href: "/contact", label: "تماس" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand-mark">
          <span className="brand-fa">{siteConfig.brandFa}</span>
          <span className="brand-en">{siteConfig.domain}</span>
        </Link>
        <nav className="main-nav" aria-label="منوی اصلی">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <CartBadge />
          <Link href="/checkout" className="btn btn-gold btn-sm">
            ثبت سفارش
          </Link>
        </div>
      </div>
    </header>
  );
}
