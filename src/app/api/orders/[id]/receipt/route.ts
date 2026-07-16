import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "سفارش پیدا نشد." }, { status: 404 });
  }

  if (order.status === "CANCELLED") {
    return NextResponse.json({ error: "این سفارش لغو شده است." }, { status: 400 });
  }

  if (order.expiresAt.getTime() < Date.now() && order.status === "PENDING_PAYMENT") {
    await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED", adminNote: "منقضی به‌خاطر عدم پرداخت به‌موقع" },
    });
    return NextResponse.json(
      { error: "مهلت پرداخت تمام شده. سفارش جدید ثبت کنید." },
      { status: 400 },
    );
  }

  const form = await request.formData();
  const file = form.get("receipt");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "فایل فیش را انتخاب کنید." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "حجم فایل حداکثر ۵ مگابایت." }, { status: 400 });
  }

  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
  if (!allowed.has(file.type)) {
    return NextResponse.json(
      { error: "فقط JPG، PNG، WEBP یا PDF مجاز است." },
      { status: 400 },
    );
  }

  const ext =
    file.type === "application/pdf"
      ? "pdf"
      : file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";

  const dir = path.join(process.cwd(), "public", "uploads", "receipts");
  await mkdir(dir, { recursive: true });
  const filename = `${order.publicCode}-${Date.now()}.${ext}`;
  const abs = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(abs, buffer);

  const receiptPath = `/uploads/receipts/${filename}`;
  await prisma.order.update({
    where: { id },
    data: {
      receiptPath,
      status: "AWAITING_REVIEW",
    },
  });

  return NextResponse.json({ ok: true, receiptPath });
}
