import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Cookies } from "./shared/utils/Data";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|org-img.png|assets|resources).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  if (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/_next/image/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/resources/")
  ) {
    return NextResponse.next();
  }

  const hostname = req.headers.get("host")?.split(":")?.[0] || "";

  const userAgent = req.headers.get("user-agent");
  const deviceType = getDeviceType(userAgent);
  const subdomain = hostname.split(".")[0];
  const mains = (process.env.NEXT_PUBLIC_MAIN_DOMAIN || "").split(",");
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-searchParams", url.search);

  if (
    subdomain === "www" ||
    mains.some((main) => main?.split(".")?.[0] === subdomain)
  ) {
    const jwt = req.cookies.get(Cookies.JWT);
    if (jwt && jwt.value) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK}/users/me`,
        {
          headers: {
            Authorization: jwt.value,
          },
        }
      );

      const user = response.data.user;
      if (!user?.id && pathname !== "/" && !pathname.startsWith("/auth"))
        return NextResponse.redirect(
          new URL(`/auth/login?redirect_url=${pathname}`, req.url)
        );
    } else if (pathname !== "/" && !pathname.startsWith("/auth"))
      return NextResponse.redirect(
        new URL(`/auth/login?redirect_url=${pathname}`, req.url)
      );
    return NextResponse.rewrite(
      new URL(`/$main/${deviceType}${pathname}${url.search}`, req.url),
      {
        request: {
          headers: requestHeaders,
        },
      }
    );
  }
  requestHeaders.set("x-subdomain", subdomain);
  return NextResponse.rewrite(
    new URL(`/${subdomain}/${deviceType}${pathname}${url.search}`, req.url),
    {
      request: {
        headers: requestHeaders,
      },
    }
  );
}

export function getDeviceType(userAgent: string | null): DeviceType {
  if (!userAgent) return "unknown";

  userAgent = userAgent.toLowerCase(); // 대소문자 구분 없이 비교하기 위해 소문자로 변환

  const isAndroid = /android/.test(userAgent);
  const isiPad = /ipad/.test(userAgent);
  const isiPhone = /iphone/.test(userAgent);
  const isiPod = /ipod/.test(userAgent);
  const isBlackBerry = /blackberry/.test(userAgent);
  const isWindowsPhone = /windows phone/.test(userAgent);
  const isOperaMini = /opera mini/.test(userAgent);
  const isWebOS = /webos/.test(userAgent);
  const isKindle = /kindle/.test(userAgent); // 아마존 킨들

  // 태블릿 판별 (일반적인 모바일 키워드가 없으면서 태블릿 특유의 키워드가 있을 때)
  // 'android'이면서 'mobile' 키워드가 없으면 안드로이드 태블릿일 가능성이 높습니다.
  if (
    isiPad ||
    (isAndroid && !/mobile/.test(userAgent)) ||
    isKindle ||
    /tablet|playbook|silk/i.test(userAgent)
  ) {
    // return "tablet";
    return "mobile";
  }

  // 모바일 판별
  if (
    isiPhone ||
    isiPod ||
    isAndroid ||
    isBlackBerry ||
    isWindowsPhone ||
    isOperaMini ||
    isWebOS
  ) {
    return "mobile";
  }

  // 위 조건에 해당하지 않으면 데스크톱으로 간주
  return "desktop";
}
