import "dotenv/config";
import { ProductCategory } from "../src/generated/prisma/client";
import { prisma } from "../lib/prisma";

/** ۱۰۰ سوت = ۱ گرم (عرف بازار سکه‌های پارسیان/الیزابت) */
const SOT_TO_GRAM = 0.01;

function sot(n: number): number {
  return Number((n * SOT_TO_GRAM).toFixed(3));
}

const elizabethWeights = [
  30, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;

const products = [
  ...elizabethWeights.map((sotWeight, index) => ({
    slug: `elizabet-${sotWeight}-sot`,
    title: `سکه الیزابت / پارسیان ${sotWeight} سوت`,
    category: ProductCategory.ELIZABETH_PARSIAN,
    weightGrams: sot(sotWeight),
    sortOrder: index + 1,
    description: `سکه طرح الیزابت و پارسیان با وزن تقریبی ${sot(sotWeight)} گرم (${sotWeight} سوت). قیمت بر اساس نرخ روز طلا محاسبه می‌شود.`,
  })),
  {
    slug: "elizabet-1-gram",
    title: "سکه الیزابت / پارسیان ۱ گرمی",
    category: ProductCategory.ELIZABETH_PARSIAN,
    weightGrams: 1,
    sortOrder: 20,
    description: "سکه طرح الیزابت و پارسیان با وزن ۱ گرم.",
  },
  {
    slug: "elizabet-half-gram",
    title: "سکه الیزابت / پارسیان ۱/۲ گرمی",
    category: ProductCategory.ELIZABETH_PARSIAN,
    weightGrams: 0.5,
    sortOrder: 21,
    description: "سکه طرح الیزابت و پارسیان با وزن ۰٫۵ گرم.",
  },
  {
    slug: "elizabet-fifth-gram",
    title: "سکه الیزابت / پارسیان ۱/۵ گرمی",
    category: ProductCategory.ELIZABETH_PARSIAN,
    weightGrams: 0.2,
    sortOrder: 22,
    description: "سکه طرح الیزابت و پارسیان با وزن ۰٫۲ گرم (۱/۵ گرم).",
  },
  {
    slug: "nonbank-quarter",
    title: "ربع سکه غیر بانکی",
    category: ProductCategory.NON_BANK,
    weightGrams: 2.03,
    sortOrder: 30,
    description: "ربع سکه غیر بانکی با وزن تقریبی ۲٫۰۳ گرم.",
  },
  {
    slug: "nonbank-half",
    title: "نیم سکه غیر بانکی",
    category: ProductCategory.NON_BANK,
    weightGrams: 4.06,
    sortOrder: 31,
    description: "نیم سکه غیر بانکی با وزن تقریبی ۴٫۰۶ گرم.",
  },
  {
    slug: "nonbank-full",
    title: "تمام سکه غیر بانکی",
    category: ProductCategory.NON_BANK,
    weightGrams: 8.13,
    sortOrder: 32,
    description: "تمام سکه غیر بانکی با وزن تقریبی ۸٫۱۳۰ گرم.",
  },
];

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      pricePerGram: 7_200_000,
      bankCardNumber: "6037-XXXX-XXXX-XXXX",
      bankCardHolder: "ملی‌زر",
      bankName: "ملت",
      phone: "021-00000000",
      whatsapp: "989120000000",
      telegram: "",
      instagram: "mellizarr",
      orderValidityMins: 20,
    },
    update: {},
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        ...product,
        wagePercent: product.category === ProductCategory.NON_BANK ? 1.5 : 2,
        fixedMarkup: 0,
        stock: 30,
        active: true,
      },
      update: {
        title: product.title,
        weightGrams: product.weightGrams,
        description: product.description,
        sortOrder: product.sortOrder,
      },
    });
  }

  console.log(`Seeded ${products.length} products and site settings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
