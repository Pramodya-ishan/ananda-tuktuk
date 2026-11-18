import { NextResponse, type NextRequest } from "next/server";
import { localeCookie, localeFromSegment, localePath, preferredLocale } from "@/lib/i18n/locale";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const segment = url.pathname.split("/")[1];
  if (localeFromSegment(segment.toLowerCase())) {
    if (segment === segment.toLowerCase()) return NextResponse.next();
    url.pathname = `/${segment.toLowerCase()}${url.pathname.slice(segment.length + 1)}`;
    return NextResponse.redirect(url, 308);
  }
  const locale = preferredLocale(request.cookies.get(localeCookie)?.value, request.headers.get("accept-language"));
  url.pathname = locale === "en" ? `/en${url.pathname === "/" ? "" : url.pathname}` : localePath(locale, url.pathname);
  const response = locale === "en" ? NextResponse.rewrite(url) : NextResponse.redirect(url);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/", "/about", "/tours", "/contact", "/:language([eE][nN]|[dD][eE]|[fF][rR]|[rR][uU]|[zZ][hH]-[cC][nN])/:path*"],
};
