import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import mypage from '../mypage.module.css';

import clsx from "clsx";
import styles from './page.module.css';
// import boardStyle from "../../boardGrobal.module.css"

import { MyOrdersTable } from "./client";
// import { useState } from "react";

export default async function () {

   // const [pickTab, setPickTab] = useState(false);

   return (
      <>
         <VerticalFlex className={clsx(mypage.box_frame, styles.myOrder_box)} gap={35}>
            <FlexChild className={mypage.box_header}>
               <P>내 주문 내역</P>
            </FlexChild>

            <VerticalFlex className={styles.search_box}>
               <VerticalFlex className={styles.search_input_box}>
                  <h5>상품 검색</h5>
                  <FlexChild className={styles.keyword}>
                     <Input className={clsx('web_input', styles.search)} width={'100%'} type="search" placeHolder="상품 키워드를 입력하세요" />
                     <Button backgroundColor="transparent">
                        <Image 
                           src='/resources/images/header/input_search_icon.png'
                           width={18}
                           height="auto"
                           cursor="pointer"
                        />
                     </Button>
                  </FlexChild>
               </VerticalFlex>

               <VerticalFlex className={styles.picker_input_box}>
                  <VerticalFlex className={styles.dataPicker_box}>
                     <FlexChild className={styles.btn_wrap}>
                        <Button className={clsx(styles.term_btn, styles.active)}>1주일</Button>
                        <Button className={clsx(styles.term_btn)}>1개월</Button>
                        <Button className={clsx(styles.term_btn)}>3개월</Button>
                        <Button className={clsx(styles.term_btn)}>6개월</Button>
                     </FlexChild>

                     <FlexChild className={styles.picker_wrap}>
                        <Input className={clsx('web_input', styles.picker_input)} width={'100%'} type="text" readOnly={true} value={'2025-09-03'} />
                        <Span size={18}>-</Span>
                        <Input className={clsx('web_input', styles.picker_input)} width={'100%'} type="text" readOnly={true} value={'2025-09-10'} />
                     </FlexChild>
                  </VerticalFlex>
               </VerticalFlex>
            </VerticalFlex>

            <MyOrdersTable />
         </VerticalFlex>
      </>
   )


}