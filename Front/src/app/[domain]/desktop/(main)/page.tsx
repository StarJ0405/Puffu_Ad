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
  MainBanner,
  EventSection,
  MainCategory,
  BestList,
  // ProductSlider,
  ReviewSection,
} from "./client";
import styles from "./page.module.css";
import Div from "@/components/div/Div";
import siteInfo from "@/shared/siteInfo";

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

  const initCondition = { type: "이벤트", pageSize: 10 };
  const initNotices = await requester.getNotices(initCondition);

  return (
    <section className="root" style={{paddingBottom: '0'}}>
      <MainBanner initBanners={banners} />

      <VerticalFlex>

        <HorizontalFlex className={clsx(styles.sec1, 'page_container')}>
          <VerticalFlex className={styles.about_box} alignItems="center" justifyContent="center">
            <h4 className="Wanted">PUFFU TOY는</h4>

            <VerticalFlex className={styles.text_box} alignItems="center">
              <P>
                온라인 쇼핑의 편리함과 매장 픽업의 즉시성을 결합한 <br />
                새로운 방식의 구매 경험을 제공합니다.
              </P>
  
              <P>
                원하는 상품을 온라인에서 간편하게 주문하고, 가까운 매장에서 <br className={styles.br} />
                빠르게 수령할 수 있어 고객님의 시간을 아끼고 <br className={styles.br} />
                더욱 부담 없는 쇼핑을 도와드립니다.
              </P>
            </VerticalFlex>
          </VerticalFlex>

          <VerticalFlex className={styles.link_group}>
            <Link href={'/map'} className={styles.link_box}>
              <FlexChild className={clsx(styles.link_item, styles.pickup)}>
                <Div className={styles.text_box}>
                  <h4>픽업 매장 찾기</h4>
                  <P>
                    어디서든 앱을 통해 상품을 담아서 자신이 <br className={styles.br} />
                    원하는 장소에서 직접 상품을 받아보세요!
                  </P>
                  
                  <Span className={styles.arrow_btn}>
                    <Image
                      src={"/resources/images/button_arrow.png"}
                      width={8}
                    />
                  </Span>
                </Div>
    
                <FlexChild className={styles.deco_box}>
                  <Image
                    src={"/resources/images/main_pickup_icon.png"}
                  />
                </FlexChild>
              </FlexChild>
            </Link>

            <Link href={'/'} className={styles.link_box}>
              <FlexChild className={clsx(styles.link_item, styles.startups)}>
                <Div className={styles.text_box}>
                  <h4>창업 안내</h4>
                  <P>
                    푸푸토이만의 자체 제작 키오스크 및 준비된 <br className={styles.br} />
                    컨설턴트 서비스를 만나보세요.
                  </P>
                  
                  <Span className={styles.arrow_btn}>
                    <Image
                      src={"/resources/images/button_arrow.png"}
                      width={8}
                    />
                  </Span>
                </Div>
    
                <FlexChild className={styles.deco_box}>
                  <Image
                    src={"/resources/images/main_startups_icon.png"}
                  />
                </FlexChild>
              </FlexChild>
            </Link>
          </VerticalFlex>
        </HorizontalFlex>

        <VerticalFlex className={clsx(styles.sec2, 'page_container')}>
          <HorizontalFlex className={styles.titleBox} justifyContent="start">
            <FlexChild className={styles.title}>
              <h2 className="Wanted">CATEGORY</h2>
            </FlexChild>
          </HorizontalFlex>

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
        <VerticalFlex className={clsx(styles.sec3, 'page_container')}>
          <HorizontalFlex
            className={styles.titleBox}
            justifyContent="start"
            alignItems="end"
            gap={30}
          >
            <FlexChild className={styles.title}>
              <h2 className="Wanted">best <small>상품</small></h2>
            </FlexChild>

            <FlexChild width={"auto"}>
              <Link className={styles.linkBtn} href={siteInfo.pt_best}>
                자세히 보기 <b>+</b>
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
        {/* <SubBanner1 /> */}
        

        <FlexChild className={clsx(styles.sec4, styles.freeSlide)}>
          <ReviewSection />
        </FlexChild>

        <FlexChild className={clsx(styles.sec5, styles.freeSlide)}>
          <EventSection initCondition={initCondition} initNotices={initNotices} />
        </FlexChild>

        {/* <MiniBanner /> */}
      </VerticalFlex>
    </section>
  );
}
