"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ReceiptUploadForm } from "@/components/receipt-upload-form";

type Props = {
  orderId: string;
  status: string;
  expiresAtIso: string;
  receiptPath: string | null;
};

export function OrderPaymentPanel({
  orderId,
  status,
  expiresAtIso,
  receiptPath,
}: Props) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const expiresAt = new Date(expiresAtIso).getTime();
    const tick = () => setExpired(Date.now() > expiresAt);
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [expiresAtIso]);

  if (receiptPath) {
    return (
      <div className="alert">
        فیش دریافت شد و در صف بررسی است.
        <div style={{ marginTop: "0.5rem" }}>
          <Link href={receiptPath} target="_blank">
            مشاهده فایل آپلودشده
          </Link>
        </div>
      </div>
    );
  }

  if (expired || status === "CANCELLED") {
    return (
      <div className="alert alert-warn">
        این سفارش دیگر قابل پرداخت نیست.{" "}
        <Link href="/products">سفارش جدید</Link>
      </div>
    );
  }

  if (status !== "PENDING_PAYMENT") {
    return (
      <p className="muted">وضعیت فعلی سفارش اجازه آپلود فیش جدید نمی‌دهد.</p>
    );
  }

  return <ReceiptUploadForm orderId={orderId} />;
}
