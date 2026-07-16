import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createPublicOrderCode } from "@/lib/ids";
import { calculateUnitPriceToman } from "@/lib/pricing";

export const runtime = "nodejs";

const bodySchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  customerPhone: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  customerAddress: z.string().trim().max(500).optional().default(""),
  deliveryMethod: z.enum(["TEHRAN_PICKUP", "IRAN_SHIPPING"]),
  notes: z.string().trim().max(500).optional().default(""),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(30),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "اطلاعات ناقص است." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.deliveryMethod === "IRAN_SHIPPING" && data.customerAddress.length < 8) {
    return NextResponse.json(
      { error: "برای ارسال، آدرس کامل را وارد کنید." },
      { status: 400 },
    );
  }

  const settings = await prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } });
  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== new Set(productIds).size) {
    return NextResponse.json(
      { error: "یکی از محصولات سبد دیگر موجود نیست." },
      { status: 400 },
    );
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  let subtotal = 0;
  const lineCreates: {
    productId: string;
    titleSnap: string;
    weightGramsSnap: number;
    unitPriceToman: number;
    quantity: number;
    lineTotalToman: number;
  }[] = [];

  for (const item of data.items) {
    const product = byId.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "محصول نامعتبر." }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `موجودی «${product.title}» کافی نیست.` },
        { status: 400 },
      );
    }
    const unit = calculateUnitPriceToman({
      weightGrams: product.weightGrams,
      pricePerGram: settings.pricePerGram,
      wagePercent: product.wagePercent,
      fixedMarkup: product.fixedMarkup,
    });
    const lineTotal = unit * item.quantity;
    subtotal += lineTotal;
    lineCreates.push({
      productId: product.id,
      titleSnap: product.title,
      weightGramsSnap: product.weightGrams,
      unitPriceToman: unit,
      quantity: item.quantity,
      lineTotalToman: lineTotal,
    });
  }

  const expiresAt = new Date(Date.now() + settings.orderValidityMins * 60_000);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of data.items) {
      const updated = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count !== 1) {
        throw new Error("STOCK");
      }
    }

    return tx.order.create({
      data: {
        publicCode: createPublicOrderCode(),
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        deliveryMethod: data.deliveryMethod,
        notes: data.notes,
        pricePerGramSnap: settings.pricePerGram,
        subtotalToman: subtotal,
        expiresAt,
        items: { create: lineCreates },
      },
      select: { id: true, publicCode: true },
    });
  }).catch((error: unknown) => {
    if (error instanceof Error && error.message === "STOCK") {
      return null;
    }
    throw error;
  });

  if (!order) {
    return NextResponse.json(
      { error: "موجودی یکی از محصولات در لحظه ثبت کافی نبود." },
      { status: 409 },
    );
  }

  return NextResponse.json({ id: order.id, publicCode: order.publicCode });
}
