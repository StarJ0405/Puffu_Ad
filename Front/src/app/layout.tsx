import FontLists from "@/fonts";
import ProviderWrapper from "@/providers/ProviderWrapper";
import type { Metadata } from "next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../resources/css/global.css";
import "../resources/css/normalize.css";
import "../resources/css/quill.css";
import "../resources/css/swiperStyle.css";

export const metadata: Metadata = {
  title: "성인용품 | 푸푸토이 | 감각적인 러브라이프",
  description:
    "성인용품 할인점 푸푸토이에서 당신의 취향에 맞춘 즐거움을 찾아보세요! 콘돔과 러브젤, SM 제품은 물론 애착 기구까지 프라이빗한 순간에는 고품격 러브토이 전문 스토어 푸푸토이",
  openGraph: {
    url: "https://puffutoy.com",
    type: "website",
    title: "특별한 밤을 위한 당신의 선택 푸푸토이",
    description:
      "성인용품 할인점 푸푸토이에서 당신의 취향에 맞춘 즐거움을 찾아보세요! 콘돔과 러브젤, SM 제품은 물론 애착 기구까지 프라이빗한 순간에는 고품격 러브토이 전문 스토어 푸푸토이",
    images: "https://puffutoy.com/org-img.png",
  },
  twitter: {
    card: "summary",
    title: "특별한 밤을 위한 당신의 선택 푸푸토이",
    description:
      "성인용품 할인점 푸푸토이에서 당신의 취향에 맞춘 즐거움을 찾아보세요! 콘돔과 러브젤, SM 제품은 물론 애착 기구까지 프라이빗한 순간에는 고품격 러브토이 전문 스토어 푸푸토이",
    images: "https://puffutoy.com/org-img.png",
  },
  keywords:
    "푸푸토이, 성인용품, 성인용품사이트, 온라인성인용품, 남자성인용품, 여자성인용품, 성인용품매장, 코스프레, 코스프레의상, 이벤트속옷, 바니룸, 섹시속옷, 콘돔, 란제리, 바이브레이터, 우머나이저, 딜도, 오나홀, 진동기, 러브젤추천, 커플아이템",
  icons: "/favicon.ico",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={FontLists}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
        />
        <meta name="theme-color" content="#000" />
      </head>
      <body>
        <ProviderWrapper>
          {/*  */}
          {children}
          {/*  */}
        </ProviderWrapper>
      </body>
    </html>
  );
}
