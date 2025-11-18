import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host");
  const proto = headerList.get("x-forwarded-proto");
  const origin = `${proto}://${host}`;
  const subdomain = headerList.get("x-subdomain") || "";
  let robots: MetadataRoute.Robots = {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/auth/login/",
        "/auth/signup/",
        "/signup/",
        "/mypage/",
        "/orders/",
        "/admin/",
      ],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
  if (!subdomain) {
    // 메인
  } else if (subdomain === "point") {
    // 포인트몰
  }
  return robots;
}
