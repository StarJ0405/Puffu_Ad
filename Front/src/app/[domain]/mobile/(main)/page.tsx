import VerticalFlex from "@/components/flex/VerticalFlex";
import { requester } from "@/shared/Requester";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import styles from "./page.module.css"
import Link from "next/link";
import P from "@/components/P/P";
import clsx from "clsx";
import Div from "@/components/div/Div";
import Span from "@/components/span/Span";
import Image from "@/components/Image/Image";
import {
  HotDealWrapper,
  LinkBanner,
  MainBanner,
  MainCategory,
  BestProducts,
  // ProductList,
  ReviewSection,
  // SubBanner1,
  // SubBanner2,
} from "./client";

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
    pageSize: 30,
    order: "best",
    product_type: "exclude_set",
    warehousing: false,
  };
  const bestProducts = await requester.getProducts(bestCondition);

  return (
    <section className="mob_root">
      <MainBanner initBanners={banners} />

      <VerticalFlex
        marginTop={"25px"}
        gap={30}
      >
        <VerticalFlex className={clsx(styles.sec1, 'mob_page_container')}>
          <Link href={'/map'} className={styles.link_box}>
            <VerticalFlex className={styles.about_box} alignItems="start">
              <h4 className="Wanted">PUFFU TOY는</h4>
  
              <VerticalFlex className={styles.text_box} alignItems="start">
                <P>
                  온라인 쇼핑의 편리함과 매장 픽업의 즉시성을 결합한
                  새로운 방식의 구매 경험을 제공합니다.
                </P>
    
                <P>
                  원하는 상품을 온라인에서 간편하게 주문하고, 가까운 매장에서 <br className={styles.br} />
                  빠르게 수령할 수 있어 고객님의 시간을 아끼고 <br className={styles.br} />
                  더욱 부담 없는 쇼핑을 도와드립니다.
                </P>
              </VerticalFlex>
            </VerticalFlex>
          </Link>

          <Link href={'/'} className={styles.link_box}>
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
                    width={5}
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
                    width={5}
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


        <VerticalFlex className={clsx(styles.sec2, 'mob_page_container')} gap={40}>
          <MainCategory /> {/* 카테고리 */}
        </VerticalFlex>

        {/* <LinkBanner /> */}
        {/* <HotDealWrapper
          id={"hot"}
          lineClamp={1}
          initProducts={hotProducts}
          initCondition={hotCondition}
        /> */}

        <VerticalFlex className={clsx(styles.sec3, 'mob_page_container')}>
          <BestProducts 
            initProducts={bestProducts} 
            initCondition={bestCondition} 
          />
        </VerticalFlex>

        {/* 리뷰 */}
        <VerticalFlex className={clsx(styles.sec4, 'mob_page_container')}>
          <ReviewSection id={"review"} />
        </VerticalFlex>
      </VerticalFlex>
    </section>
  );
}
