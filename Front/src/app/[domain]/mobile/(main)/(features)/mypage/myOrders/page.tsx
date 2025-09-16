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
            <MyOrdersTable />
         </VerticalFlex>
      </>
   )


}