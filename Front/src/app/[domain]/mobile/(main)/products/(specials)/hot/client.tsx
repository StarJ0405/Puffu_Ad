"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Image from "@/components/Image/Image";


// 지금 안쓰고 있음 (임시로 만든 더미 데이터임)
export function HotDealCategory() {
  const hotdeals = [
    {
      thumbnail: "/resources/images/dummy_img/hotdeal_banner_01.png",
      filter: "daySale",
    },
    {
      thumbnail: "/resources/images/dummy_img/hotdeal_banner_02.png",
      filter: "weekSale",
    },
    {
      thumbnail: "/resources/images/dummy_img/hotdeal_banner_03.png",
      filter: "setSale",
    },
    {
      thumbnail: "/resources/images/dummy_img/hotdeal_banner_04.png",
      filter: "pointSale",
    },
    {
      thumbnail: "/resources/images/dummy_img/hotdeal_banner_05.png",
      filter: "specialSale",
    },
    {
      thumbnail: "/resources/images/dummy_img/hotdeal_banner_06.png",
      filter: "refuerSale",
    },
  ];

  return (
    <HorizontalFlex>
      {hotdeals.map((cat, i) => (
        <FlexChild cursor="pointer" key={i}>
          <Image src={cat.thumbnail} width={216} />
        </FlexChild>
      ))}
    </HorizontalFlex>
  );
}
