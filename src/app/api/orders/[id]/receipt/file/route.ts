import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    select: { receiptData: true, receiptMime: true, publicCode: true },
  });

  if (!order?.receiptData || !order.receiptMime) {
    return NextResponse.json({ error: "فیش پیدا نشد." }, { status: 404 });
  }

  const bytes = Buffer.from(order.receiptData, "base64");
  const ext =
    order.receiptMime === "application/pdf"
      ? "pdf"
      : order.receiptMime === "image/png"
        ? "png"
        : order.receiptMime === "image/webp"
          ? "webp"
          : "jpg";

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": order.receiptMime,
      "Content-Disposition": `inline; filename="${order.publicCode}.${ext}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
