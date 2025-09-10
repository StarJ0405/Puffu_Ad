import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import mypage from '../mypage.module.css';

import clsx from "clsx";
import styles from './page.module.css';
// import boardStyle from "../../boardGrobal.module.css"

import { WishListTable } from "./client";

export default async function () {

   return (
      <>
         <VerticalFlex className={clsx(mypage.box_frame, styles.delivery_box)} gap={35}>
            <FlexChild className={mypage.box_header}>
               <P>관심 리스트</P>
               <FlexChild className={mypage.header_subTitle}>
                  <P>전체 상품 56</P>
               </FlexChild>
            </FlexChild>

            <WishListTable />
         </VerticalFlex>
      </>
   )


}