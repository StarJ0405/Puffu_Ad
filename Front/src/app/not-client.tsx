"use client";
import useNavigate from "@/shared/hooks/useNavigate";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import styles from './not-found.module.css'
import clsx from "clsx";

export function NaviBtn() {
   const navigate = useNavigate();

   return (
      <FlexChild width={'auto'} gap={10} className={styles.naviBtn}>
         <FlexChild className={clsx(styles.Back_btn, styles.btn)} onClick={() => navigate(-1)}>
            <P>이전 페이지</P>
         </FlexChild>

         <FlexChild className={clsx(styles.home_btn, styles.btn)} onClick={() => navigate('/')}>
            <P>홈으로</P>
         </FlexChild>
      </FlexChild>
   )
}