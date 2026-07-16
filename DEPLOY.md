# Deploy ملی‌زر روی Vercel

## ۱) دیتابیس را Claim کنید (حتماً)

دیتابیس موقت Prisma Postgres ساخته شده. اگر Claim نشود بعد از ۲۴ ساعت پاک می‌شود:

https://create-db.prisma.io/claim?projectID=proj_f472leoii33xyg0ta5dkzid7&utm_source=create-db&utm_medium=cli

بعد از Claim، `DATABASE_URL` را از داشبورد Prisma کپی کنید.

## ۲) تنظیمات صفحه New Project در Vercel

| فیلد | مقدار |
|------|--------|
| Framework Preset | **Next.js** (نه Other) |
| Root Directory | `./` |
| Branch | `main` |

### Environment Variables

| Name | Value |
|------|--------|
| `DATABASE_URL` | همان connection string بعد از Claim |
| `ADMIN_USERNAME` | مثلاً `admin` |
| `ADMIN_PASSWORD` | رمز قوی خودتان |

بعد Deploy را بزنید. بیلد خودش migrate و seed را اجرا می‌کند.

## ۳) بعد از Deploy

1. وارد `/admin` شوید و نرخ طلا + شماره کارت واقعی را تنظیم کنید
2. دامنه اختصاصی را در Vercel → Domains وصل کنید
