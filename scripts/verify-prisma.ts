import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const productCount = await prisma.product.count();
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    throw new Error("SiteSettings row missing after seed");
  }
  console.log(`✅ Connected. products=${productCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
