import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import Link from "next/link";
import clsx from "clsx";
import {
  HotDealList,
  LinkBanner,
  MainBanner,
  MainCategory,
  MiniBanner,
  BestList,
  SubBanner1,
  SubBanner2,
  ProductSlider,
} from "./client";
import styles from "./page.module.css";
import Div from "@/components/div/Div";

export default async function () {
  const banners = await requester.getBanners();
  const hotCondition: any = {
    pageSize: 12,
    order: "discount",
    product_type: "exclude_set",
    warehousing: false,
  };
  const hotProducts = await requester.getProducts(hotCondition);
  const bestCondition: any = {
    pageSize: 12,
    order: "best",
    product_type: "exclude_set",
    warehousing: false,
  };
  const bestProducts = await requester.getProducts(bestCondition);
  return (
    <section className="root">
      <MainBanner initBanners={banners} />

      <VerticalFlex
        marginTop={"35px"}
        marginBottom={"100px"}
        gap={80}
        className="page_container"
      >

        <HorizontalFlex hidden>
          <FlexChild className={styles.about_box}>
            <h4>PUFFU TOY는</h4>
            <P>
              온라인 쇼핑의 편리함과 매장 픽업의 즉시성을 결합한 <br />
              새로운 방식의 구매 경험을 제공합니다.
            </P>

            <P>
              원하는 상품을 온라인에서 간편하게 주문하고, 가까운 매장에서 <br />
              빠르게 수령할 수 있어 고객님의 시간을 아끼고 
              더욱 부담 없는 쇼핑을 도와드립니다.
            </P>
          </FlexChild>

          <VerticalFlex>
            <FlexChild className={clsx(styles.item, styles.pickup)}>
              <Div className={styles.text_box}>
                <h4>픽업 매장 찾기</h4>
                <P>
                  어디서든 앱을 통해 상품을 담아서 자신이 <br />
                  원하는 장소에서 직접 상품을 받아보세요!
                </P>
                
                <Span className={styles.arrow_btn}>
                  {/* <Image
                    src={"/resources/images/header/logo.png"}
                    width={100}
                    marginBottom={5}
                  /> */}
                </Span>
              </Div>

              <FlexChild className={styles.deco_box}>
                {/* <Image
                  src={"/resources/images/header/logo.png"}
                  width={100}
                  marginBottom={5}
                /> */}
              </FlexChild>
            </FlexChild>

            <FlexChild className={clsx(styles.item, styles.startUps)}>
              <Div className={styles.text_box}>
                <h4>창업 안내</h4>
                <P>
                  푸푸토이만의 자체 제작 키오스크 및 준비된 <br />
                  컨설턴트 서비스를 만나보세요.
                </P>
                
                <Span className={styles.arrow_btn}>
                  {/* <Image
                    src={"/resources/images/header/logo.png"}
                    width={100}
                    marginBottom={5}
                  /> */}
                </Span>
              </Div>

              <FlexChild className={styles.deco_box}>
                {/* <Image
                  src={"/resources/images/header/logo.png"}
                  width={100}
                  marginBottom={5}
                /> */}
              </FlexChild>
            </FlexChild>
          </VerticalFlex>
        </HorizontalFlex>

        <VerticalFlex className={styles.category_sec}>
          <VerticalFlex className={styles.ca_title}>
            <P className="SacheonFont">CATEGORY</P>
          </VerticalFlex>
          <MainCategory /> {/* 카테고리 */}
        </VerticalFlex>

        {/* 이 달의 핫딜 */}
        {/* <HotDealList
          id={"hot"}
          lineClamp={1}
          initProducts={hotProducts}
          initCondition={hotCondition}
        />
        <SubBanner2 /> */}
        {/* 베스트 */}
        <FlexChild>
          <VerticalFlex>
            <HorizontalFlex
              className={styles.titleBox}
              justifyContent="start"
              alignItems="end"
              gap={30}
            >
              <div className={styles.title}>
                <h2 className="SacheonFont">
                  <Span position="relative" top={3}>
                    BEST
                  </Span>
                  상품
                </h2>
              </div>

              <FlexChild width={"auto"}>
                <Link className={styles.linkBtn} href={"/products/best"}>
                  자세히 보기 +
                </Link>
              </FlexChild>
            </HorizontalFlex>
            {/* 메인, 상세 리스트 */}
            <BestList
              id={"best"}
              lineClamp={1}
              initProducts={bestProducts}
              initCondition={bestCondition}
            />
          </VerticalFlex>
        </FlexChild>
        {/* <SubBanner1 /> */}
        
        <FlexChild>
          <VerticalFlex>
            <HorizontalFlex
              className={styles.titleBox}
              justifyContent="center"
              alignItems="end"
              gap={50}
            >
              <div className={styles.title}>
                <h2 className="SacheonFont">BEST <small>리뷰</small></h2>

                <P>
                  베스트 리뷰에 선정되면 <br />
                  30%할인쿠폰 증정!
                </P>

                <Link href={'/board/photoReview'}>자세히 보기 +</Link>
              </div>
            </HorizontalFlex>

            <ProductSlider id={"review"} />

            {/* <FlexChild marginTop={35} justifyContent="center">
              <Link
                href={"/board/photoReview"}
                className={styles.link_more_btn}
              >
                후기 더보기
              </Link>
            </FlexChild> */}
          </VerticalFlex>
        </FlexChild>

        {/* <MiniBanner /> */}
      </VerticalFlex>
    </section>
  );
}
