"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Pstyles from "../../products.module.css";

export function ProdcutCategory() {
  // 카테고리메뉴

  const pathname = usePathname();

  // css : 카테고리 추가되어도 flex-wrap 구조 문제 없게 수정해놓기

  const ca_test = [
    {
      name: "남성토이",
      thumbnail: "/resources/images/category/gif_ca_Img_01.gif",
    },
    {
      name: "여성토이",
      thumbnail: "/resources/images/category/gif_ca_Img_02.gif",
    },
    {
      name: "윤활제/젤",
      thumbnail: "/resources/images/category/gif_ca_Img_03.gif",
    },
    { name: "콘돔", thumbnail: "/resources/images/category/gif_ca_Img_04.gif" },
    { name: "의류", thumbnail: "/resources/images/category/gif_ca_Img_05.gif" },
    {
      name: "BDSM 토이",
      thumbnail: "/resources/images/category/gif_ca_Img_06.gif",
    },
    {
      name: "LGBT 토이",
      thumbnail: "/resources/images/category/gif_ca_Img_07.gif",
    },
  ];

  return (
    <nav className={Pstyles.category_wrap}>
      {/* ca_item에 active 클래스 주기. active 클래스만 걸리면 효과 들어감. */}
      {pathname !== "/" ? (
        <VerticalFlex className={clsx(Pstyles.ca_item, Pstyles.ca_all)}>
          <FlexChild className={Pstyles.ca_thumb} width={120} height={120}>
            <P>ALL</P>
          </FlexChild>
          <Span>전체</Span>
        </VerticalFlex>
      ) : null}
      {ca_test.map((cat, i) => (
        <VerticalFlex className={Pstyles.ca_item} key={i}>
          <FlexChild className={Pstyles.ca_thumb}>
            <Image src={cat.thumbnail} width={"auto"} height={120} />
          </FlexChild>
          <Span>{cat.name}</Span>
        </VerticalFlex>
      ))}
    </nav>
  );
}

export function SecondCategory() {
  // 카테고리메뉴

  const ca_test = [
    { name: "세척/세정" },
    { name: "관리/파우더" },
    { name: "워머/히팅" },
    { name: "드라이/건조" },
    { name: "보관/파우치" },
    { name: "오나홀 보조" },
    { name: "기타용품" },
  ];

  return (
    <>
      <ul className={Pstyles.category_list}>
        <li className={Pstyles.active}>
          <Span>전체</Span>
        </li>
        {ca_test.map((cat, i) => (
          <li key={i}>
            <Span>{cat.name}</Span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function BaseProductList({
  initProducts,
  initConiditon,
}: {
  initProducts: Pageable;
  initConiditon: any;
}) {
  const { best, maxPage, page, setPage, mutate } = usePageData(
    "best",
    (pageNumber) => ({
      ...initConiditon,
      pageNumber,
    }),
    (condition) => requester.getProducts(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initProducts,
    }
  );
  return (
    <>
      {best.map((product: ProductData) => (
        <P key={product.id}> {product.title}</P>
      ))}
    </>
  );
}
