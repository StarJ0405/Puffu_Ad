"use client"
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Pstyles from "../../products.module.css";
import { BaseProductList } from "../../baseClient";
import useInfiniteData from "@/shared/hooks/data/useInfiniteData";


export function HotDealCategory() {


  const hotdeals = [
    { thumbnail: '/resources/images/dummy_img/hotdeal_banner_01.png', filter: 'daySale' },
    { thumbnail: '/resources/images/dummy_img/hotdeal_banner_02.png', filter: 'weekSale' },
    { thumbnail: '/resources/images/dummy_img/hotdeal_banner_03.png', filter: 'setSale' },
    { thumbnail: '/resources/images/dummy_img/hotdeal_banner_04.png', filter: 'pointSale' },
    { thumbnail: '/resources/images/dummy_img/hotdeal_banner_05.png', filter: 'specialSale' },
    { thumbnail: '/resources/images/dummy_img/hotdeal_banner_06.png', filter: 'refuerSale' },
  ]

  return (
    <HorizontalFlex>
      {
        hotdeals.map((cat, i) => (
          <FlexChild cursor="pointer" key={i}>
            <Image
              src={cat.thumbnail}
              width={216}
            />
          </FlexChild>
        ))
      }
    </HorizontalFlex>
  )
}


export function HotList({
  id,
  initProducts,
  initConiditon,
}: {
  id: string,
  initProducts: Pageable;
  initConiditon: any;
}) {
  const {
    [id]: items,
    Load,
    page,
    maxPage,
    isLoading,
  } = useInfiniteData(
    id,
    (pageNumber) => ({
      ...initConiditon,
      pageSize: 12,
      pageNumber,
    }),
    (condition) => requester.getProducts(condition),
    (data: Pageable) => data?.totalPages || 0,
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: [initProducts],
    }
  );
  return (
    <>
      <BaseProductList
        id={id}
        initCondition={initConiditon}
        initProducts={initProducts}
        listArray={items}
        showMore={Load} />
    </>
  );
}