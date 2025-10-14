'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import Link from "next/link";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import styles from './subBanner.module.css'


type Banner = {
   link: string;
   img: string;
}


export default function SubBanner(
{
   banners,
   width,
   height = 'auto',
}: {
   banners: Banner[];
   width: number | string;
   height?: number | string;
}) {

   const { userData } = useAuth();

   return (
      <div className={styles.banner_wrapper}>
         <FlexChild width={"100%"}>
            <Link href={"/"} className={styles.disabled}>
            {userData?.adult ? (
               <Image
                  src={"/resources/images/dummy_img/sub_banner_01.jpg"}
                  width={"100%"}
                  height={"auto"}
               />
            ) : (
               // 성인인증 안될때 나오는 이미지
               <Image
                  src={"/resources/images/19_only_sub_banner_pc.png"}
                  width={"100%"}
                  height={"auto"}
               />
            )}
            </Link>
         </FlexChild>
      </div>
   )
}