"use client"
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
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import style from "./page.module.css";

import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

export function MainBanner() {

   const components = [
      {img: '/resources/images/desktop/main_banner_01.png'},
      {img: '/resources/images/desktop/main_banner_01.png'},
      {img: '/resources/images/desktop/main_banner_01.png'},
   ]

   return (
      <FlexChild className={clsx('desktop_container', style.banner)}>
         <Swiper
            slidesPerView={1}
            speed={300}
            spaceBetween={0}
         >
            {
               components.map((item, i) => {
               return (
                  <SwiperSlide key={i} className={`swiper_0${i}`}>
                     <div className={style.slideItem} style={{backgroundImage: `url(${item.img})`}}></div>
                  </SwiperSlide>
               )
               })
            }
         </Swiper>
      </FlexChild>
   )
}
