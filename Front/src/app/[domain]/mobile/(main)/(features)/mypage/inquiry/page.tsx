import VerticalFlex from "@/components/flex/VerticalFlex";
import mypage from '../mypage.module.css';

import clsx from "clsx";
import styles from './page.module.css';
// import boardStyle from "../../boardGrobal.module.css"

import { InquiryClient } from "./client";
// import { useState } from "react";

export default async function () {

   // const [pickTab, setPickTab] = useState(false);

   return (
      <>
         <VerticalFlex className={clsx(mypage.box_frame, styles.inquiry_box, 'mob_page_container')} gap={35}>
            <InquiryClient />
         </VerticalFlex>
      </>
   )


}