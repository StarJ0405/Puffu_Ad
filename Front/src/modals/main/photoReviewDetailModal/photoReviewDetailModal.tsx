"use client";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import P from "@/components/P/P";
import ModalBase from "@/modals/ModalBase";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import styles from "./photoReviewDetailModal.module.css";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import InputTextArea from "@/components/inputs/InputTextArea";
import { requester } from "@/shared/Requester";
import { useCallback, useState, useRef, useEffect } from "react";
import InputImage, { InputImageHandle } from "@/components/inputs/InputImage";
import { toast } from "@/shared/utils/Functions";
import useNavigate from "@/shared/hooks/useNavigate";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import StarRate from "@/components/star/StarRate";

import { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const PhotoReviewDetailModal = NiceModal.create(
  ({
    images,
    onConfirm,
    onCancel,
    width = "80vw",
    height = "80dvh",
  }: {
    images: [];
    onConfirm?: () => void;
    onCancel?: () => void;
    width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
  }) => {
    const modal = useModal();
    const navigate = useNavigate();
    const { isMobile } = useBrowserEvent();
    const swiperRef = useRef<SwiperType | null>(null);

    const paintBullets = (swiper: SwiperType) => {
      // 페이지네이션 스타일 설정
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

    return (
      <ModalBase
        withHeader
        headerStyle={{
          backgroundColor: !isMobile ? "#221f22" : "rgba(0,0,0,0.5)",
          borderBottom: "none",
          color: "#fff",
        }}
        borderRadius={!isMobile ? 10 : 0}
        closeBtnWhite
        width={!isMobile ? "100%" : "100%"}
        maxWidth={!isMobile ? 700 : "auto"}
        height={!isMobile ? height : "100dvh"}
        maxHeight={"auto"}
        // height={height}
        title={!isMobile ? "" : ""}
        onClose={() => {
          onCancel?.();
          modal.remove();
        }}
        // withCloseButton
        backgroundColor={!isMobile ? "#221f22" : "rgba(0,0,0,0.5)"}
        clickOutsideToClose={true}
      >
        <VerticalFlex 
          className={clsx(
            styles.container,
            isMobile && styles.mob_container
          )}
        >
          <HorizontalFlex className={styles.itemBox}>
            <FlexChild className={styles.product_info}>
              <Image
                src={"/resources/images/dummy_img/review_img_01.png"}
                width={120}
                height={"auto"}
              />

              <VerticalFlex className={styles.txt_box}>
                <Span className={styles.brand}>매직아이즈</Span>

                <P
                  lineClamp={2}
                  display="--webkit-box"
                  overflow="hidden"
                  className={styles.title}
                >
                  레드스타일 마패시리즈 프리미엄 컬러 로컬라이징 존슨즈 존슨
                  베이비 로션
                </P>

                <FlexChild>
                  <Span
                    className={styles.price}
                    lineClamp={1}
                    display="--webkit-box"
                    overflow="hidden"
                  >
                    25,000
                  </Span>
                  <P
                    className={styles.discount_price}
                    lineClamp={1}
                    display="--webkit-box"
                    overflow="hidden"
                  >
                    20,000원
                  </P>
                </FlexChild>

                <FlexChild>
                  <StarRate width={80} />
                  <P className={styles.rating}>
                    리뷰 <Span>45</Span>
                  </P>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>

            <VerticalFlex className={styles.feedBack}>
              <FlexChild className={styles.item}>
                <P className={styles.label}>외형/디자인</P>
                <P className={styles.cnt}>마음에 쏙 들어요</P>
              </FlexChild>

              <FlexChild className={styles.item}>
                <P className={styles.label}>유지관리</P>
                <P className={styles.cnt}>쉽게 관리 가능해요</P>
              </FlexChild>

              <FlexChild className={styles.item}>
                <P className={styles.label}>마감/내구성</P>
                <P className={styles.cnt}>관리하기 어려울 것 같아요.</P>
              </FlexChild>
            </VerticalFlex>
          </HorizontalFlex>

          <FlexChild
            className={clsx(styles.viewer_swiper,)}
            id="view_swiper"
          >
            <Swiper
              loop={true}
              slidesPerView={1}
              speed={600}
              spaceBetween={0}
              modules={[Pagination, Autoplay, Navigation]}
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              navigation={{
                prevEl: `#view_swiper .${styles.prevBtn}`,
                nextEl: `#view_swiper .${styles.nextBtn}`,
              }}
              autoplay={false}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              onAfterInit={(swiper) => {
                // Pagination DOM이 생성된 뒤
                paintBullets(swiper);
              }}
              onSlideChange={(swiper) => {
                // active bullet이 바뀔 때마다
                paintBullets(swiper);
              }}
              onPaginationUpdate={(swiper) => {
                // dynamicBullets로 bullet 구성이 바뀌는 경우
                paintBullets(swiper);
              }}
            >
              {images?.map((thumbnail: string, i: number) => (
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
            <div className={clsx(styles.naviBtn, styles.prevBtn)}>
              <Image
                src={"/resources/icons/arrow/slide_arrow.png"}
                width={10}
              />
            </div>
            <div className={clsx(styles.naviBtn, styles.nextBtn)}>
              <Image
                src={"/resources/icons/arrow/slide_arrow.png"}
                width={10}
              />
            </div>
          </FlexChild>

          <VerticalFlex className={styles.user_data}>
            <FlexChild className={styles.user_data}>
              <StarRate width={130} />
              
              <P className={styles.name}>supe***</P>
              <P className={styles.date}>2025-08-07</P>
            </FlexChild>

            <FlexChild className={styles.content}>
              <P>
                생각하던 것보다 두꺼워서 신기했습니다. 디자인도 깔끔하게 잘 만들었습니다. 자주 사용하게 될 제품
                같네요 ㅎㅎ
              </P>
            </FlexChild>

            <VerticalFlex className={styles.recommend}>
              <P>이 리뷰가 도움이 되었나요?</P>
  
              <Button className={styles.recommend_btn}>
                <Image
                  src={"/resources/icons/board/review_like.png"}
                  width={20}
                  height={'auto'}
                />
                <P>도움이 됐어요</P>
              </Button>
            </VerticalFlex>
          </VerticalFlex>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default PhotoReviewDetailModal;
