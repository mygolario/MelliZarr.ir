import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export const getSiteSettingsCached = unstable_cache(
  async () => prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ["site-settings-v1"],
  { revalidate: 60, tags: ["site-settings"] },
);

export const getFeaturedProductsCached = unstable_cache(
  async () =>
    prisma.product.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
  ["featured-products-v1"],
  { revalidate: 60, tags: ["products"] },
);

export const getActiveProductsCached = unstable_cache(
  async () =>
    prisma.product.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ["active-products-v1"],
  { revalidate: 60, tags: ["products"] },
);

export const getProductBySlugCached = unstable_cache(
  async (slug: string) => prisma.product.findUnique({ where: { slug } }),
  ["product-by-slug-v1"],
  { revalidate: 60, tags: ["products"] },
);
