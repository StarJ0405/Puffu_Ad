import clsx from "clsx";
import localFont from "next/font/local";
// 나눔바른고딕
export const NanumBarunGothic = localFont({
  src: [
    {
      path: "../../public/resources/fonts/NanumBarunGothicUltraLight.woff2",
      weight: "200",
    },
    {
      path: "../../public/resources/fonts/NanumBarunGothicLight.woff2",
      weight: "300",
    },
    {
      path: "../../public/resources/fonts/NanumBarunGothic.woff2",
      weight: "400",
    },
    {
      path: "../../public/resources/fonts/NanumBarunGothicBold.woff2",
      weight: "700",
    },
  ],
  display: "swap",
  variable: "--font-barun-gothic",
});
// 나눔브러쉬
export const BrushFont = localFont({
  src: "../../public/resources/fonts/NanumBrush.woff2",
  display: "swap",
  variable: "--font-brush",
});
// 나눔고딕
export const NanumGothic = localFont({
  src: [
    {
      path: "../../public/resources/fonts/NanumGothicLight.woff2",
      weight: "300",
    },
    {
      path: "../../public/resources/fonts/NanumGothic.woff2",
      weight: "400",
    },
    {
      path: "../../public/resources/fonts/NanumGothicBold.woff2",
      weight: "700",
    },
    {
      path: "../../public/resources/fonts/NanumGothicExtraBold.woff2",
      weight: "800",
    },
  ],
  display: "swap",
  variable: "--font-gothic",
});
// 나눔휴먼
export const NanumHuman = localFont({
  src: [
    {
      path: "../../public/resources/fonts/NanumHumanEL.woff2",
      weight: "200",
    },
    {
      path: "../../public/resources/fonts/NanumHumanLight.woff2",
      weight: "300",
    },
    {
      path: "../../public/resources/fonts/NanumHumanRegular.woff2",
      weight: "400",
    },
    {
      path: "../../public/resources/fonts/NanumHumanBold.woff2",
      weight: "700",
    },
    {
      path: "../../public/resources/fonts/NanumHumanEB.woff2",
      weight: "800",
    },
    {
      path: "../../public/resources/fonts/NanumHumanHeavy.woff2",
      weight: "900",
    },
  ],
  display: "swap",
  variable: "--font-human",
});

// 나눔명조
export const NanumMyeongjo = localFont({
  src: [
    {
      path: "../../public/resources/fonts/NanumMyeongjo.woff2",
      weight: "400",
    },
    {
      path: "../../public/resources/fonts/NanumMyeongjoBold.woff2",
      weight: "700",
    },
    {
      path: "../../public/resources/fonts/NanumMyeongjoExtraBold.woff2",
      weight: "800",
    },
  ],
  display: "swap",
  variable: "--font-myeongjo",
});

// 나눔펜
export const NanumPen = localFont({
  src: [
    {
      path: "../../public/resources/fonts/NanumPen.woff2",
      weight: "400",
    },
  ],
  display: "swap",
  variable: "--font-pen",
});
// 나눔스퀘어네오
export const NanumSqaureNeo = localFont({
  src: [
    {
      path: "../../public/resources/fonts/NanumSquareNeoTTF-aLt.woff2",
      weight: "300",
    },
    {
      path: "../../public/resources/fonts/NanumSquareNeoTTF-bRg.woff2",
      weight: "400",
    },
    {
      path: "../../public/resources/fonts/NanumSquareNeoTTF-cBd.woff2",
      weight: "700",
    },
    {
      path: "../../public/resources/fonts/NanumSquareNeoTTF-dEb.woff2",
      weight: "800",
    },
    {
      path: "../../public/resources/fonts/NanumSquareNeoTTF-eHv.woff2",
      weight: "900",
    },
  ],
  display: "swap",
  variable: "--font-square-neo",
});
// Pretendard
export const Pretendard = localFont({
  src: [
    {
      path: "../../public/resources/fonts/Pretendard-Thin.woff2",
      weight: "100",
    },
    {
      path: "../../public/resources/fonts/Pretendard-ExtraLight.woff2",
      weight: "200",
    },
    {
      path: "../../public/resources/fonts/Pretendard-Light.woff2",
      weight: "300",
    },
    {
      path: "../../public/resources/fonts/Pretendard-Regular.woff2",
      weight: "400",
    },
    {
      path: "../../public/resources/fonts/Pretendard-Medium.woff2",
      weight: "500",
    },
    {
      path: "../../public/resources/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "../../public/resources/fonts/Pretendard-Bold.woff2",
      weight: "700",
    },
    {
      path: "../../public/resources/fonts/Pretendard-ExtraBold.woff2",
      weight: "800",
    },
    {
      path: "../../public/resources/fonts/Pretendard-Black.woff2",
      weight: "900",
    },
  ],
  display: "swap",
  variable: "--font-pretendard",
});

// NotoSans
export const NotoSans = localFont({
  src: [
    {
      path: "../../public/resources/fonts/NotoSansKR-Thin.woff2",
      weight: "100",
    },
    {
      path: "../../public/resources/fonts/NotoSansKR-ExtraLight.woff2",
      weight: "200",
    },
    {
      path: "../../public/resources/fonts/NotoSansKR-Light.woff2",
      weight: "300",
    },
    {
      path: "../../public/resources/fonts/NotoSansKR-Regular.woff2",
      weight: "400",
    },
    {
      path: "../../public/resources/fonts/NotoSansKR-Medium.woff2",
      weight: "500",
    },
    {
      path: "../../public/resources/fonts/NotoSansKR-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "../../public/resources/fonts/NotoSansKR-Bold.woff2",
      weight: "700",
    },
    {
      path: "../../public/resources/fonts/NotoSansKR-ExtraBold.woff2",
      weight: "800",
    },
    {
      path: "../../public/resources/fonts/NotoSansKR-Black.woff2",
      weight: "900",
    },
  ],
  display: "swap",
  variable: "--font-notosans",
});

const FontLists = clsx(
  NanumBarunGothic.variable,
  BrushFont.variable,
  NanumGothic.variable,
  NanumHuman.variable,
  NanumMyeongjo.variable,
  NanumPen.variable,
  NanumSqaureNeo.variable,
  Pretendard.variable,
  NotoSans.variable
);
export default FontLists;
