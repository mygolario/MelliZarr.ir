import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE_NAME,
  createSessionToken,
  verifyAdminPassword,
} from "@/lib/auth";

export const metadata = { title: "ورود ادمین" };

async function loginAction(formData: FormData) {
  "use server";
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(username, password)) {
    redirect("/admin/login?error=1");
  }
  const jar = await cookies();
  jar.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <section className="section">
      <div className="shell panel form-grid" style={{ maxWidth: "24rem" }}>
        <h1 style={{ margin: 0 }}>ورود ادمین</h1>
        <form action={loginAction} className="form-grid">
          <label>
            نام کاربری
            <input name="username" autoComplete="username" required />
          </label>
          <label>
            رمز عبور
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          {params.error ? (
            <div className="alert alert-warn">اطلاعات ورود نادرست است.</div>
          ) : null}
          <button type="submit" className="btn btn-gold">
            ورود
          </button>
        </form>
      </div>
    </section>
  );
}
