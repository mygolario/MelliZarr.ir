-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "weightGrams" REAL NOT NULL,
    "wagePercent" REAL NOT NULL DEFAULT 2,
    "fixedMarkup" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 50,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "pricePerGram" INTEGER NOT NULL,
    "priceUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL DEFAULT '',
    "deliveryMethod" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "pricePerGramSnap" INTEGER NOT NULL,
    "subtotalToman" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "receiptPath" TEXT,
    "adminNote" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "titleSnap" TEXT NOT NULL,
    "weightGramsSnap" REAL NOT NULL,
    "unitPriceToman" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "lineTotalToman" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Order_publicCode_key" ON "Order"("publicCode");
