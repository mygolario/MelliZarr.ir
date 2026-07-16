-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ELIZABETH_PARSIAN', 'NON_BANK');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'AWAITING_REVIEW', 'CONFIRMED', 'SHIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('TEHRAN_PICKUP', 'IRAN_SHIPPING');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "weightGrams" DOUBLE PRECISION NOT NULL,
    "wagePercent" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "fixedMarkup" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 50,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "pricePerGram" INTEGER NOT NULL,
    "priceUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bankCardNumber" TEXT NOT NULL,
    "bankCardHolder" TEXT NOT NULL,
    "bankName" TEXT NOT NULL DEFAULT 'ملت',
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "telegram" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "orderValidityMins" INTEGER NOT NULL DEFAULT 20,
    "shippingNote" TEXT NOT NULL DEFAULT 'ارسال با بیمه و بسته‌بندی امن در سراسر ایران',
    "pickupNote" TEXT NOT NULL DEFAULT 'تحویل حضوری در تهران با هماهنگی قبلی',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "publicCode" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL DEFAULT '',
    "deliveryMethod" "DeliveryMethod" NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "pricePerGramSnap" INTEGER NOT NULL,
    "subtotalToman" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "receiptPath" TEXT,
    "receiptMime" TEXT,
    "receiptData" TEXT,
    "adminNote" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "titleSnap" TEXT NOT NULL,
    "weightGramsSnap" DOUBLE PRECISION NOT NULL,
    "unitPriceToman" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lineTotalToman" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Order_publicCode_key" ON "Order"("publicCode");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
