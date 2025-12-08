'use client'

import siteInfo from "@/shared/siteInfo";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import styles from "./EventCard.module.css";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import Div from "@/components/div/Div";

export function EventCard({
   item,
   onClick,
   dateToString,
   workType,
}: {
   item : NoticeData;
   dateToString?: ()=> void;
   onClick?: ()=> void;
   workType?: string;
}) {

   const isMobile = useBrowserEvent();
   const LoadThumbnail = item.thumbnail ? item.thumbnail : "resources/images/no-img.png";
   const mobileCheck = isMobile ? styles.mob_frame : '';
   const typeCheck = workType === 'slide' ? styles.slide : '';
   const navigate = useNavigate();


   // const thumbRef = useRef<HTMLDivElement>(null!);

   // useEffect(() => {
   //    if (!item?.thumbnail) return;
   //    if (typeof window === "undefined") return;

   //    const img = new window.Image();
   //    img.src = item.thumbnail;
   //    const fallback = '/resources/images/19_only.png';

   //    img.onload = () => {
   //       if (thumbRef.current) {
   //          thumbRef.current.style.backgroundImage = `url(${item.thumbnail})`;
   //       }
   //    };

   //    img.onerror = () => {
   //       if (thumbRef.current) {
   //          thumbRef.current.style.backgroundImage = `url(${fallback})`;
   //       }
   //    };

   // }, [item.thumbnail]);

   return (
      <VerticalFlex className={clsx(styles.frame, mobileCheck, typeCheck)} onClick={() => navigate(`${siteInfo.bo_event}/${item.id}`)}>
         <div 
            // ref={thumbRef}
            className={styles.thumbnail}
            style={{backgroundImage: `url(${LoadThumbnail})`}}
         >
         </div>

         <FlexChild className={styles.content_box} justifyContent="center">
            <P 
               className={styles.title}
               lineClamp={!isMobile ? 2 : 1}
               display={"webkit-box"}
               overflow={"hidden"}
               textOverflow={"ellipsis"}
            >
               {item.title}
            </P>
         </FlexChild>
      </VerticalFlex>
   )
}