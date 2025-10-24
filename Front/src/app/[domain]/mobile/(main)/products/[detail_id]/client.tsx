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
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";

import Container from "@/components/container/Container";
import ModalBase from "@/modals/ModalBase";
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
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import DeliveryGuide from "./_deliveryGuide/deliveryGuide";
import Description from "./_description/description";
import InquiryClient from "./_inquiry/client";
import Review from "./_review/review";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

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

  const onCartClick = async (selected: Variant[]): Promise<boolean> => {
    if (!userData) {
      NiceModal.show("confirm", {
        message: "로그인 필요합니다.",
        confirmText: "로그인하기",
        cancelText: "취소",
        onConfirm: () => navigate(`/auth/login?redirect_url=${pathname}`),
      });
      return false;
    }
    if (!selected.some((f) => f.quantity > 0)) {
      toast({ message: "상품을 최소 1개 이상 담아주세요" });
      return false;
    }

    if (selected.length > 0) {
      const { message, error } = await requester.addItem({
        store_id: storeData?.id,
        variants: selected,
      });
      if (message) {
        reload();
        toast({ message: "장바구니 물건을 담았습니다." });
      } else {
        toast({ message: error });
      }
      return true;
    }
    return false;
  };
  const onPurchaseClick = async (selected: Variant[]): Promise<boolean> => {
    if (!userData) {
      NiceModal.show("confirm", {
        message: "로그인 필요합니다.",
        confirmText: "로그인하기",
        cancelText: "취소",
        onConfirm: () => navigate(`/auth/login?redirect_url=${pathname}`),
      });
      return false;
    }
    if (!selected.some((f) => f.quantity > 0)) {
      toast({ message: "상품을 최소 1개 이상 담아주세요" });
      return false;
    }

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
      return true;
    }
    return false;
  };
  useEffect(() => {
    setTotalReviewCount(Number(product?.reviews?.count ?? 0));
  }, [product?.reviews?.count]);

  const { isMobile } = useBrowserEvent();

  return (
    <section className={clsx("detail_root")}>
      <Container className={clsx(styles.detail_container)}>
        <DetailFrame
          product={product}
          freeShipping={freeShipping}
          shipping={shipping}
          onCartClick={onCartClick}
          onPurchaseClick={onPurchaseClick}
          onWishClick={onWishClick}
        />

        {children}

        <HorizontalFlex marginTop={30} alignItems="start" gap={40}>
          <DetailTabContainer
            product={product}
            totalQaCount={totalQaCount}
            totalReviewCount={totalReviewCount}
            page={page}
            setPage={setPage}
            fetchQAs={fetchQAs}
            qaList={qaList}
            totalPage={totalPage}
          />
          {/* <MiniInfoBox
            product={product}
            selected={selected}
            setSelected={setSelected}
          /> */}
        </HorizontalFlex>
      </Container>
    </section>
  );
}

// 제품정보 상단
export function DetailFrame({
  product,
  freeShipping,
  shipping,
  onCartClick,
  onPurchaseClick,
  onWishClick,
}: {
  product: ProductData;
  freeShipping?: ShippingMethodData;
  shipping?: ShippingMethodData;
  onCartClick: (selected: Variant[]) => Promise<any>;
  onPurchaseClick: (selected: Variant[]) => Promise<any>;
  onWishClick: () => void;
}) {
  const { userData } = useAuth();
  const { storeData } = useStore();
  return (
    <VerticalFlex alignItems="start">
      <FlexChild className={styles.detail_thumbnail}>
        <Image
          src={
            userData?.adult
              ? product?.thumbnail
              : "/resources/images/19_only.png"
          }
          width={"100%"}
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

        <VerticalFlex>
          {product.discount_rate > 0 && (
            <FlexChild className={styles.regular_price}>
              <P>{product?.price}</P>₩
            </FlexChild>
          )}

          <FlexChild>
            {product.discount_rate > 0 && (
              <FlexChild className={styles.sale_price}>
                <P>{product.discount_rate}%</P>
              </FlexChild>
            )}
            <FlexChild className={styles.price} marginLeft={5}>
              <P>{product?.discount_price}</P> ₩
            </FlexChild>
          </FlexChild>
        </VerticalFlex>

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
            <P size={16} color="#ddd" weight={600}>
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
            <P size={14} color="#797979" whiteSpace="prewrap">
              {shipping?.description}
            </P>
            <P
              size={14}
              color="#797979"
              hidden={!freeShipping || freeShipping.min === 0}
            >
              <Span>{freeShipping?.min}</Span>
              <Span>원 이상 구매시 무료배송</Span>
            </P>
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>

      <BottomPayBox
        product={product}
        onCartClick={onCartClick}
        onPurchaseClick={onPurchaseClick}
        onWishClick={onWishClick}
      />
    </VerticalFlex>
  );
}

