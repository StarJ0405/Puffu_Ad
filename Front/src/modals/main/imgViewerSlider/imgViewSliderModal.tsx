"use client";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import P from "@/components/P/P";
import ModalBase from "@/modals/ModalBase";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import styles from "./imgViewSliderModal.module.css";
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

import { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ImgViewSliderModal = NiceModal.create(({
   images,
   onConfirm,
   onCancel,
   width = "80vw",
   height = "70dvh",
}: {
   images: [];
   onConfirm?: () => void;
   onCancel?: () => void;
   width?: React.CSSProperties["width"];
   height?: React.CSSProperties["height"];
})=> {
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
            backgroundColor: !isMobile ? '#221f22' : 'rgba(0,0,0,0.5)',
            borderBottom: 'none',
            color: '#fff',
         }}
         borderRadius={!isMobile ? 10 : 0}
         closeBtnWhite
         width={!isMobile ? '100%' : '100%'}
         maxWidth={!isMobile ? 700 : 'auto'}
         height={!isMobile ? height : '100dvh'}
         maxHeight={'80dvh'}
         // height={height}
         title={!isMobile ? '첨부 이미지' : ''}
         onClose={() => {
            onCancel?.();
            modal.remove();
         }}
         // withCloseButton
         backgroundColor={!isMobile ? '#221f22' : 'rgba(0,0,0,0.5)'}
         clickOutsideToClose={true}
      >
         <FlexChild className={clsx(styles.viewer_swiper, isMobile && styles.mob_viewer_swiper)} id="view_swiper">
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
                     <FlexChild height={'100%'} justifyContent="center" alignItems="center">
                        <Image
                           src={thumbnail}
                           maxWidth={'100%'}
                           maxHeight={'100%'}
                           height={'100%'}
                        />
                     </FlexChild>
                  </SwiperSlide>
               ))}
            </Swiper>
            {
               images.length > 1 && (
                  <>
                     <div className={clsx(styles.naviBtn, styles.prevBtn)}>
                        <Image src={"/resources/icons/arrow/slide_arrow.png"} width={10}/>
                     </div>
                     <div className={clsx(styles.naviBtn, styles.nextBtn)}>
                        <Image src={"/resources/icons/arrow/slide_arrow.png"} width={10} />
                     </div>
                  </>
               )
            }
         </FlexChild>
      </ModalBase>
   ) 
})

export default ImgViewSliderModal;