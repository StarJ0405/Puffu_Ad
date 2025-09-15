import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import Link from "next/link";
import {
  HotDealWrapper,
  LinkBanner,
  MainBanner,
  MainCategory,
  MiniBanner,
  ProductList,
  SubBanner,
  // ProductSlider,
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
    pageSize: 12,
    order: "new",
  };
  const newProducts = await requester.getProducts(newCondition);
  return (
    <section className="root">
      <MainBanner initBanners={banners} />

      <VerticalFlex
        marginTop={"35px"}
        marginBottom={"100px"}
        gap={80}
        className="page_container"
      >
        <VerticalFlex className={styles.category_sec}>
          <VerticalFlex className={styles.ca_title}>
            <Image
              src="/resources/images/category_main_icon.png"
              width={65}
              height={"auto"}
            />
            <P className="SacheonFont">카테고리 메뉴</P>
          </VerticalFlex>
          <MainCategory /> {/* 카테고리 */}
        </VerticalFlex>
        <LinkBanner /> {/* 링크 베너 props로 받은 값만큼만 베너 보여주기 */}

        {/* 이 달의 핫딜 */}
        <HotDealWrapper
          id={"hot"}
          lineClamp={1}
          initProducts={hotProducts}
          initCondition={hotCondition}
        />

        <SubBanner />

        {/* 신상품 */}
        <FlexChild>
          <VerticalFlex>
            <HorizontalFlex
              className={styles.titleBox}
              justifyContent="start"
              alignItems="end"
              gap={20}
            >
              <div className={styles.title}>
                <h2 className="SacheonFont">
                  <Span>따끈따끈</Span> 신상품
                </h2>
              </div>

              <FlexChild width={"auto"}>
                <Link className={styles.linkBtn} href={"/products/new"}>
                  더보기
                </Link>
              </FlexChild>
            </HorizontalFlex>
            {/* 메인, 상세 리스트 */}
            <ProductList
              id={"new"}
              lineClamp={1}
              initProducts={newProducts}
              initCondition={newCondition}
            />
          </VerticalFlex>
        </FlexChild>
        <MiniBanner /> {/* 링크 베너 props로 받은 값만큼만 베너 보여주기 */}
        {/* <FlexChild>
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

            <FlexChild marginTop={35} justifyContent="center">
              <Link
                href={"/board/photoReview"}
                className={styles.link_more_btn}
              >
                후기 더보기
              </Link>
            </FlexChild>
          </VerticalFlex>
        </FlexChild> */}
      </VerticalFlex>
    </section>
  );
}