// 구매하기 버튼 누르면 나오는 모달
const buyCartModal = NiceModal.create(
  ({
    product,
    onCartClick,
    onPurchaseClick,
  }: {
    product: ProductData;
    onCartClick: (selected: Variant[]) => Promise<boolean>;
    onPurchaseClick: (selected: Variant[]) => Promise<any>;
  }) => {
    const [selected, setSelected] = useState<Variant[]>(
      product.variants.map((v: VariantData) => ({
        variant_id: v.id,
        quantity: 1,
      }))
    );
    const modal = useModal();
    const modalRef = useRef<any>(null);

    return (
      <ModalBase
        ref={modalRef}
        slideUp
        // slideLeft
        cancelBack
        topRound
        width={"100%"}
        maxWidth={768}
        minWidth={220}
        // height={"fit-content"}
        clickOutsideToClose={true}
        onClose={modal.remove}
        style={{ minHeight: "258px", maxHeight: "80dvh" }}
      >
        <VerticalFlex
          className={styles.pay_cart_modal}
          overflow="scroll"
          overflowY="scroll"
          hideScrollbar
        >
          <FlexChild className={styles.title_header}>
            <P>구매하기</P>
          </FlexChild>

          <VerticalFlex className={styles.option_box}>
            <OptionItem
              product={product}
              setSelected={setSelected}
              selected={selected}
            />
          </VerticalFlex>

          {/* 총 금액 표시 */}
          <VerticalFlex className={styles.total_box}>
            <FlexChild className={styles.total_item}>
              <P className={styles.total_txt}>총 상품 금액</P>

              <FlexChild className={styles.price} width={"auto"}>
                <P>
                  {product.variants.reduce((acc, now) => {
                    const quantity =
                      selected.find((f) => f.variant_id === now.id)?.quantity ||
                      0;

                    return acc + now.discount_price * quantity;
                  }, 0)}
                </P>
                ₩
              </FlexChild>
            </FlexChild>

            <FlexChild className={styles.button_box}>
              <FlexChild className={styles.cart_box}>
                <Button
                  className={styles.cart_btn}
                  onClick={async () => {
                    const result = await onCartClick(selected);
                    if (result) modalRef.current.close();
                  }}
                >
                  <P>장바구니 담기</P>
                </Button>
              </FlexChild>

              <FlexChild className={styles.buy_box}>
                <Button
                  className={styles.buy_btn}
                  onClick={async () => {
                    const result = await onPurchaseClick(selected);
                    if (result) modalRef.current.close();
                  }}
                >
                  <P>바로구매</P>
                </Button>
              </FlexChild>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

// 하단 고정 네비
export function BottomPayBox({
  product,
  onCartClick,
  onPurchaseClick,
  onWishClick,
}: {
  product: ProductData;
  onCartClick: (selected: Variant[]) => Promise<any>;
  onPurchaseClick: (selected: Variant[]) => Promise<any>;
  onWishClick: () => void;
}) {
  const variants: VariantData[] = Array.isArray(product?.variants)
    ? product.variants
    : [];

  const anyPurchasable = variants.some(
    (v) => (v?.stack ?? 0) > 0 && !!v?.buyable && !v?.warehousing
  );

  const disabledReason = product?.warehousing
    ? "입고예정"
    : !product?.buyable
    ? "판매중단"
    : !anyPurchasable
    ? variants.some((v) => v?.warehousing)
      ? "입고예정"
      : "재고부족"
    : null;

  const disabled = !!disabledReason;
  return (
    <div className={clsx(styles.bottom_pay_wrap)}>
      <FlexChild className={clsx("mob_page_container", styles.bottom_pay_box)}>
        <HorizontalFlex className={styles.buyButton_box}>
          <FlexChild width={"auto"}>
            <Button className={styles.heart_btn} onClick={onWishClick}>
              <Image
                src={
                  product.wish
                    ? "/resources/icons/main/product_heart_icon_active.png"
                    : "/resources/icons/main/product_heart_icon.png"
                }
                width={35}
              />
            </Button>
          </FlexChild>

          <FlexChild className={styles.buy_box}>
            <Button
              disabled={disabled}
              className={styles.buy_btn}
              onClick={() =>
                NiceModal.show(buyCartModal, {
                  product,
                  onCartClick,
                  onPurchaseClick,
                })
              }
            >
              <P>{disabledReason ?? "구매하기"}</P>
            </Button>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </div>
  );
}

// 옵션 개수 계산기
export function OptionItem({
  product,
  selected,
  setSelected,
}: {
  product: any;
  selected: Variant[];
  setSelected: Dispatch<SetStateAction<Variant[]>>;
}) {
  useEffect(() => {
    const updated = selected.map((s) => {
      const v = product?.variants?.find(
        (x: VariantData) => x.id === s.variant_id
      );
      if (!v) return s;

      const blocked =
        !product?.buyable ||
        product?.warehousing ||
        !v.buyable ||
        v.warehousing ||
        (v.stack ?? 0) <= 0;

      if (blocked) return { ...s, quantity: 0 };

      const stack = Number(v.stack ?? 0);
      if (s.quantity > stack) return { ...s, quantity: stack };
      if (s.quantity < 0) return { ...s, quantity: 0 };
      return s;
    });
    setSelected(updated);
  }, [product?.buyable, product?.warehousing, product?.variants]);

  return (
    <VerticalFlex gap={20} padding={"0 5px"}>
      {/* 기본 상품 수량 */}
      {product.variants.map((v: VariantData) => {
        const index = selected.findIndex((f) => f.variant_id === v.id);
        const select = selected[index];

        const variantDisabled =
          !product.buyable ||
          product.warehousing ||
          !v.buyable ||
          v.warehousing ||
          (v.stack ?? 0) <= 0;

        // 표시용 금액은 변종 단가 기준
        const unitPrice = Number(
          v?.discount_price ?? product?.discount_price ?? 0
        );
        const qty = Number(select.quantity ?? 0);
        const addPrice = qty * unitPrice;

        return (
          <VerticalFlex
            className={styles.option_item}
            key={v.id}
            alignItems="start"
          >
            <VerticalFlex alignItems="start" gap={10}>
              <HorizontalFlex
                className={clsx(styles.txt_item, {
                  [styles.disable]: variantDisabled,
                })}
                gap={10}
                width={"auto"}
              >
                <FlexChild className={styles.op_name}>
                  <P>{v?.title}</P>
                </FlexChild>
              </HorizontalFlex>

              {v.warehousing || product.warehousing ? (
                <FlexChild width={"max-content"}>
                  <P size={14} color="#fff">
                    (입고 예정)
                  </P>
                </FlexChild>
              ) : (v.stack ?? 0) <= 0 ? (
                <FlexChild width={"max-content"}>
                  <P size={14} color="#fff">
                    (재고 부족)
                  </P>
                </FlexChild>
              ) : !v.buyable ? (
                <FlexChild width={"max-content"}>
                  <P size={14} color="#fff">
                    (판매 중단)
                  </P>
                </FlexChild>
              ) : !product.buyable ? (
                <FlexChild width={"max-content"}>
                  <P size={14} color="#fff">
                    (상품 판매 중단)
                  </P>
                </FlexChild>
              ) : null}
            </VerticalFlex>

            {!variantDisabled && (
              <HorizontalFlex
                gap={20}
                fontSize={10}
                className={styles.input_box}
              >
                <FlexChild
                  width={"auto"}
                  gap={5}
                  className={styles.quantity_txt}
                >
                  <Span>{qty}개</Span>
                  <Span>+ {addPrice.toLocaleString("ko-KR")}원</Span>
                </FlexChild>
                {!variantDisabled && (
                  <InputNumber
                    disabled={variantDisabled}
                    value={qty}
                    min={1}
                    max={Number(v.stack)}
                    step={1}
                    onChange={(val) => {
                      const stack = Number(v.stack ?? 0);
                      const next = Math.max(
                        0,
                        Math.min(Number(val ?? 0), stack)
                      );

                      const copy = [...selected];
                      const cur = copy[index] || {
                        variant_id: v.id,
                        quantity: 0,
                      };
                      copy[index] = { ...cur, quantity: next };
                      setSelected(copy);
                    }}
                    width={40}
                  />
                )}
              </HorizontalFlex>
            )}
          </VerticalFlex>
        );
      })}
    </VerticalFlex>
  );
}

// 추천 상품 슬라이드
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
            slidesPerView={2.4}
            speed={600}
            spaceBetween={20}
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 4000 }}
            navigation={{
              prevEl: `#${id} .${styles.prevBtn}`,
              nextEl: `#${id} .${styles.nextBtn}`,
            }}
            breakpoints={{
              580: {
                slidesPerView: 3.2,
              },
              680: {
                slidesPerView: 3.2,
              },
              768: {
                slidesPerView: 4.2,
              },

              1080: {
                slidesPerView: 4.2,
              },
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

          {/* <div className={clsx(styles.naviBtn, styles.prevBtn)}>
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
          </div> */}
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
        contentRef.current.getBoundingClientRect().top + window.scrollY - 100; // 헤더 높이만큼 보정
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
        <InquiryClient
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
    <VerticalFlex className={styles.contents_container} width={"100%"}>
      <HorizontalFlex className={styles.tab_wrap}>
        {tabAraays.map((item) => (
          <FlexChild
            key={item.paramsName}
            className={clsx(
              styles.content_tab,
              tabParams === `${item.paramsName}` && styles.active
            )}
            onClick={() => {
              handleTabClick(item.paramsName);
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
