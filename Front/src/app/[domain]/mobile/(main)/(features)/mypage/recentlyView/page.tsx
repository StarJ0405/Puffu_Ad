import VerticalFlex from "@/components/flex/VerticalFlex";
import mypage from '../mypage.module.css';

import clsx from "clsx";
import styles from './page.module.css';
// import boardStyle from "../../boardGrobal.module.css"

import { RecentlyViewTable } from "./client";

export default async function () {

   return (
      <>
         <VerticalFlex className={clsx(mypage.box_frame, styles.delivery_box, 'mob_page_container')} gap={35}>

            <RecentlyViewTable />
         </VerticalFlex>
      </>
   )


}