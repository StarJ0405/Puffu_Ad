"use client";
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import StarRate from "@/components/star/StarRate";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import {
  useCart,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
export function Name() {
  const navigate = useNavigate();
  const { cartData } = useCart();
  return (
    <HorizontalFlex justifyContent="flex-end" gap={17} alignItems="flex-end">
      <Image
        src="/resources/icons/home_black2x.png"
        height={20}
        width={"auto"}
        onClick={() => navigate("/")}
      />
      <Image
        src="/resources/icons/share_black.png"
        height={20}
        width={"auto"}
      />
      <Div
        position="relative"
        width={"max-content"}
        onClick={() => navigate("/cart")}
      >
        <Div
          top={0}
          right={0}
          position="absolute"
          backgroundColor={"var(--main-color)"}
          width={16}
          height={16}
          borderRadius={"100%"}
          textAlign="center"
          translate={"45% -45%"}
          color="#fff"
          border={"1px solid #fff"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontStyle="semibold"
          hidden={!cartData || cartData?.items?.length < 1}
        >
          <P size={12} weight={600} textAlign="center">
            {cartData?.items?.length}
          </P>
        </Div>
        <Image
          src="/resources/icons/cart_black.png"
          height={20}
          width={"auto"}
        />
      </Div>
    </HorizontalFlex>
  );
}
export function ProductInfo({
  initProduct,
  initCondition,
}: {
  initProduct: any;
  initCondition: any;
}) {
  const { storeData } = useStore();
  const { product_id } = useParams();
  const { [product_id as string]: product } = useData(
    product_id as string,
    initCondition,
    (condition) => {
      return requester.getProduct(product_id as string, condition);
    },
    {
      onReprocessing: (data: any) => data.content,
      fallbackData: initProduct,
      refresh: {
        keepPreviousData: true,
      },
    }
  );
  return (
    <FlexChild>
      <VerticalFlex>
        <FlexChild paddingBottom={3}>
          <Image src={product.thumbnail} width={"100%"} />
        </FlexChild>
        <FlexChild>
          <VerticalFlex padding={15} gap={8}>
            <FlexChild gap={10}>
              <P className={styles.brand}>{product?.brand?.name}</P>
              <Image src="/resources/icons/arrow_right.png" height={8} />
            </FlexChild>
            <FlexChild>
              <P>{product.title}</P>
            </FlexChild>
            <FlexChild alignItems="flex-end">
              <Icon
                name="star"
                type="svg"
                color="var(--main-color)"
                containerWidth={"max-content"}
                size={16}
              />
              <P className={styles.starRateLabel}>4.8</P>
              <P className={styles.reviewCount}>68건의 리뷰</P>
            </FlexChild>
            <FlexChild>
              <VerticalFlex gap={1}>
                <FlexChild hidden={product.discount_rate >= 1}>
                  <P className={styles.discount}>
                    <Span>{product.price}</Span>
                    <Span>{storeData?.currency_unit}</Span>
                  </P>
                </FlexChild>
                <FlexChild gap={6} alignItems="flex-end">
                  <P className={styles.price}>
                    <Span>{product.discount_price}</Span>
                    <Span>{storeData?.currency_unit}</Span>
                  </P>
                  <P
                    className={styles.discount_percent}
                    hidden={product.discount_rate >= 1}
                  >
                    {product.discount_rate}%
                  </P>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
}

export function Shipping({ initProduct }: { initProduct: any }) {
  const { storeData } = useStore();
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodData>();
  const [free, setFree] = useState<ShippingMethodData>();
  useEffect(() => {
    const product: ProductData = initProduct?.content;
    const price = product?.price;

    let free;
    let shippingMethod;
    if (
      product.brand_mode &&
      product?.brand?.methods &&
      product?.brand?.methods?.length > 0
    ) {
      shippingMethod = product?.brand?.methods
        ?.filter((f) => {
          return f.min <= price && (f.max === -1 || f.max > price);
        })
        .sort((m1, m2) => m1.amount - m2.amount)?.[0];
      free = product?.brand?.methods
        ?.filter((f) => f.amount === 0)
        ?.sort((m1, m2) => m1.amount - m2.amount)?.[0];
    } else {
      shippingMethod = storeData?.methods
        ?.filter((f) => {
          return f.min <= price && (f.max === -1 || f.max > price);
        })
        .sort((m1, m2) => m1.amount - m2.amount)?.[0];
      free = storeData?.methods
        ?.filter((f) => f.amount === 0)
        ?.sort((m1, m2) => m1.amount - m2.amount)?.[0];
    }
    setFree(free);
    setShippingMethod(shippingMethod);
  }, [storeData, initProduct]);

  const Content = () => {
    if (!shippingMethod || shippingMethod.amount === 0) {
      return (
        <FlexChild>
          <VerticalFlex gap={4}>
            <FlexChild gap={6}>
              <P className={styles.shippingInfo}>
                <Span paddingRight={"0.5em"}>배송비</Span>
                <Span>무료</Span>
              </P>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      );
    }
    return (
      <>
        <FlexChild>
          <P className={styles.shippingInfo}>{shippingMethod?.description}</P>
        </FlexChild>
        <FlexChild>
          <VerticalFlex gap={4}>
            <FlexChild gap={6}>
              <P className={styles.shippingInfo}>
                <Span paddingRight={"0.5em"}>배송비</Span>
                <Span>{shippingMethod?.amount}</Span>
                <Span>원</Span>
              </P>
              <P
                className={styles.shippingExtra}
                hidden={!free || free?.min === 0}
              >
                <Span>(</Span>
                <Span>{free?.min}</Span>
                <Span>원 이상 구매시 무료)</Span>
              </P>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      </>
    );
  };
  return (
    <FlexChild>
      <VerticalFlex padding={15} gap={10}>
        <FlexChild gap={8}>
          <Image
            src="/resources/icons/shipping.png"
            height={18}
            width={"auto"}
          />
          <P className={styles.shippingHeader}>배송정보</P>
        </FlexChild>
        <Content />
      </VerticalFlex>
    </FlexChild>
  );
}

export function ProductHeader() {
  const [target, setTarget] = useState<"info" | "review" | "question">("info");
  const handleMove = (id: "info" | "review" | "question") => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <FlexChild position="sticky" top={50} backgroundColor="#fff" zIndex={10}>
      <HorizontalFlex>
        <FlexChild
          className={clsx(styles.header, {
            [styles.select]: target === "info",
          })}
          onClick={() => handleMove("info")}
        >
          <P>상품정보</P>
          <FlexChild
            width={0}
            id="info_button"
            onClick={(e) => {
              e.stopPropagation();
              setTarget("info");
            }}
            hidden
          />
        </FlexChild>
        <FlexChild
          className={clsx(styles.header, {
            [styles.select]: target === "review",
          })}
          onClick={() => handleMove("review")}
        >
          <P>리뷰 68</P>
          <FlexChild
            width={0}
            id="review_button"
            onClick={(e) => {
              e.stopPropagation();
              setTarget("review");
            }}
            hidden
          />
        </FlexChild>
        <FlexChild
          className={clsx(styles.header, {
            [styles.select]: target === "question",
          })}
          onClick={() => handleMove("question")}
        >
          <P>문의</P>
          <FlexChild
            width={0}
            id="question_button"
            onClick={(e) => {
              e.stopPropagation();
              setTarget("question");
            }}
            hidden
          />
        </FlexChild>
      </HorizontalFlex>
    </FlexChild>
  );
}

export function ProductDetail({ initProduct }: { initProduct: any }) {
  const observer = useRef<any>(null);
  const [fold, setFold] = useState(true);
  const handleFold = useCallback(() => {
    setFold(!fold);
  }, [fold]);
  useEffect(() => {
    const element = document.getElementById("detail");
    if (element) {
      if (fold) {
        element.classList.add(styles.fold);
      } else {
        element.classList.remove(styles.fold);
      }
    }
  }, [fold]);
  return (
    <FlexChild id="info" scrollMarginTop={100}>
      <VerticalFlex>
        <FlexChild
          Ref={(node: any) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
              (entries) => {
                if (entries[0].isIntersecting)
                  document.getElementById("info_button")?.click();
              },
              {
                root: null,
                rootMargin: "100px",
                threshold: 0.1,
              }
            );
            if (node) observer.current.observe(node);
            return;
          }}
        />
        <DetailContent html={initProduct?.content?.detail} />
        <FlexChild padding={15}>
          <Button className={styles.detailButton} onClick={handleFold}>
            <P>상품정보 {fold ? "더보기" : "접기"}</P>
            <Image
              src={
                fold
                  ? "/resources/icons/down_arrow.png"
                  : "/resources/icons/up_arrow.png"
              }
              width={12}
              height={6}
            />
          </Button>
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
}

const DetailContent = memo(({ html }: { html: string }) => {
  return (
    <Div
      id="detail"
      className={clsx(styles.detail)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

export function Review() {
  const observer = useRef<any>(null);
  const reviews = [];
  return (
    <FlexChild id="review" padding={15} scrollMarginTop={100}>
      <VerticalFlex>
        <FlexChild
          Ref={(node: any) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
              (entries) => {
                if (entries[0].isIntersecting)
                  document.getElementById("review_button")?.click();
                else {
                  const top = entries[0].target.getBoundingClientRect().top;
                  if (top > 0) document.getElementById("info_button")?.click();
                  else document.getElementById("question_button")?.click();
                }
              },
              {
                root: null,
                rootMargin: "100px",
                threshold: 0.1,
              }
            );
            if (node) observer.current.observe(node);
            return;
          }}
        />
        {reviews?.length > 0 ? (
          <>
            <FlexChild>
              <HorizontalFlex alignItems="flex-start">
                <FlexChild>
                  <P>
                    <Span className={styles.reviewHeader}>리뷰</Span>
                    <Span className={styles.reviewCount}>(68)</Span>
                  </P>
                </FlexChild>
                <FlexChild width={"max-content"}>
                  <P className={styles.reviewPlus}>더보기</P>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
            <FlexChild padding={10} justifyContent="center" gap={12}>
              <P className={styles.reviewStarRate} maximumFractionDigits={1}>
                {4.8}
              </P>
              <StarRate
                fillColor="var(--main-color)"
                width={"max-content"}
                starWidth={20}
                starHeight={20}
                score={4.8}
                readOnly
              />
            </FlexChild>
            <FlexChild padding={"14px 0"} gap={2}>
              <Select
                options={[{ display: "전체리뷰", value: "all" }]}
                value={"all"}
              />
              <Select
                options={[{ display: "추천순", value: "recommend" }]}
                value={"recommend"}
              />
            </FlexChild>
          </>
        ) : (
          <FlexChild padding={"100px 30px"}>
            <VerticalFlex gap={16}>
              <Image
                src="/resources/icons/no_review.png"
                height={65}
                width={"auto"}
              />
              <P className={styles.noReview}>작성된 리뷰가 없어요</P>
            </VerticalFlex>
          </FlexChild>
        )}
      </VerticalFlex>
    </FlexChild>
  );
}

export function Question() {
  const observer = useRef<any>(null);
  const questions = [];
  return (
    <FlexChild id="question" padding={15} scrollMarginTop={100}>
      <VerticalFlex>
        <FlexChild
          Ref={(node: any) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
              (entries) => {
                if (entries[0].isIntersecting)
                  document.getElementById("question_button")?.click();
                else document.getElementById("review_button")?.click();
              },
              {
                root: null,
                rootMargin: "100px",
                threshold: 0.1,
              }
            );
            if (node) observer.current.observe(node);
            return;
          }}
        />
        {questions?.length > 0 ? (
          <></>
        ) : (
          <FlexChild padding={"100px 30px"}>
            <VerticalFlex>
              <Image
                src="/resources/icons/q&a.png"
                height={49}
                width={"auto"}
                marginBottom={16}
              />
              <P className={styles.noQuestionTitle}>궁금한 점이 있으신가요?</P>
              <P>
                <Span className={styles.noQuestionDescriptionBold}>
                  반품/교환 관련 문의
                </Span>
                <Span className={styles.noQuestionDescription}>는</Span>
              </P>
              <P
                className={styles.noQuestionDescription}
              >{`마이페이지 > 1:1문의를 이용해주세요`}</P>
              <Button className={styles.noQuestionButton}>
                판매자에게 상품 문의하기
              </Button>
            </VerticalFlex>
          </FlexChild>
        )}
      </VerticalFlex>
    </FlexChild>
  );
}

export function Footer({
  initCondition,
  initProduct,
}: {
  initCondition: any;
  initProduct: any;
}) {
  const { product_id } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { [product_id as string]: product } = useData(
    product_id as string,
    initCondition,
    (condition) => {
      return requester.getProduct(product_id as string, condition);
    },
    {
      onReprocessing: (data: any) => data.content,
      fallbackData: initProduct,
      refresh: {
        keepPreviousData: true,
      },
    }
  );
  return (
    <FlexChild className={styles.purchaseWrapper}>
      <HorizontalFlex>
        <FlexChild width={"max-content"} padding={"0 15px"}>
          <VerticalFlex>
            <Image src="/resources/icons/heart.png" size={22} />
            <P>{102}</P>
          </VerticalFlex>
        </FlexChild>
        <FlexChild>
          <Button
            disabled={
              !product.buyable ||
              product.variants.every((variant: VariantData) => !variant.buyable)
            }
            className={styles.purchaseButton}
            onClick={() =>
              userData
                ? NiceModal.show("purchase", {
                    product,
                  })
                : NiceModal.show("confirm", {
                    message: "로그인이 필요합니다.",
                    cancelText: "취소",
                    confirmText: "로그인하기",
                    onConfirm: () =>
                      navigate(`/login?redirect_url=${window.location.href}`),
                  })
            }
          >
            <P fontSize={"inherit"}>
              {!product.buyable ||
              product.variants.every((variant: VariantData) => !variant.buyable)
                ? "구매불가"
                : "구매하기"}
            </P>
          </Button>
        </FlexChild>
      </HorizontalFlex>
    </FlexChild>
  );
}
