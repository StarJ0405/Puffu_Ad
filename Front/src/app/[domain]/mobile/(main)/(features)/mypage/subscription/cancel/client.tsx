"use client";
import CouponItemMobile from "@/components/coupon/couponItemMobile";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { useMemo, useState, useRef, useEffect } from "react";
import mypage from "../mypage.module.css";
import styles from "./page.module.css";
import clsx from "clsx";
import Image from "@/components/Image/Image";
import Div from "@/components/div/Div";
import Button from "@/components/buttons/Button";
import useNavigate from "@/shared/hooks/useNavigate";


export function ContentBox({ }: {  }) {
  
  return (
    <VerticalFlex className={clsx(styles.box_layer)} gap={10}>

      <FlexChild className={styles.premium_layer}>
         <VerticalFlex className={styles.premium_box}>
            <VerticalFlex className={styles.item_content}>
               <VerticalFlex className={styles.cumulative}>
                  <FlexChild justifyContent="center" className={styles.txt}>
                     <P>지금까지 혜택 받은 금액</P>
         
                     <Image
                        src={"/resources/icons/mypage/subscription_heart.png"}
                        width={20} height={'auto'}
                     />
                  </FlexChild>
      
                  <P className={styles.total}>
                  300,000원
                  </P>
               </VerticalFlex>
      
               <VerticalFlex className={styles.unit} alignItems="start">
                  <FlexChild>
                     <Image
                        src={"/resources/icons/arrow/checkBox_check.png"}
                        width={13} height={'auto'}
                     />
                     <P>전제품 <Span>10% 상시 할인</Span></P>
                  </FlexChild>
      
                  <FlexChild>
                     <Image
                        src={"/resources/icons/arrow/checkBox_check.png"}
                        width={13} height={'auto'}
                     />
                     <P>매월 프리 머니 <Span>10,000원</Span> 쿠폰 지급</P>
                  </FlexChild>
               </VerticalFlex>
            </VerticalFlex>
         </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}


export function ConfirmBtn ({}:{}) {

   const navigate = useNavigate();

   return (
      <VerticalFlex className={styles.confirm_box}>
         <FlexChild onClick={()=> navigate('/mypage/subscription/manage')} className={styles.continue_btn}>
            <Button>
               회원권 계속 유지하기
            </Button>
         </FlexChild>

         {/* onClick={()=> ()} */}
         <FlexChild className={styles.delete_btn}>
            <Button>
               회원권 해지하기
            </Button>
         </FlexChild>
      </VerticalFlex>
   )
}



