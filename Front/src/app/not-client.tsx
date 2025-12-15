"use client";
import useNavigate from "@/shared/hooks/useNavigate";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import styles from './not-found.module.css'
import clsx from "clsx";
import { useRouter } from "next/navigation";

export function NaviBtn() {
   const router = useRouter();

   return (
      <FlexChild width={'auto'} gap={10} className={styles.naviBtn}>
         <FlexChild className={clsx(styles.Back_btn, styles.btn)} onClick={() => router.back()}>
            <P>이전 페이지</P>
         </FlexChild>

         <FlexChild className={clsx(styles.home_btn, styles.btn)} onClick={() => router.push('/')}>
            <P>메인으로</P>
         </FlexChild>
      </FlexChild>
   )
}