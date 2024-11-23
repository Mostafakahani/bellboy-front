import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // دریافت مسیر درخواست
  const pathname = request.nextUrl.pathname;

  // بررسی وضعیت احراز هویت
  const isAuthenticated = checkAuthStatus(request);

  // بررسی اینکه آیا مسیر مربوط به داشبورد است
  const isDashboardRoute = pathname.startsWith("/dashboard");
  // بررسی اینکه آیا مسیر مربوط به پروفایل است
  const isProfileRoute = pathname.startsWith("/profile");
  // بررسی اینکه آیا مسیر مربوط به صفحه ورود است
  const isAuthRoute = pathname === "/profile/auth";

  // اگر کاربر لاگین نکرده و سعی در دسترسی به صفحات محافظت شده دارد
  if (!isAuthenticated && (isDashboardRoute || (isProfileRoute && !isAuthRoute))) {
    // ذخیره مسیر فعلی برای ریدایرکت بعد از لاگین
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/profile/auth?callbackUrl=${callbackUrl}`, request.url));
  }

  // اگر کاربر لاگین کرده و سعی در دسترسی به صفحه ورود دارد
  if (isAuthenticated && isAuthRoute) {
    // اگر callbackUrl وجود داشت به آن مسیر برگردد، در غیر این صورت به داشبورد
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    return NextResponse.redirect(new URL(callbackUrl || "/profile", request.url));
  }

  return NextResponse.next();
}

// تعریف مسیرهای محافظت شده
export const config = {
  matcher: [
    // مسیرهای پروفایل
    "/profile",
    "/profile/auth",
    "/profile/edit/:path*",
    "/profile/address/:path*",
    "/profile/orders/:path*",

    // مسیرهای داشبورد
    "/dashboard",
    "/dashboard/products",
    "/dashboard/products/:path*",
    "/dashboard/orders",
    "/dashboard/orders/:path*",
    "/dashboard/categories",
    "/dashboard/categories/:path*",
    "/dashboard/users",
    "/dashboard/users/:path*",
    "/dashboard/settings",
    "/dashboard/settings/:path*",
    "/dashboard/clean",
    "/dashboard/clean/:path*",
    "/dashboard/delivery-time",
    "/dashboard/delivery-time/:path*",
  ],
};

function checkAuthStatus(request: NextRequest): boolean {
  const token = request.cookies.get("auth_token");

  // می‌توانید اینجا منطق پیچیده‌تری برای بررسی توکن اضافه کنید
  // مثلاً بررسی اعتبار توکن، نقش کاربر و غیره
  return !!token;
}
