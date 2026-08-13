import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sourceRedirects } from "@/data/migration-gaps";

const redirectMap = new Map(
  sourceRedirects.map((item) => [item.from, item.to]),
);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    process.env.NODE_ENV === "production" &&
    pathname.startsWith("/design-system")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/_not-found";
    return NextResponse.rewrite(url);
  }

  // Skip admin/api for redirects
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
    const target =
      redirectMap.get(pathname) ??
      redirectMap.get(withSlash) ??
      (pathname !== "/" && !pathname.endsWith("/")
        ? redirectMap.get(`${pathname}/`)
        : undefined);

    if (target && target !== pathname && target !== withSlash) {
      const url = request.nextUrl.clone();
      url.pathname = target;
      return NextResponse.redirect(url, 308);
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  // Security / caching hints for HTML documents
  if (!pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads/).*)"],
};
