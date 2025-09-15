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
  NewProducts,
  ProductList,
  ProductSlider,
} from "./client";
import styles from "./page.module.css";

export default async function () {
  const banners = await requester.getBanners();
  const condition: any = {
    pageSize: 30,
  };

  const newProducts = await requester.getProducts(condition);
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

        <FlexChild marginBottom={20}>
          <VerticalFlex>
            <HorizontalFlex
              className={clsx(styles.titleBox, styles.titleBox1)}
              alignItems="end"
              gap={20}
            >
              <div className={styles.title}>
                <h2 className="SacheonFont">
                  <Image
                    src="/resources/images/header/HotDeal_icon.png"
                    width={15}
                    height={"auto"}
                  />
                  이 달의 <Span color={"#FF4A4D"}>HOT</Span>딜
                </h2>
                <P width={"auto"}>매달 갱신되는 Hot Deal 상품!</P>
              </div>

              <FlexChild width={"auto"}>
                <Link className={styles.linkBtn} href={"/products/hot"}>
                  더보기
                </Link>
              </FlexChild>
            </HorizontalFlex>
            {/* <ProductList id={"sale"} lineClamp={1} /> 메인, 상세 리스트 */}
            <NewProducts initProducts={newProducts} /> {/* 메인, 상세 리스트 */}
          </VerticalFlex>
        </FlexChild>

        <FlexChild marginBottom={20}>
          <VerticalFlex>
            <HorizontalFlex
              className={styles.titleBox}
              alignItems="end"
              gap={20}
            >
              <div className={styles.title}>
                <Image
                  src="/resources/images/header/Logo.png"
                  width={50}
                  height={"auto"}
                />
                <h2 className="SacheonFont">
                  <Span>PICK!</Span> 추천 상품
                </h2>
              </div>

              <FlexChild width={"auto"}>
                <Link className={styles.linkBtn} href={"/products/best"}>
                  더보기
                </Link>
              </FlexChild>
            </HorizontalFlex>
            <NewProducts initProducts={newProducts} /> {/* 메인, 상세 리스트 */}
          </VerticalFlex>
        </FlexChild>
        <MiniBanner /> {/* 링크 베너 props로 받은 값만큼만 베너 보여주기 */}

        <FlexChild marginTop={30}>
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
        </FlexChild>
      </VerticalFlex>
    </section>
  );
}
