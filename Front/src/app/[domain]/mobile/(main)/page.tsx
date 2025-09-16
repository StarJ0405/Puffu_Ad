import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import Link from "next/link";
import {
  LinkBanner,
  MainBanner,
  MainCategory,
  MiniBanner,
  HotDealWrapper,
  NewProducts,
  // ProductList,
  // ProductSlider,
  SubBanner,
} from "./client";
import styles from "./page.module.css";

export default async function () {
  const banners = await requester.getBanners();

  const hotCondition: any = {
    pageSize: 12,
    order: "discount",
  };
  const hotProducts = await requester.getProducts(hotCondition);
  const newCondition: any = {
    pageSize: 30,
    order: "new",
  };

  const newProducts = await requester.getProducts(newCondition);
  return (
    <section className="root">
      <MainBanner initBanners={banners} />

      <VerticalFlex
        marginTop={"25px"}
        marginBottom={"30px"}
        gap={30}
        className="page_container"
      >
        <MainCategory /> {/* 카테고리 */}
        <LinkBanner /> {/* 링크 베너 props로 받은 값만큼만 베너 보여주기 */}
        <HotDealWrapper
          id={"hot"}
          lineClamp={1}
          initProducts={hotProducts}
          initCondition={hotCondition}
        />
        <SubBanner />
        <NewProducts initProducts={newProducts} /> {/* 메인, 상세 리스트 */}
        <MiniBanner /> {/* 링크 베너 props로 받은 값만큼만 베너 보여주기 */}
        {/* 포토 사용 후기 */}
        {/* <FlexChild marginTop={30}>
          <VerticalFlex>
            <HorizontalFlex
              className={styles.titleBox}
              justifyContent="center"
              alignItems="end"
              gap={50}
            >
              <div className={styles.title}>
                <h2 className="SacheonFont">포토 사용후기</h2>
              </div>
            </HorizontalFlex>

            <ProductSlider id={"new"} />

            <FlexChild justifyContent="center">
              <Link href={"/photoReview"} className={styles.link_more_btn}>
                후기 더보기
              </Link>
            </FlexChild>
          </VerticalFlex>
        </FlexChild> */}
      </VerticalFlex>
    </section>
  );
}
