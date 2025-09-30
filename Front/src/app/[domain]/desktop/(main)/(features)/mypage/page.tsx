import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { Params } from "next/dist/server/request/params";
import styles from "./mypage.module.css";

import {DeliveryInfo} from "./client"
import {Profile} from "./client"

// 불러온 내용
import { MyOrdersTable } from "./myOrders/client";
import { RecentlyViewTable } from "./recentlyView/client";
import { ReviewList } from "./review/client";


// import {RecentlyViewTable} from '../recentlyView/client'

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  

  return (
    <>
      {/* 오른쪽 내용 */}
      <VerticalFlex className={styles.right_bar}>

        {/* 프로필 및 멤버쉽 */}
        <Profile />

        {/* 배송정보 */}
        <DeliveryInfo />

        {/* <VerticalFlex className={clsx(styles.box_frame, styles.delivery_box)}>
          <FlexChild className={styles.box_header}>
            <P>내 주문 내역</P>
          </FlexChild>

          <MyOrdersTable />
        </VerticalFlex> */}

        {/* <VerticalFlex className={clsx(styles.box_frame, styles.delivery_box)}>
          <FlexChild className={styles.box_header}>
            <P>리뷰 관리</P>
          </FlexChild>

          <ReviewList listCount={3} />
        </VerticalFlex> */}


        <VerticalFlex className={clsx(styles.box_frame, styles.delivery_box)}>
          <RecentlyViewTable />
        </VerticalFlex>
      </VerticalFlex>
    </>
  );
}
