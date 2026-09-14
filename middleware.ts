import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Admin panelini gizli bir yolun arkasına koyar.
 * - ADMIN_PATH ortam değişkeni tanımlıysa (ör. "gizli-x9f2k7"):
 *     • /gizli-x9f2k7  → içeride /admin'e yönlendirilir (adres çubuğunda gizli yol kalır)
 *     • /admin doğrudan denenirse 404 döner
 * - ADMIN_PATH tanımsızsa (lokal geliştirme): /admin normal çalışır.
 * Gizli yol yalnızca ortam değişkeninde durur; kodda/GitHub'da görünmez.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const adminPath = process.env.ADMIN_PATH?.trim().replace(/^\/+/, "");

  if (adminPath) {
    const secret = "/" + adminPath;
    // Gizli yol → /admin (rewrite)
    if (pathname === secret || pathname.startsWith(secret + "/")) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin" + pathname.slice(secret.length);
      return NextResponse.rewrite(url);
    }
    // Doğrudan /admin erişimini engelle
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // api, _next ve statik dosyalar hariç tüm sayfa yolları
  matcher: ["/((?!api|_next|.*\\.).*)"],
};
