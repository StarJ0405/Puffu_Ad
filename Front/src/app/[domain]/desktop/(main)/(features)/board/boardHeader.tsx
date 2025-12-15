import siteInfo from "@/shared/siteInfo";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import clsx from "clsx";
import Link from "next/link";
import styles from "./boardHeader.module.css";
import {BoardNavi} from "./client";
// import { usePathname } from "next/navigation";

export default function BoardHeader() {

   // const pathname = usePathname();

   // header를 보여줄 path들
   // const showHeaderPaths = ["/board/notice", "/board/event", "/board/faq", "/board/inquiry"];

   // 현재 경로가 위 목록에 포함되면 true
   // const showHeader = showHeaderPaths.includes(pathname);

   return (
      <>
         <VerticalFlex className={styles.board_header}>
            <VerticalFlex className={styles.customer_info}>
               <FlexChild>
                  <h3>CS CENTER</h3>
               </FlexChild>
      
               <FlexChild className={styles.call_number}>
                  <P>{siteInfo.cs_number}</P>
               </FlexChild>
      
               <VerticalFlex className={styles.business_time} gap={10}>
                  <P>평일 : {siteInfo.cs_workTime}</P>
                  <P>점심시간 : {siteInfo.cs_breakTime}</P>
               </VerticalFlex>
            </VerticalFlex>
            <BoardNavi />
         </VerticalFlex>
      </>
   )
}
