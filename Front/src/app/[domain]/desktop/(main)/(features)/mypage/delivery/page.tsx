import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import Container from "@/components/container/Container";
import Center from "@/components/center/Center";
import Input from "@/components/inputs/Input";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";
import mypage from '../mypage.module.css'

import clsx from "clsx";
import styles from './page.module.css'
// import boardStyle from "../../boardGrobal.module.css"

import {DeliveryTable } from "./client";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";
// import { useState } from "react";

export default async function () {

   // const [pickTab, setPickTab] = useState(false);

   return (
      <>
         <VerticalFlex className={clsx(mypage.box_frame, styles.delivery_box)} gap={35}>
            <FlexChild className={mypage.box_header}>
               <P>배송지 관리</P>
            </FlexChild>

            <HorizontalFlex className={styles.top_box}>
               <FlexChild className={styles.all_txt}>
                  <P>전체 배송지</P>
                  <Span>(1건)</Span>
               </FlexChild>

               <FlexChild className={styles.add_btn}>
                  <Button
                     // onClick={()=>{}}
                  >
                     배송지 추가
                  </Button>
               </FlexChild>
            </HorizontalFlex>

            <DeliveryTable />
         </VerticalFlex>
      </>
   )


}