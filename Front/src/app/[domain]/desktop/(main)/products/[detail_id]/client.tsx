"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

import TestProductCard from "@/components/card/TestProductCard";
import NoContent from "@/components/noContent/noContent";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import DeliveryGuide from "./_deliveryGuide/deliveryGuide";
import Description from "./_description/description";
import Inquiry from "./_inquiry/inquiry";
import Review from "./_review/review";
import useData from "@/shared/hooks/data/useData";
import { requester } from "@/shared/Requester";
import { log, toast } from "@/shared/utils/Functions";
import {
  useCart,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { Storage } from "@/shared/utils/Data";




export function DetailFrame({
  initProduct,
  initCondition,
}: {
  initProduct: any;
  initCondition: any;
}) {
  const navigate = useNavigate();
  const { storeData } = useStore();
  const { reload } = useCart();
  const { [initProduct.content.id]: product, mutate } = useData(
    initProduct?.content?.id,
    // { ...initCondition, id: initCondition?.content?.id },
    { ...initCondition, id: initProduct?.content?.id },
    (condition) => {
      const id = condition.id;
      delete condition.id;
      return requester.getProduct(id, condition);
    },
    {
      // onReprocessing: (data) => data.content,
      // fallbackData: initProduct?.content,
      onReprocessing: (data) => data.content,  // ✅ getProduct 응답이 { content: {...} } 형태라면 유지
      fallbackData: initProduct,
    }
  );
  console.log("상품", product);

  // 배송정보
  log("배송정보 : ", storeData?.methods);

  // 좋아요
  const onWishClick = () => {
    if (product.wish) {
      requester.deleteWishList(
        product.wish.id,
        {
          soft: false,
        },
        () => {
          mutate();
        }
      );
    } else {
      requester.createWishList(
        {
          product_id: product.id,
        },
        () => {
          mutate();
        }
      );
    }
  };
  const onCartClick = async () => {
    const variants: { variant_id: string; quantity: number }[] = [];
    if (variants.length > 0) {
      const { message, error } = await requester.addItem({
        store_id: storeData?.id,
        variants: variants,
      });
      if (message) {
        reload();
        // .then(() => navigate("/cart")); // 카트 이동시
      } else {
        toast({ message: error });
      }
    }
  };
  useEffect(() => {
    let recents: any = localStorage.getItem(Storage.RECENTS);
    if (recents) recents = JSON.parse(recents);
    else recents = [];
    localStorage.setItem(
      Storage.RECENTS,
      JSON.stringify(
        Array.from(new Set([initProduct.content.id, ...recents])).slice(0, 30)
      )
    );
  }, []);

  const totalSale = Math.round(
    ((product?.discount_price - product?.price) / product?.discount_price) * 100
  );

  return (
    <HorizontalFlex gap={60} alignItems="start">
        <FlexChild className={styles.detail_thumbnail}>
          <Image
            src={product?.thumbnail}
            width={600}
            height={"auto"}
          />
        </FlexChild>

        <VerticalFlex className={styles.detail_infoBox} alignItems="start">
          <FlexChild className={styles.brand}>
            <Span>{product?.brand.name}</Span>
          </FlexChild>

          <FlexChild className={styles.detail_title}>
            <P lineClamp={2} display="--webkit-box" overflow="hidden">
              {product?.title}
            </P>
          </FlexChild>

          <HorizontalFlex marginBottom={17} gap={10}>
            <FlexChild className={styles.price} marginLeft={5}>
              <P>{product?.price}</P> ₩
            </FlexChild>

            {totalSale > 0 && (
              <>
                <FlexChild className={styles.sale_price}>
                  <P>
  
                    {totalSale}%
                  </P>
                </FlexChild>
  
                <FlexChild className={styles.regular_price}>
                  <P>{product?.discount_price}</P>₩
                </FlexChild>
              </>
            )}
          </HorizontalFlex>

          <HorizontalFlex className={styles.delivery_share_box}>
            <FlexChild className={styles.delivery_info}>
              <P>배송정보</P>
              <Image src={"/resources/icons/cart/cj_icon.png"} width={22} />
            </FlexChild>

            {/* 링크 공유 버튼 */}
            {/* <FlexChild cursor="pointer">
              <Image
                src={"/resources/icons/main/share_icon.png"}
                width={25}
              />
              <Image
                        src={'/resources/icons/main/share_icon_action.png'}
                        width={25}
                      />
            </FlexChild> */}
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
            <OptionItem product={product} />
          </VerticalFlex>

          <HorizontalFlex className={styles.total_box}>
            <P className={styles.total_txt}>총 상품 금액</P>

            <FlexChild className={styles.price} width={"auto"}>
              <P>{product?.price}</P> ₩
            </FlexChild>
          </HorizontalFlex>

          <BuyButtonGroup onWishClick={onWishClick} />
        </VerticalFlex>
      </HorizontalFlex>
  );
}





// 미니 구매란
export function MiniInfoBox({
  initProduct,
  initCondition,
}: {
  initProduct: any;
  initCondition: any;
}) {
  const navigate = useNavigate();
  const { storeData } = useStore();
  const { reload } = useCart();
  const { [initProduct.content.id]: product, mutate } = useData(
    initProduct?.content?.id,
    // { ...initCondition, id: initCondition?.content?.id },
    { ...initCondition, id: initProduct?.content?.id },
    (condition) => {
      const id = condition.id;
      delete condition.id;
      return requester.getProduct(id, condition);
    },
    {
      // onReprocessing: (data) => data.content,
      // fallbackData: initProduct?.content,
      onReprocessing: (data) => data.content,  // ✅ getProduct 응답이 { content: {...} } 형태라면 유지
      fallbackData: initProduct,
    }
  );
  // 좋아요
  const onWishClick = () => {
    if (product.wish) {
      requester.deleteWishList(
        product.wish.id,
        {
          soft: false,
        },
        () => {
          mutate();
        }
      );
    } else {
      requester.createWishList(
        {
          product_id: product.id,
        },
        () => {
          mutate();
        }
      );
    }
  };
  const onCartClick = async () => {
    const variants: { variant_id: string; quantity: number }[] = [];
    if (variants.length > 0) {
      const { message, error } = await requester.addItem({
        store_id: storeData?.id,
        variants: variants,
      });
      if (message) {
        reload();
        // .then(() => navigate("/cart")); // 카트 이동시
      } else {
        toast({ message: error });
      }
    }
  };
  useEffect(() => {
    let recents: any = localStorage.getItem(Storage.RECENTS);
    if (recents) recents = JSON.parse(recents);
    else recents = [];
    localStorage.setItem(
      Storage.RECENTS,
      JSON.stringify(
        Array.from(new Set([initProduct.content.id, ...recents])).slice(0, 30)
      )
    );
  }, []);

  return(
    <FlexChild width={"auto"} className={styles.mini_infoBox}>
      <VerticalFlex>
        <VerticalFlex gap={20} marginBottom={30}>
          <OptionItem product={product}/>
        </VerticalFlex>

        <HorizontalFlex className={styles.total_box} gap={10}>
          <P className={styles.total_txt}>총 상품 금액</P>
          {/* 총 상품 금액은 옵션이랑 현재 계산기로 계산된 총 값을 useState로 관리해서 여기로 쏴주면 됨. */}
          <FlexChild
            className={styles.price}
            width={"auto"}
            justifyContent="end"
          >
            <P>{product?.price}</P> ₩
          </FlexChild>
        </HorizontalFlex>

        <BuyButtonGroup onWishClick={onWishClick} />
      </VerticalFlex>
    </FlexChild>
  );
}

// 옵션 개수 계산기
export function OptionItem({ product }: {product: any }) {

  const [defaultQuantity, setDefaultQuantity] = useState(1);
  const [quantities, setQuantities] = useState<number[]>(() =>
    product?.variants?.map(() => 0) ?? []
  );

  return (
    <>
      {/* 기본 상품 수량 */}
      <HorizontalFlex className={styles.option_item}>
        <InputNumber
          value={defaultQuantity}
          min={1}
          max={100}
          step={1}
          onChange={(val) => {
            setDefaultQuantity(val); // 외부 state 업데이트
          }}
        />
        <HorizontalFlex className={styles.txt_item} gap={10} width={"auto"}>
          <FlexChild className={styles.op_name}>
            <P>{product?.title}</P>
          </FlexChild>

          <FlexChild width={"auto"} gap={5}>
            <Span>{defaultQuantity}개</Span>
            <Span>+ {defaultQuantity * product?.price}원</Span>
          </FlexChild>
        </HorizontalFlex>
      </HorizontalFlex>
      
      {/* 옵션 추가 시 내용 */}
      {product?.variants?.map((opt: any, i: number) =>
        opt.title && opt.title.length > 0 ? (
          <HorizontalFlex className={styles.option_item} key={i}>
            <InputNumber
              value={quantities[i]}
              min={0}
              max={100}
              step={1}
              onChange={(val) => {
                setQuantities((prev) => {
                  const next = [...prev];
                  next[i] = val;
                  return next;
                });
              }}
            />
            <FlexChild className={styles.txt_item} gap={10} width="auto">
              <FlexChild className={styles.op_name}>
                <P>{opt.title}</P>
              </FlexChild>

              <FlexChild width="auto" gap={5}>
                <Span>{quantities[i]}개</Span>
                <Span>+ {quantities[i] * opt.price}원</Span>
              </FlexChild>
            </FlexChild>
          </HorizontalFlex>
        ) : null
      )}
    </>
  );
}

// 좋아요 장바구니 구매버튼 묶음
export function BuyButtonGroup({onWishClick} : {onWishClick : ()=> void}) {
  return (
    <HorizontalFlex className={styles.buyButton_box}>
      <FlexChild width={"auto"}>
        <Button className={styles.heart_btn}>
          <Image
            src={"/resources/icons/main/product_heart_icon.png"}
            width={30}
          />
          {/* <Image src={'/resources/icons/main/product_heart_icon_active.png'} width={30} /> */}
        </Button>
      </FlexChild>

      <FlexChild className={styles.cart_box}>
        <Button className={styles.cart_btn}>
          <P>장바구니</P>
        </Button>
      </FlexChild>

      <FlexChild className={styles.buy_box}>
        <Button className={styles.buy_btn}>
          <P>바로 구매</P>
        </Button>
      </FlexChild>
    </HorizontalFlex>
  );
}

export function ProductSlider({
  id,
  lineClamp,
  listArray
}: {
  id: string;
  lineClamp?: number;
  listArray: any;
}) {

  return (
    <>
      {listArray.length > 0 ? (
        <FlexChild id={id} className={styles.ProductSlider}>
          <Swiper
            loop={false}
            slidesPerView={6}
            speed={600}
            spaceBetween={20}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            navigation={{
              prevEl: `#${id} .${styles.prevBtn}`,
              nextEl: `#${id} .${styles.nextBtn}`,
            }}
          >
            {listArray.map((product: ProductData, i: number) => {
              return (
                <SwiperSlide key={i}>
                  <TestProductCard
                    product={
                      {
                        id: product.id,
                        title: product.title,
                        thumbnail: product.thumbnail,
                        price: product.price,
                        discount_price: product.discount_price,
                        discount_rate: product.discount_rate,
                        store_name: product.brand.name,
                        variants: product.variants,
                      } as any
                    }
                    lineClamp={lineClamp ?? 2}
                  />
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

// 제품 정보 및 내용
export function DetailTabContainer({
  initProduct,
  initCondition,
}: {
  initProduct: any;
  initCondition: any;
}) {

  // const navigate = useNavigate();
  // const { storeData } = useStore();
  // const { reload } = useCart();
  const { [initProduct.content.id]: product, mutate } = useData(
    initProduct?.content?.id,
    // { ...initCondition, id: initCondition?.content?.id },
    { ...initCondition, id: initProduct?.content?.id },
    (condition) => {
      const id = condition.id;
      delete condition.id;
      return requester.getProduct(id, condition);
    },
    {
      // onReprocessing: (data) => data.content,
      // fallbackData: initProduct?.content,
      onReprocessing: (data) => data.content,  // ✅ getProduct 응답이 { content: {...} } 형태라면 유지
      fallbackData: initProduct,
    }
  );
  useEffect(() => {
    let recents: any = localStorage.getItem(Storage.RECENTS);
    if (recents) recents = JSON.parse(recents);
    else recents = [];
    localStorage.setItem(
      Storage.RECENTS,
      JSON.stringify(
        Array.from(new Set([initProduct.content.id, ...recents])).slice(0, 30)
      )
    );
  }, []);

  const [tabParams, setTabParams] = useState("description");
  const tabParamsChange = (params: string) => {
    setTabParams(params);
  };

  const tabAraays = [
    { name: "상세정보", paramsName: "description", component: <Description product={product} /> },
    { name: "사용후기", paramsName: "review", component: <Review /> },
    { name: "상품 Q&A", paramsName: "inquiry", component: <Inquiry /> },
    {
      name: "배송/반품/교환/안내",
      paramsName: "deliveryGuide",
      component: <DeliveryGuide />,
    },
  ];

  return (
    <>
      <HorizontalFlex className={styles.tab_wrap}>
        {tabAraays.map((item) => (
          <FlexChild
            key={item.paramsName}
            className={clsx(
              styles.content_tab,
              tabParams === `${item.paramsName}` && styles.active
            )}
            onClick={() => tabParamsChange(`${item.paramsName}`)}
          >
            <P>
              {item.name}
              {["review", "inquiry"].includes(item.paramsName) && (
                <Span className={styles.list_count}>0</Span> // 리뷰, qna 개수 출력
              )}
            </P>
          </FlexChild>
        ))}
      </HorizontalFlex>

      <VerticalFlex className={styles.content_view}>
        <article key={tabParams} className={styles.tab_fade}>
          {tabAraays.find((t) => t.paramsName === tabParams)?.component}
        </article>
      </VerticalFlex>
    </>
  );
}
