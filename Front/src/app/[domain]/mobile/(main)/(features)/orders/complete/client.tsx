"use client";
import ProductCard from "@/components/card/ProductCard";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./page.module.css";
import useData from "@/shared/hooks/data/useData";
import { requester } from "@/shared/Requester";

export function CompleteForm({ order }: { order?: OrderData }) {
  const date = new Date(order?.created_at || "");
  return (
    <VerticalFlex>
      <VerticalFlex gap={30} width={"100%"} maxWidth={"1000px"}>
        <VerticalFlex className={styles.complete_title} gap={35}>
          <FlexChild justifyContent="center">
            <P size={25} weight={700} color="#fff">
              주문이 완료되었습니다.
            </P>
          </FlexChild>

          <FlexChild justifyContent="center">
            <P size={16} color="#aaa" weight={500} lineHeight={"1.4"}>
              <Span color="#fff">{`${date.getFullYear()}.${String(
                date.getMonth() + 1
              ).padStart(2, "0")}.${String(date.getDate()).padStart(
                2,
                "0"
              )}`}</Span>{" "}
              주문하신 <br />
              상품의 주문번호는{" "}
              <Span color="var(--main-color1)">{order?.display}</Span> 입니다.
            </P>
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={clsx(styles.box_frame)} marginTop={50}>
          <FlexChild className={styles.box_header}>
            <P>배송지 정보</P>
          </FlexChild>

          <VerticalFlex
            gap={15}
            className={styles.delivery_info}
            marginTop={20}
          >
            <FlexChild justifyContent="center">
              <P className={styles.delivery_txt}>{order?.address?.name}</P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P className={styles.delivery_txt}>
                ({order?.address?.postal_code}) {order?.address?.address1}{" "}
                {order?.address?.address2}
              </P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P className={styles.delivery_txt}>{order?.address?.phone}</P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P className={styles.delivery_txt}>
                배송요청사항 : {order?.address?.message || "없음"}
              </P>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>

        <VerticalFlex className={clsx(styles.box_frame)}>
          <FlexChild className={styles.box_header}>
            <P>주문 상품</P>
          </FlexChild>

          <FlexChild marginTop={15}>
            <CompleteOrdersTable items={order?.items || []} />
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={clsx(styles.total_frame)} gap={60}>
          <VerticalFlex justifyContent="center" gap={15}>
            <FlexChild justifyContent="center">
              <P size={16} color="#fff" weight={500}>
                주문금액 {Number(order?.total).toLocaleString("kr")}원
              </P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P size={16} color="#fff" weight={500}>
                할인금액{" "}
                {Number(
                  (order?.total || 0) - (order?.total_discounted || 0)
                ).toLocaleString("ko-KR")}
                원
              </P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P size={16} color="#fff" weight={500}>
                + 배송비{" "}
                {Number(
                  order?.shipping_methods?.[0]?.amount || 0
                ).toLocaleString("ko-KR")}
                원
              </P>
            </FlexChild>
          </VerticalFlex>

          <VerticalFlex gap={10} justifyContent="center">
            <FlexChild justifyContent="center">
              <P size={16} color="#fff" weight={500}>
                실제 결제 금액
              </P>
            </FlexChild>

            <FlexChild justifyContent="center">
              <P size={25} color="var(--main-color1)" weight={600}>
                {Number(
                  (order?.total_discounted || 0) +
                    (order?.shipping_methods?.[0]?.amount || 0)
                ).toLocaleString("ko-KR")}
                원
              </P>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}

// 주문 리스트
export function CompleteOrdersTable({ items }: { items: LineItemData[] }) {
  return (
    <>
      <VerticalFlex gap={20}>
        {items.length > 0 ? (
          items.map((item, i) => (
            <VerticalFlex key={i} gap={20}>
              <VerticalFlex
                className={styles.list_item}
                gap={30}
                borderBottom={"1px solid #323232"}
              >
                {/* 상품 단위 */}
                <HorizontalFlex className={styles.unit}>
                  <Image src={item.thumbnail} width={80} borderRadius={5} />
                  <VerticalFlex
                    className={styles.unit_content}
                    width={"auto"}
                    alignItems="start"
                  >
                    <FlexChild gap={5}>
                      <Span className={styles.unit_brand}>
                        {item.brand?.name}
                      </Span>
                      <Image
                        src={"/resources/icons/cart/cj_icon.png"}
                        width={13}
                      />
                    </FlexChild>

                    <P
                      className={styles.unit_title}
                      lineClamp={2}
                      overflow="hidden"
                      display="--webkit-box"
                    >
                      {item.product_title}
                    </P>
                    <P>
                      <Span>{item.variant_title}</Span>
                      <Span>{item.quantity}개</Span>
                    </P>
                    <P>
                      <Span>{item.unit_price}</Span>
                      <Span> 원</Span>
                    </P>
                  </VerticalFlex>
                </HorizontalFlex>

                {/* 옵션 리스트 */}
                {/* <VerticalFlex className={styles.option_list}>
                  {item.option.map((option, k) => (
                    <HorizontalFlex key={k} gap={10}>
                      <P>{option.title}</P>
                      <Span> + {option.price}원</Span>
                    </HorizontalFlex>
                  ))}
                </VerticalFlex> */}

                {/* 가격 박스 */}
                <HorizontalFlex className={styles.price_box}>
                  <FlexChild>
                    <P>할인금액 : </P>
                    <Span>
                      {(((item.unit_price || 0) - (item.discount_price || 0)) *
                      item.quantity).toLocaleString("ko-KR")}{" "}원
                    </Span>
                  </FlexChild>

                  <FlexChild>
                    <P>결제 금액 : </P>
                    <Span color="var(--main-color1)" weight={600} fontSize={20}>
                      {Number(
                        (item.discount_price || 0) * item.quantity
                      ).toLocaleString("ko-KR")}{" "}
                      ₩
                    </Span>
                  </FlexChild>
                </HorizontalFlex>
              </VerticalFlex>
            </VerticalFlex>
          ))
        ) : (
          <NoContent type="장바구니" />
        )}
      </VerticalFlex>
    </>
  );
}

export function ChoiseProductSlider({
  id,
  lineClamp,
}: {
  id: string;
  lineClamp?: number;
}) {
  const { random } = useData(
    "random",
    { order: "random", pageSize: 12 },
    (condition) => requester.getProducts(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: { content: [] },
    }
  );
  return (
    <>
      {random.length > 0 ? (
        <FlexChild id={id} className={styles.ProductSlider}>
          <Swiper
            loop={true}
            slidesPerView={2.2}
            speed={600}
            spaceBetween={20}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            navigation={{
              prevEl: `#${id} .${styles.prevBtn}`,
              nextEl: `#${id} .${styles.nextBtn}`,
            }}
          >
            {random.map((product: ProductData, i: number) => {
              return (
                <SwiperSlide key={i}>
                  <ProductCard product={product} lineClamp={lineClamp ?? 2} />
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className={clsx(styles.naviBtn, styles.prevBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div>
          <div className={clsx(styles.naviBtn, styles.nextBtn)}>
            <Image
              src={"/resources/icons/arrow/slide_arrow.png"}
              width={10}
            ></Image>
          </div>
        </FlexChild>
      ) : (
        <NoContent type="상품" />
      )}
    </>
  );
}
