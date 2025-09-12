import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import { Params } from "next/dist/server/request/params";
import { notFound } from "next/navigation";
import {
  BuyButtonGroup,
  DetailTabContainer,
  MiniInfoBox,
  OptionItem,
  Product,
  ProductSlider,
} from "./client";
import styles from "./page.module.css";
import { log } from "@/shared/utils/Functions";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";

export default async function ({ params }: { params: Promise<Params> }) {
  const { detail_id } = await params;
  const initCondition = {
    relations: [
      "brand.methods",
      "variants.values",
      "variants.product.discounts.discount",
      "variants.discounts.discount",
      "options.values",
    ],
  };
  const initProduct = await requester.getProduct(
    detail_id as string,
    initCondition
  );
  if (!initProduct?.content?.id) return notFound();
  const { userData } = await useAuth();
  if (userData?.id) {
    requester.addRecent({
      user_id: userData.id,
      detail_id,
    });
  }
  const optionTest = [
    { name: "블랙 망사 리본 스타킹", quantity: 1, price: "0" },
    { name: "크리스마스 요정님 선물 담는 양말", quantity: 2, price: "1,000" },
    {
      name: "모에모에 매직 에로카와 태닝 바디 세트 상품",
      quantity: 1,
      price: "0",
    },
  ];
  const relationProducts = await requester.getProducts({
    category_id: initProduct.content.category_id,
    pageSize: 12,
  });
  log(relationProducts);

  return (
    <section className="root">
      {/*  */}
      {/*  */}
      {/*  */}
      <Product initCondition={initCondition} initProduct={initProduct} />;
      {/*  */}
      {/*  */}
      {/*  */}
      <Container
        className={clsx("page_container", styles.detail_container)}
        marginTop={100}
      >
        <HorizontalFlex gap={60} alignItems="start">
          <FlexChild className={styles.detail_thumbnail}>
            <Image
              src={"/resources/images/dummy_img/review_img_01.png"}
              width={600}
              height={"auto"}
            />
          </FlexChild>

          <VerticalFlex className={styles.detail_infoBox} alignItems="start">
            <FlexChild className={styles.brand}>
              <Span>브랜드정보</Span>
            </FlexChild>

            <FlexChild className={styles.detail_title}>
              <P lineClamp={2} display="--webkit-box" overflow="hidden">
                상품제목
              </P>
            </FlexChild>

            <HorizontalFlex marginBottom={17} gap={10}>
              <FlexChild className={styles.price} marginLeft={5}>
                <P>25,000</P> ₩
              </FlexChild>

              <FlexChild className={styles.sale_price}>
                <P>15%</P>
              </FlexChild>

              <FlexChild className={styles.regular_price}>
                <P>28,000₩</P>
              </FlexChild>
            </HorizontalFlex>

            <HorizontalFlex className={styles.delivery_share_box}>
              <FlexChild className={styles.delivery_info}>
                <P>배송정보</P>
                <Image src={"/resources/icons/cart/cj_icon.png"} width={22} />
              </FlexChild>

              <FlexChild cursor="pointer">
                {/* 링크 공유 버튼 */}
                <Image
                  src={"/resources/icons/main/share_icon.png"}
                  width={25}
                />
                {/* <Image share 액티브 아이콘
                          src={'/resources/icons/main/share_icon_action.png'}
                          width={25}
                        /> */}
              </FlexChild>
            </HorizontalFlex>

            <VerticalFlex className={styles.delivery_admin_write_data}>
              <VerticalFlex alignItems="start" gap={5}>
                <P size={16} color="#bbb" weight={600}>
                  배송
                </P>
                <P size={14} color="#ddd">
                  오후 2시 이전 주문 결제시 오늘 출발! ( 영업일 기준 )
                </P>
                <P size={14} color="#ddd">
                  30,000원 이상 구매시 무료배송
                </P>
              </VerticalFlex>
            </VerticalFlex>

            <VerticalFlex className={styles.option_box}>
              {optionTest.map((item, i) => (
                <OptionItem item={item} key={i} />
              ))}
            </VerticalFlex>

            <HorizontalFlex className={styles.total_box}>
              <P className={styles.total_txt}>총 상품 금액</P>

              <FlexChild className={styles.price} width={"auto"}>
                <P>25,000</P> ₩
              </FlexChild>
            </HorizontalFlex>

            <BuyButtonGroup />
          </VerticalFlex>
        </HorizontalFlex>

        <VerticalFlex position="relative" marginTop={40} alignItems="start">
          <FlexChild marginBottom={20}>
            <h3 className={clsx("SacheonFont", styles.slide_title)}>
              보시는 상품과 비슷한 추천 상품
            </h3>
          </FlexChild>

          <ProductSlider id={"pick"} />
        </VerticalFlex>

        <HorizontalFlex marginTop={30} alignItems="start" gap={40}>
          <VerticalFlex className={styles.contents_container} width={850}>
            <DetailTabContainer />
          </VerticalFlex>

          <MiniInfoBox optionTest={optionTest} />
        </HorizontalFlex>
      </Container>
    </section>
  );
}
