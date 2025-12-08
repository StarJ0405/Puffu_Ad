'use client'

import { Swiper as SwiperType } from "swiper";
import { Autoplay, FreeMode } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import './LineBanner.css'
import clsx from "clsx";
import Span from "@/components/span/Span";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";

export default function LineBanner() {

   const { isMobile } = useBrowserEvent();

   const content = [
      '푸푸토이는 배송도 시크릿하게~!',
      '오후 2시 이전 주문 시 당일발송!',
      '푸푸토이는 배송도 시크릿하게~!',
      '오후 2시 이전 주문 시 당일발송!',
   ]

   return (
      <Swiper
         className={clsx('lineBanner', (isMobile ? 'mob_lineBanner' : ''), 'mob_page_container')}
        loop={true}
        slidesPerView={1.5}
        speed={6000}
        allowTouchMove={false}
        spaceBetween={!isMobile ? 310 : 50}
        modules={[Autoplay]}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
        }}
      //   freeMode={true}
      >
        {content.map((item, i) => {
            return (
               <SwiperSlide key={i} className={clsx('slideItem', `swiper_0${i}`)}>
                  <Span>{item}</Span>
               </SwiperSlide>
            )}
        )}
      </Swiper>
   )
}