import { requester } from "@/shared/Requester";
import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 헤더 가져오기
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host");
  const proto = headerList.get("x-forwarded-proto");
  const subdomain = headerList.get("x-subdomain") || "";
  // 도메인 결정
  const origin = `${proto}://${host}`;

  // 공통 페이지 경로
  const pages = ["/", "/best", "/new", "/hot", "/board/notice"];

  // Sitemap 객체 생성
  const commonSitemap: MetadataRoute.Sitemap = pages.map((path) => ({
    url: `${origin}${path}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily",
    priority: 1.0,
  }));

  let domainSiteMap: MetadataRoute.Sitemap = [];
  const store = (
    await requester.getStores({
      subdomain: subdomain ? subdomain : null,
      select: "id",
    })
  ).content?.[0];
  const categories = (
    await requester.getCategories({
      store_id: store?.id,
      select: ["id", "updated_at"],
    })
  ).content;
  const products = (
    await requester.getProducts({
      store_id: store.id,
      select: ["id", "updated_at"],
      _origin: true,
    })
  )?.content;
  const notices = (
    await requester.getNotices({
      store_id: store.id,
      select: ["id", "updated_at"],
    })
  )?.content;
  // 메인
  domainSiteMap = [
    //--카테고리
    ...categories.map((c: CategoryData) => ({
      url: `${origin}/categories/${c.id}`, //카테고리 경로
      lastModified: c.updated_at, //업데이트된 날짜
      changeFrequency: "daily",
      priority: 0.8,
    })),
    //--상품 상세페이지
    // ...products.map((p: ProductData) => ({
    //   url: `${origin}/products/${p.id}`, //상품 경로
    //   lastModified: p.updated_at, //업데이트된 날짜
    //   changeFrequency: "daily",
    //   priority: 0.8,
    // })),
    //--공지사항 상세
    // ...notices.map((n: NoticeData) => ({
    //   url: `${origin}/board/notice/${n.id}`, //공지사항 경로
    //   lastModified: n.updated_at, //업데이트된 날짜
    //   changeFrequency: "daily",
    //   priority: 0.8,
    // })),
  ];

  return [...commonSitemap, ...(domainSiteMap || [])];
}
