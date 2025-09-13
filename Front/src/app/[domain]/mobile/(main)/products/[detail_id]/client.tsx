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

type Option = {
  name: string;
  quantity: number;
  price: string;
};


const optionTest = [
  {
    name: '섹시한 색깔 양말',
    quantity: 1,
    price: '2000'
  },
  {
    name: '섹시 속옷 여벌',
    quantity: 3,
    price: '0'
  },
  {
    name: '다용도 세정 클린 장갑',
    quantity: 1,
    price: '500'
  }
]



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
    { ...initCondition, id: initCondition?.content?.id },
    (condition) => {
      const id = condition.id;
      delete condition.id;
      return requester.getProduct(id, condition);
    },
    {
      onReprocessing: (data) => data.content,
      fallbackData: initProduct?.content,
    }
  );
  log("상품", product);

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

  return (
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
            <Span>{product?.title}</Span>
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
  );
}





// 미니 구매란
export function MiniInfoBox({ optionTest }: { optionTest: Option[] }) {
  return (
    <FlexChild width={"auto"} className={styles.mini_infoBox}>
      <VerticalFlex>
        <VerticalFlex gap={20} marginBottom={30}>
          {optionTest.map((item, i) => (
            <OptionItem item={item} key={i} />
          ))}
        </VerticalFlex>

        <HorizontalFlex className={styles.total_box} gap={10}>
          <P className={styles.total_txt}>총 상품 금액</P>

          <FlexChild
            className={styles.price}
            width={"auto"}
            justifyContent="end"
          >
            <P>25,000</P> ₩
          </FlexChild>
        </HorizontalFlex>

        <BuyButtonGroup />
      </VerticalFlex>
    </FlexChild>
  );
}

// 옵션 개수 계산기
export function OptionItem({ item }: { item: Option }) {
  return (
    <HorizontalFlex className={styles.option_item}>
      <InputNumber />
      <FlexChild className={styles.txt_item} gap={10} width={"auto"}>
        <P>{item.name}</P>
        <FlexChild width={"auto"} gap={5}>
          <Span>{item.quantity}개</Span>
          <Span>+ {item.price}원</Span>
        </FlexChild>
      </FlexChild>
    </HorizontalFlex>
  );
}

// 좋아요 장바구니 구매버튼 묶음
export function BuyButtonGroup() {
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

type ListItem = {
  thumbnail: string;
  title: string;
  price: number;
  discount_rate: number;
  discount_price: number;
  heart_count: number;
  store_name: string;
  rank: number;
  id: string;
};

export function ProductSlider({
  id,
  lineClamp,
}: {
  id: string;
  lineClamp?: number;
}) {
  const ListProduct: ListItem[] = [
    // 임시
    {
      thumbnail: "/resources/images/dummy_img/product_01.png",
      title: "블랙 골드버스트 바디수트",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 10,
      store_name: "키테루 키테루",
      rank: 0,
      id: 'detail_id',
    },
    {
      thumbnail: "/resources/images/dummy_img/product_02.png",
      title: "핑크색 일본 st 로제 베일 가벼움",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 100,
      store_name: "키테루 키테루",
      rank: 1,
      id: 'detail_id',
    },
    {
      thumbnail: "/resources/images/dummy_img/product_03.png",
      title: "뒷태 반전 유혹하는 파자마",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 100,
      store_name: "키테루 키테루",
      rank: 2,
      id: 'detail_id',
    },
    {
      thumbnail: "/resources/images/dummy_img/product_04.png",
      title: "스지망 쿠파 로린코 처녀궁 프리미엄 소프트",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 70,
      store_name: "키테루 키테루",
      rank: 3,
      id: 'detail_id',
    },
    {
      thumbnail: "/resources/images/dummy_img/product_05.png",
      title: "[유니더스/얇은콘돔형] 지브라 콘돔 1box(10p) [NR]",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 4,
      store_name: "키테루 키테루",
      rank: 4,
      id: 'detail_id',
    },
    {
      thumbnail: "/resources/images/dummy_img/product_06.png",
      title: "블랙 망사 리본 스타킹",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 1020,
      store_name: "키테루 키테루",
      rank: 5,
      id: 'detail_id',
    },
    {
      thumbnail: "/resources/images/dummy_img/product_07.png",
      title: "섹시 스트랩 간호사 st 코스튬",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 1030,
      store_name: "키테루 키테루",
      rank: 6,
      id: 'detail_id',
    },

    {
      thumbnail: "/resources/images/dummy_img/product_07.png",
      title: "섹시 스트랩 간호사 st 코스튬",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 1030,
      store_name: "키테루 키테루",
      rank: 6,
      id: 'detail_id',
    },

    {
      thumbnail: "/resources/images/dummy_img/product_07.png",
      title: "섹시 스트랩 간호사 st 코스튬",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 1030,
      store_name: "키테루 키테루",
      rank: 6,
      id: 'detail_id',
    },

    {
      thumbnail: "/resources/images/dummy_img/product_07.png",
      title: "섹시 스트랩 간호사 st 코스튬",
      price: 30000,
      discount_rate: 12,
      discount_price: 20000,
      heart_count: 1030,
      store_name: "키테루 키테루",
      rank: 6,
      id: 'detail_id',
    },
  ];

  return (
    <>
      {ListProduct.length > 0 ? (
        <FlexChild id={id} className={styles.ProductSlider}>
          <Swiper
            loop={true}
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
            {ListProduct.map((product, i) => {
              return (
                <SwiperSlide key={i}>
                  <TestProductCard
                    product={product}
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
export function DetailTabContainer() {
  const [tabParams, setTabParams] = useState("description");
  const tabParamsChange = (params: string) => {
    setTabParams(params);
  };

  const tabAraays = [
    { name: "상세정보", paramsName: "description", component: <Description /> },
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
                <Span className={styles.list_count}>34</Span> // 리뷰, qna 개수 출력
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
