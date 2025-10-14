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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

import ProductCard from "@/components/card/ProductCard";
import NoContent from "@/components/noContent/noContent";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Container from "@/components/container/Container";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import {
  useCart,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import { Storage } from "@/shared/utils/Data";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import DeliveryGuide from "./_deliveryGuide/deliveryGuide";
import Description from "./_description/description";
import Inquiry from "./_inquiry/inquiry";
import Review from "./_review/review";

interface Variant {
  variant_id: string;
  quantity: number;
}
export function ProductWrapper({
  initProduct,
  initCondition,
  children,
}: {
  initProduct: any;
  initCondition: any;
  children: React.ReactNode;
}) {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { storeData } = useStore();
  const { reload } = useCart();
  const [shipping, setShipping] = useState<ShippingMethodData>();
  const [freeShipping, setFreeShipping] = useState<ShippingMethodData>();
  const [qaList, setQaList] = useState<QAData[]>([]);
  const [totalQaCount, setTotalQaCount] = useState(0);
  const [totalReviewCount, setTotalReviewCount] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const pageSize = 5;

  const { product, mutate } = useData(
    "product",
    { ...initCondition, id: initProduct?.content?.id },
    (condition) => {
      const id = condition.id;
      delete condition.id;
      return requester.getProduct(id, condition);
    },
    {
      onReprocessing: (data) => data.content,
      fallbackData: initProduct,
    }
  );
  const [selected, setSelected] = useState<Variant[]>(
    product.variants.map((v: VariantData) => ({
      variant_id: v.id,
      quantity: 0,
    }))
  );

  const fetchQAs = async (pageNumber: number) => {
    const res = await requester.getProductQAs(initProduct?.content?.id, {
      relations: ["user"],
      pageSize: pageSize,
      pageNumber: pageNumber,
    });

    if (res) {
      setQaList(res.content);
      setTotalPage(res.totalPages);
      setTotalQaCount(res.NumberOfTotalElements);
    }
  };

  useEffect(() => {
    if (initProduct?.content?.id) {
      fetchQAs(page);
    }
  }, [initProduct?.content?.id, page]);

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
  useEffect(() => {
    const _product: ProductData = product;
    const price = _product?.price;

    const shippingMethod = storeData?.methods
      ?.filter((f) => {
        return f.min <= price && (f.max === -1 || f.max > price);
      })
      .sort((m1, m2) => m1.amount - m2.amount)?.[0];
    const free = storeData?.methods
      ?.filter((f) => f.amount === 0)
      ?.sort((m1, m2) => m1.amount - m2.amount)?.[0];
    setFreeShipping(free);
    setShipping(shippingMethod);
  }, [product, storeData]);

  const onCartClick = async (): Promise<any> => {
    if (!userData)
      return NiceModal.show("confirm", {
        message: "로그인 필요합니다.",
        confirmText: "로그인하기",
        cancelText: "취소",
        onConfirm: () => navigate("/auth/login"),
      });
    if (!selected.some((f) => f.quantity > 0))
      return toast({ message: "상품을 최소 1개 이상 담아주세요" });

    if (selected.length > 0) {
      const { message, error } = await requester.addItem({
        store_id: storeData?.id,
        variants: selected,
      });
      if (message) {
        reload();
        toast({ message: "장바구니 물건을 담았습니다." });
        setSelected([
          ...selected.map((s) => ({ variant_id: s.variant_id, quantity: 0 })),
        ]);
      } else {
        toast({ message: error });
      }
    }
  };
  const onPurchaseClick = async (): Promise<any> => {
    if (!userData)
      return NiceModal.show("confirm", {
        message: "로그인 필요합니다.",
        confirmText: "로그인하기",
        cancelText: "취소",
        onConfirm: () => navigate("/auth/login"),
      });
    if (!selected.some((f) => f.quantity > 0))
      return toast({ message: "상품을 최소 1개 이상 담아주세요" });

    if (selected.length > 0) {
      const { message, error } = await requester.addItem({
        store_id: storeData?.id,
        variants: selected,
      });
      if (message) {
        reload().then(() => navigate("/orders/cart"));
      } else {
        toast({ message: error });
      }
    }
  };
  useEffect(() => {
    setTotalReviewCount(Number(product?.reviews?.count ?? 0));
  }, [product?.reviews?.count]);

  return (
    <section className="root">
      <Container className={clsx("page_container", styles.detail_container)}>
        <DetailFrame
          product={product}
          freeShipping={freeShipping}
          shipping={shipping}
          setSelected={setSelected}
          selected={selected}
          onCartClick={onCartClick}
          onPurchaseClick={onPurchaseClick}
          onWishClick={onWishClick}
        />

        {children}

        <HorizontalFlex marginTop={30} alignItems="start" gap={40}>
          <DetailTabContainer
            product={product}
            totalQaCount={totalQaCount}
            qaList={qaList}
            page={page}
            totalReviewCount={totalReviewCount}
            totalPage={totalPage}
            setPage={setPage}
            fetchQAs={fetchQAs}
          />
          <MiniInfoBox
            product={product}
            selected={selected}
            setSelected={setSelected}
          />
        </HorizontalFlex>
      </Container>
    </section>
  );
}

export function DetailFrame({
  product,
  freeShipping,
  shipping,
  selected,
  setSelected,
  onCartClick,
  onPurchaseClick,
  onWishClick,
}: {
  product: ProductData;
  freeShipping?: ShippingMethodData;
  shipping?: ShippingMethodData;
  selected: Variant[];
  setSelected: Dispatch<SetStateAction<Variant[]>>;
  onCartClick: () => Promise<any>;
  onPurchaseClick: () => Promise<any>;
  onWishClick: () => void;
}) {
  const { userData } = useAuth();
  const { storeData } = useStore();
  return (
    <HorizontalFlex gap={60} alignItems="start">
      <FlexChild className={styles.detail_thumbnail}>
        <Image
          src={
            userData?.adult
              ? product?.thumbnail
              : "/resources/images/19_only.png"
          }
          width={600}
          height={"auto"}
        />
      </FlexChild>

      <VerticalFlex className={styles.detail_infoBox} alignItems="start">
        <FlexChild className={styles.brand}>
          <Span>{product?.brand.name}</Span>
        </FlexChild>

        <FlexChild className={styles.detail_title}>
          <P lineClamp={4} display="--webkit-box" overflow="hidden">
            {product?.title}
          </P>
        </FlexChild>

        <HorizontalFlex marginBottom={17} gap={10}>
          <FlexChild className={styles.price} marginLeft={5}>
            <P>{product?.discount_price}</P> ₩
          </FlexChild>

          {product.discount_rate > 0 && (
            <FlexChild className={styles.sale_price}>
              <P>{product.discount_rate}%</P>
            </FlexChild>
          )}
          {product.discount_rate > 0 && (
            <FlexChild className={styles.regular_price}>
              <P>{product?.price}</P>₩
            </FlexChild>
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
              <Span>배송비 </Span>
              {shipping?.amount === 0 ? (
                <Span>무료</Span>
              ) : (
                <>
                  <Span>{shipping?.amount || 0}</Span>
                  <Span>{storeData?.currency_unit}</Span>
                </>
              )}
            </P>
            <P size={14} color="#ddd" whiteSpace="prewrap">
              {shipping?.description}
            </P>
            <P
              size={14}
              color="#ddd"
              hidden={!freeShipping || freeShipping.min === 0}
            >
              <Span>{freeShipping?.min}</Span>
              <Span>원 이상 구매시 무료배송</Span>
            </P>
          </VerticalFlex>
        </VerticalFlex>

        <VerticalFlex className={styles.option_box}>
          <OptionItem
            product={product}
            setSelected={setSelected}
            selected={selected}
          />
        </VerticalFlex>

        <HorizontalFlex className={styles.total_box}>
          <P className={styles.total_txt}>총 상품 금액</P>

          <FlexChild className={styles.price} width={"auto"}>
            <P>
              {product.variants.reduce((acc, now) => {
                const quantity =
                  selected.find((f) => f.variant_id === now.id)?.quantity || 0;

                return acc + now.discount_price * quantity;
              }, 0)}
            </P>
            ₩
          </FlexChild>
        </HorizontalFlex>

        <BuyButtonGroup
          product={product}
          onCartClick={onCartClick}
          onPurchaseClick={onPurchaseClick}
          onWishClick={onWishClick}
        />
      </VerticalFlex>
    </HorizontalFlex>
  );
}

// 미니 구매란
export function MiniInfoBox({
  product,
  selected,
  setSelected,
}: {
  product: ProductData;
  selected: Variant[];
  setSelected: Dispatch<SetStateAction<Variant[]>>;
}) {
  return (
    <FlexChild width={"auto"} className={styles.mini_infoBox}>
      <VerticalFlex gap={50}>
        <OptionItem
          product={product}
          setSelected={setSelected}
          selected={selected}
        />

        <HorizontalFlex className={styles.total_box} gap={10}>
          <P className={styles.total_txt}>총 상품 금액</P>
          <FlexChild
            className={styles.price}
            width={"auto"}
            justifyContent="end"
          >
            <P>
              {product.variants.reduce((acc, now) => {
                const quantity =
                  selected.find((f) => f.variant_id === now.id)?.quantity || 0;

                return acc + now.discount_price * quantity;
              }, 0)}
            </P>
            ₩
          </FlexChild>
        </HorizontalFlex>

        {/* <BuyButtonGroup onWishClick={onWishClick} /> */}
      </VerticalFlex>
    </FlexChild>
  );
}

// 옵션 개수 계산기
export function OptionItem({
  product,
  selected,
  setSelected,
}: {
  product: ProductData;
  selected: Variant[];
  setSelected: Dispatch<SetStateAction<Variant[]>>;
}) {
  useEffect(() => {
    // 재고 부족 또는 판매 중단된 옵션 자동 초기화
    const updated = selected.map((s) => {
      const variant = product.variants.find((v) => v.id === s.variant_id);
      if (!variant) return s;
      if (!variant.buyable || variant.stack <= 0) {
        return { ...s, quantity: 0 };
      }
      return s;
    });
    setSelected(updated);
  }, [product.variants]);

  return (
    <VerticalFlex gap={20}>
      {/* 기본 상품 수량 */}
      {product.variants.map((v: VariantData) => {
        const index = selected.findIndex((f) => f.variant_id === v.id);
        const select = selected[index];
        // 재고 부족 또는 판매 중단 표시
        const disabled = !product.buyable || !v.buyable || v.stack <= 0;
        return (
          <HorizontalFlex className={styles.option_item} key={v.id} alignItems={!disabled ? "start" : 'center'}>
            {
              !disabled &&(
                <InputNumber
                  disabled={disabled}
                  value={select?.quantity}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(val) => {
                    select.quantity = val;
                    selected[index] = select;
                    setSelected([...selected]);
                  }}
                />
              )
            }
            {v.stack <= 0 ? (
              <FlexChild width={"max-content"} minWidth={142} padding={'10px 0'}>
                <P>(재고 부족)</P>
              </FlexChild>
            ) : !v.buyable ? (
              <FlexChild width={"max-content"} minWidth={142} padding={'10px 0'}>
                <P>(판매 중단)</P>
              </FlexChild>
            ) : (
              <></>
            )}
            <HorizontalFlex className={styles.txt_item} gap={10} width={"auto"}>
              <FlexChild className={clsx(styles.op_name, {[styles.disabled]: disabled})}>
                <P>{v?.title}</P>
              </FlexChild>
              

              <FlexChild width={"auto"} gap={5}>
                {
                !disabled && (
                    <>
                      <Span>{select.quantity}개</Span>
                      <Span>+ {select.quantity * product?.discount_price}원</Span>
                    </>
                  )
                }
              </FlexChild>
            </HorizontalFlex>
          </HorizontalFlex>
        );
      })}
    </VerticalFlex>
  );
}

// 좋아요 장바구니 구매버튼 묶음
export function BuyButtonGroup({
  product,
  onCartClick,
  onPurchaseClick,
  onWishClick,
}: {
  product: ProductData;
  onCartClick: () => Promise<any>;
  onPurchaseClick: () => Promise<any>;
  onWishClick: () => void;
}) {
  return (
    <HorizontalFlex className={styles.buyButton_box}>
      <FlexChild width={"auto"}>
        <Button className={styles.heart_btn} onClick={onWishClick}>
          <Image
            src={
              product.wish
                ? "/resources/icons/main/product_heart_icon_active.png"
                : "/resources/icons/main/product_heart_icon.png"
            }
            width={30}
          />
          {/* <Image src={} width={30} /> */}
        </Button>
      </FlexChild>

      <FlexChild className={styles.cart_box}>
        <Button
          className={styles.cart_btn}
          onClick={onCartClick}
          disabled={!product.buyable}
        >
          <P>{product.buyable ? `장바구니` : "판매 중단"}</P>
        </Button>
      </FlexChild>

      <FlexChild className={styles.buy_box}>
        <Button
          className={styles.buy_btn}
          onClick={onPurchaseClick}
          disabled={!product.buyable}
        >
          <P>{product.buyable ? `바로 구매` : "판매 중단"}</P>
        </Button>
      </FlexChild>
    </HorizontalFlex>
  );
}

export function ProductSlider({
  id,
  lineClamp,
  listArray,
}: {
  id: string;
  lineClamp?: number;
  listArray: any;
}) {
  return (
    <>
      {listArray?.length > 0 ? (
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
            {listArray?.map((product: ProductData, i: number) => {
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

// 제품 정보 및 내용
export function DetailTabContainer({
  product,
  totalReviewCount,
  totalQaCount,
  qaList,
  page,
  totalPage,
  setPage,
  fetchQAs,
}: {
  product: ProductData;
  totalReviewCount: number;
  totalQaCount: number;
  qaList: QAData[];
  page: number;
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  fetchQAs: (pageNumber: number) => void;
}) {
  const [tabParams, setTabParams] = useState("description");
  const tabParamsChange = (params: string) => {
    setTabParams(params);
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (name: string) => {
    tabParamsChange(name);

    if (contentRef.current) {
      const top =
        contentRef.current.getBoundingClientRect().top + window.scrollY - 140; // 헤더 높이만큼 보정
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const tabAraays = [
    {
      name: "상세정보",
      paramsName: "description",
      component: <Description product={product} />,
    },
    {
      name: "사용후기",
      paramsName: "review",
      component: <Review product={product} />,
      count: totalReviewCount,
    },
    {
      name: "상품 Q&A",
      paramsName: "inquiry",
      component: (
        <Inquiry
          qaList={qaList}
          page={page}
          totalPage={totalPage}
          setPage={setPage}
          fetchQAs={fetchQAs}
        />
      ),
      count: totalQaCount,
    },
    {
      name: "배송/반품/교환/안내",
      paramsName: "deliveryGuide",
      component: <DeliveryGuide />,
    },
  ];

  return (
    <VerticalFlex className={styles.contents_container} width={850}>
      <HorizontalFlex className={styles.tab_wrap}>
        {tabAraays.map((item) => (
          <FlexChild
            key={item.paramsName}
            className={clsx(
              styles.content_tab,
              tabParams === `${item.paramsName}` && styles.active
            )}
            onClick={() => {
              handleTabClick(`${item.paramsName}`);
              tabParamsChange(`${item.paramsName}`);
            }}
          >
            <P>
              {item.name}
              {["review", "inquiry"].includes(item.paramsName) && (
                <Span className={styles.list_count}>{item.count}</Span> // 리뷰, qna 개수 출력
              )}
            </P>
          </FlexChild>
        ))}
      </HorizontalFlex>
      <div ref={contentRef}></div> {/* 탭 스크롤 이동 추적용 */}
      <VerticalFlex className={styles.content_view}>
        <article key={tabParams} className={styles.tab_fade}>
          {tabAraays.find((t) => t.paramsName === tabParams)?.component}
        </article>
      </VerticalFlex>
    </VerticalFlex>
  );
}
