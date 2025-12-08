'use client'

import { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import styles from './LineBanner.module.css'
import clsx from "clsx";
import Span from "@/components/span/Span";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import { useEffect, useRef } from "react";

export default function LineBanner({setLBHeight}: {setLBHeight: (height: number) => void;}) {
   
   const bannerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bannerRef.current) {
      const height = bannerRef.current.offsetHeight;
      setLBHeight(height);
    }
  }, []);

   const { isMobile } = useBrowserEvent();
   const mobileClass = isMobile ? 'mob_page_container' : '';
   const content = [
      '푸푸토이는 배송도 시크릿하게~!',
      '오후 2시 이전 주문 시 당일발송!',
      '푸푸토이는 배송도 시크릿하게~!',
      '오후 2시 이전 주문 시 당일발송!',
   ]

   return (
      <div ref={bannerRef} className={clsx(styles.lineBanner, (isMobile ? styles.mob_lineBanner : ''))}>
         <Swiper
            className={clsx(styles.slideFrams, mobileClass)}
            loop={true}
            slidesPerView={!isMobile ? 2.5 : 1.5}
            speed={15000}
            allowTouchMove={false}
            spaceBetween={!isMobile ? 310 : 50}
            modules={[Autoplay]}
            autoplay={{
               delay: 1,
               disableOnInteraction: false,
            }}
         >
           {content.map((item, i) => {
               return (
                  <SwiperSlide key={i} className={clsx(styles.slideItem, `swiper_0${i}`)}>
                     <Span>{item}</Span>
                  </SwiperSlide>
               )}
           )}
         </Swiper>
      </div>
   )
}