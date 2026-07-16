# Deploy ملی‌زر روی Vercel

## دیتابیس

Prisma Postgres به پروژه لینک شده (`db_aqkdgrz0265pq5apom9xwoz2`).  
`DATABASE_URL` فقط داخل `.env` محلی است (کامیت نمی‌شود).

## تنظیمات Vercel → Environment Variables

از Prisma Console یا فایل `.env` محلی این‌ها را کپی کنید (مقدارها را اینجا ننویسید):

| Name | از کجا |
|------|--------|
| `DATABASE_URL` | `.env` بعد از `prisma postgres link` |
| `ADMIN_USERNAME` | `Elcanye` |
| `ADMIN_PASSWORD` | همان مقدار `.env` |

Framework Preset باید **Next.js** باشد. Branch: **main**.

بیلد از `npm run vercel-build` استفاده می‌کند (migrate + seed + build).

## بعد از Deploy

1. `/admin` → نرخ طلا و شماره کارت واقعی
2. Domains → اتصال `MelliZarr.ir`

### اگر در موبایل «This page couldn't load» دیدید

دامنه `*.vercel.app` از بعضی شبکه‌های ایران ناپایدار است. دامنه اختصاصی `MelliZarr.ir` را در Vercel → Domains وصل کنید و همان را باز کنید.
