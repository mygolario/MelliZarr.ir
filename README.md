# ملی‌زر | MelliZarr.ir

فروشگاه اینترنتی سکه و طلا با قیمت‌گذاری بر اساس نرخ روز.

## امکانات نسخه اول

- کاتالوگ فارسی RTL (الیزابت/پارسیان + سکه غیر بانکی)
- محاسبه خودکار قیمت از وزن × نرخ روز + اجرت
- سبد خرید، ثبت سفارش، پرداخت کارت‌به‌کارت و آپلود فیش
- پنل ادمین: نرخ روز، کارت بانکی، محصولات، وضعیت سفارش‌ها
- دیتابیس Postgres آماده برای Vercel

## راه‌اندازی محلی

```bash
npm install
cp .env.example .env   # DATABASE_URL را از Prisma بگذارید
npx prisma migrate dev
npm run db:seed
npm run dev
```

سایت: http://localhost:3000  
ادمین: http://localhost:3000/admin

راهنمای Deploy: [DEPLOY.md](./DEPLOY.md)

## اسکریپت‌ها

| دستور | کار |
|--------|-----|
| `npm run dev` | سرور توسعه |
| `npm run build` | بیلد تولید |
| `npm run db:seed` | بارگذاری محصولات اولیه |
| `npm run db:deploy` | اعمال مایگریشن روی production |
| `npm run vercel-build` | بیلد مخصوص Vercel (migrate + seed + build) |

## فازهای بعدی

1. درگاه پرداخت آنلاین + پیامک وضعیت
2. همگام‌سازی خودکار نرخ طلا
3. دستیار پاسخ‌گویی به سؤالات محصول/قیمت
