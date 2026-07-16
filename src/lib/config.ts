export const siteConfig = {
  brandFa: "ملی‌زر",
  brandEn: "MelliZarr",
  domain: "MelliZarr.ir",
  tagline: "خرید امن سکه و طلای آب‌شده با نرخ روز",
  description:
    "ملی‌زر؛ فروشگاه اینترنتی سکه الیزابت، پارسیان و سکه‌های غیر بانکی با قیمت‌گذاری شفاف بر اساس نرخ روز طلا.",
} as const;

export const categoryLabels = {
  ELIZABETH_PARSIAN: "سکه الیزابت / پارسیان",
  NON_BANK: "سکه غیر بانکی",
} as const;

export const orderStatusLabels = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  AWAITING_REVIEW: "در حال بررسی فیش",
  CONFIRMED: "تأیید شده",
  SHIPPED: "ارسال شده",
  CANCELLED: "لغو شده",
} as const;

export const deliveryLabels = {
  TEHRAN_PICKUP: "تحویل حضوری تهران",
  IRAN_SHIPPING: "ارسال سراسر ایران",
} as const;
