"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import StarRate from "@/components/star/StarRate";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import { toast, maskTwoThirds } from "@/shared/utils/Functions";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useRef, useEffect, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./photoReviewDetailModal.module.css";
import { requester } from "@/shared/Requester";
import RecommendButton from "@/components/buttons/RecommendButton";

type ReviewEntity = {
  id: string;
  avg: number;
  count: number;
  images?: string[];
  content?: string;
  created_at?: string;
  star_rate?: number;
  user?: { id?: string; name?: string };
  metadata?: {
    source?: string;
    aspects?: { design?: string; finish?: string; maintenance?: string };
  };
  item?: {
    variant?: {
      product?: {
        id?: string;
        title?: string;
        thumbnail?: string;
        reviews?: { count?: number; avg?: number };
        brand?: { title?: string };
        price?: number;
        discount_price?: number;
      };
    };
  };
};

const PhotoReviewDetailModal = NiceModal.create(
  ({
    review,
    onConfirm,
    onCancel,
    width = "80vw",
    height = "80dvh",
  }: {
    review: ReviewEntity;
    onConfirm?: () => void;
    onCancel?: () => void;
    width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
  }) => {
    const modal = useModal();
    const { isMobile } = useBrowserEvent();
    const swiperRef = useRef<SwiperType | null>(null);
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    const paintBullets = (swiper: SwiperType) => {
      const bullets = swiper.pagination?.el?.querySelectorAll(
        ".swiper-pagination-bullet"
      );
      if (!bullets) return;
      bullets.forEach((el) => {
        const bullet = el as HTMLElement;
        bullet.style.setProperty("background-color", "#fff", "important");
        bullet.style.setProperty("opacity", "0.3", "important");
        bullet.style.setProperty("transform", "scale(1)");
        bullet.style.setProperty("margin", "0 4px", "important");
        bullet.style.setProperty("left", "0", "important");
        bullet.style.setProperty("top", "2px", "important");
      });
      const active = swiper.pagination?.el?.querySelector(
        ".swiper-pagination-bullet-active"
      ) as HTMLElement | null;
      if (active) {
        active.style.setProperty("opacity", "1", "important");
        active.style.setProperty("background-color", "#fff", "important");
        active.style.setProperty("transform", "scale(1.66)");
      }
    };
    // 파생 데이터
    const imgs = review.images ?? [];
    const product = review.item?.variant?.product;
    const brandName = product?.brand?.title;
    const productTitle = product?.title;
    const productThumb = product?.thumbnail ?? "/resources/images/no_img.png";
    const price = product?.price;
    const discountPrice = product?.discount_price;
    const prodAvg = review?.avg;
    const prodCount = review?.count;
    const showAvg = prodAvg > 0;
    const showCount = Number(prodCount) > 0;
    const userName = maskTwoThirds(review.user?.name ?? "익명");
    const date = (review.created_at ?? "").slice(0, 10);
    const DISPLAY = {
      design: {
        love: "마음에 쏙 들어요.",
        ok: "보통이에요.",
        not_my_style: "내 취향은 아니네요.",
      },
      finish: {
        good: "양품이에요.",
        ok: "보통이에요.",
        poor: "부실해요.",
      },
      maintenance: {
        easy: "쉽게 관리 가능해요.",
        ok: "보통이에요.",
        hard: "관리하기 어려워요.",
      },
    } as const;
    type AspectKey = keyof typeof DISPLAY;
    type AspectVal<K extends AspectKey> = keyof (typeof DISPLAY)[K];
    const mapAspect = <K extends AspectKey>(k: K, v?: string) => {
      if (!v) return "";
      const dict = DISPLAY[k];
      const key = v.trim() as AspectVal<K>;
      return dict[key] ?? "";
    };

    const designText = mapAspect("design", review.metadata?.aspects?.design);
    const maintenanceText = mapAspect(
      "maintenance",
      review.metadata?.aspects?.maintenance
    );
    const finishText = mapAspect("finish", review.metadata?.aspects?.finish);

    useEffect(() => {
      let alive = true;
      (async () => {
        try {
          const res = await requester.getRecommend(review.id);
          if (!alive) return;
          setLiked(Boolean(res?.content?.id));
        } catch {
          /* noop */
        }
      })();
      return () => {
        alive = false;
      };
    }, [review.id]);

    const toggleRecommend = async () => {
      if (likeLoading) return;
      setLikeLoading(true);
      try {
        if (!liked) {
          await requester.createRecommend({ review_id: review.id });
          setLiked(true);
          window.dispatchEvent(
            new CustomEvent("review:recommend-changed", {
              detail: { id: review.id, delta: +1 },
            })
          );
          toast({ message: "리뷰가 추천되었습니다." });
        } else {
          await requester.deleteRecommend(review.id);
          setLiked(false);
          window.dispatchEvent(
            new CustomEvent("review:recommend-changed", {
              detail: { id: review.id, delta: -1 },
            })
          );
          toast({ message: "추천이 취소되었습니다." });
        }
      } catch (e: any) {
        toast({ message: e?.message || "처리에 실패했습니다." });
      } finally {
        setLikeLoading(false);
      }
    };

    return (
      <ModalBase
        withHeader
        headerStyle={{
          backgroundColor: "#221f22",
          borderBottom: "none",
          color: "#fff",
        }}
        borderRadius={!isMobile ? 10 : 0}
        closeBtnWhite
        width={!isMobile ? "100%" : "100%"}
        maxWidth={!isMobile ? 700 : "auto"}
        height={!isMobile ? height : "100dvh"}
        maxHeight={"auto"}
        title={!isMobile ? "" : "사용 후기"}
        onClose={() => {
          onCancel?.();
          modal.remove();
        }}
        backgroundColor={"#221f22"}
        clickOutsideToClose
      >
        <VerticalFlex
          className={clsx(styles.container, isMobile && styles.mob_container)}
        >
          <HorizontalFlex className={styles.itemBox}>
            {/* 상품 정보: 존재 시 표시 */}
            {(productTitle || brandName || price || discountPrice) && (
              <FlexChild className={styles.product_info} alignItems="start">
                <Image
                  src={productThumb}
                  width={!isMobile ? 100 : 60}
                  height={"auto"}
                />
                <VerticalFlex className={styles.txt_box}>
                  {brandName && (
                    <Span className={styles.brand}>{brandName}</Span>
                  )}
                  {productTitle && (
                    <P
                      lineClamp={2}
                      display="--webkit-box"
                      overflow="hidden"
                      className={styles.title}
                    >
                      {productTitle}
                    </P>
                  )}
                  {(price || discountPrice) && (
                    <FlexChild gap={5}>
                      {price && (
                        <Span
                          className={styles.price}
                          lineClamp={1}
                          display="--webkit-box"
                          overflow="hidden"
                        >
                          {price.toLocaleString()}
                        </Span>
                      )}
                      {discountPrice && (
                        <P
                          className={styles.discount_price}
                          lineClamp={1}
                          display="--webkit-box"
                          overflow="hidden"
                        >
                          {discountPrice.toLocaleString()}원
                        </P>
                      )}
                    </FlexChild>
                  )}
                  {(showAvg || showCount) && (
                    <FlexChild gap={10}>
                      {showAvg && (
                        <StarRate width={80} score={prodAvg!} readOnly />
                      )}
                      {showCount && (
                        <P className={styles.rating}>
                          리뷰 <Span>{prodCount!.toLocaleString()}</Span>
                        </P>
                      )}
                    </FlexChild>
                  )}
                </VerticalFlex>
              </FlexChild>
            )}
            {
              // 모바일일때만 -----------
              isMobile && (
                <UserData
                  starRate={review.star_rate}
                  starSize={[130, 23]}
                  userName={userName}
                  date={date}
                />
              )
            }
            <VerticalFlex className={styles.feedBack}>
              <FlexChild className={styles.item}>
                <P className={styles.label}>외형/디자인</P>
                <P className={styles.cnt}>{designText || <>&nbsp;</>}</P>
              </FlexChild>
              <FlexChild className={styles.item}>
                <P className={styles.label}>유지관리</P>
                <P className={styles.cnt}>{maintenanceText || <>&nbsp;</>}</P>
              </FlexChild>
              <FlexChild className={styles.item}>
                <P className={styles.label}>마감/내구성</P>
                <P className={styles.cnt}>{finishText || <>&nbsp;</>}</P>
              </FlexChild>
            </VerticalFlex>
          </HorizontalFlex>

          {/* 이미지 뷰어 */}
          <FlexChild className={clsx(styles.viewer_swiper)} id="view_swiper">
            <Swiper
              loop
              slidesPerView={1}
              speed={600}
              spaceBetween={0}
              modules={[Pagination, Autoplay, Navigation]}
              pagination={{ dynamicBullets: true, clickable: true }}
              navigation={{
                prevEl: `#view_swiper .${styles.prevBtn}`,
                nextEl: `#view_swiper .${styles.nextBtn}`,
              }}
              autoplay={false}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onAfterInit={paintBullets}
              onSlideChange={paintBullets}
              onPaginationUpdate={paintBullets}
            >
              {imgs.map((thumbnail: string, i: number) => (
                <SwiperSlide key={i} className={styles.swiper_slide}>
                  <FlexChild
                    height={"100%"}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Image
                      src={thumbnail}
                      maxWidth={"100%"}
                      maxHeight={"100%"}
                      objectFit="contain"
                    />
                  </FlexChild>
                </SwiperSlide>
              ))}
            </Swiper>
            {imgs.length > 1 && (
              <>
                <div className={clsx(styles.naviBtn, styles.prevBtn)}>
                  <Image src={"/resources/icons/arrow/slide_arrow.png"} />
                </div>
                <div className={clsx(styles.naviBtn, styles.nextBtn)}>
                  <Image src={"/resources/icons/arrow/slide_arrow.png"} />
                </div>
              </>
            )}
          </FlexChild>

          {/* 사용자·리뷰 본문 */}
          <VerticalFlex className={styles.user_data_wrap}>
            {
              // pc일때만 --------------------------------------------------------------------------------
              !isMobile && (
                <UserData
                  starRate={review.star_rate}
                  starSize={[130, 23]}
                  userName={userName}
                  date={date}
                />
              )
            }
            {review.content && (
              <FlexChild className={styles.content} alignItems="start">
                <P>{review.content}</P>
              </FlexChild>
            )}
            <RecommendButton
              reviewId={review.id}
            />
          </VerticalFlex>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

function UserData({
  starRate,
  userName,
  date,
  starSize,
}: {
  starRate: number | undefined;
  userName: string;
  date: string;
  starSize: [number, number];
}) {
  return (
    <VerticalFlex className={styles.user_box}>
      <FlexChild className={styles.user_data}>
        <StarRate
          width={starSize[0]}
          score={starRate ?? 0}
          starWidth={starSize[1]}
          starHeight={starSize[1]}
          readOnly
        />
        <P className={styles.name}>{userName}</P>
        <P className={styles.date}>{date}</P>
      </FlexChild>

      <FlexChild hidden>
        {/* 리뷰 추천 표시 */}
        <P size={14} color="#fff">
          {3}명에게 도움이 되었어요.
        </P>
      </FlexChild>
    </VerticalFlex>
  );
}

export default PhotoReviewDetailModal;
