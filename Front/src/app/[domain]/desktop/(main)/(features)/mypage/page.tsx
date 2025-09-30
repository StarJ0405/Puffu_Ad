import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import { Params } from "next/dist/server/request/params";
import styles from "./mypage.module.css";

import { DeliveryInfo, Profile } from "./client";

// 불러온 내용
import { requester } from "@/shared/Requester";
import { RecentlyViewTable } from "./recentlyView/client";

// import {RecentlyViewTable} from '../recentlyView/client'

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const initGroups = await requester.getGroups();

  return (
    <>
      {/* 오른쪽 내용 */}
      <VerticalFlex className={styles.right_bar}>
        {/* 프로필 및 멤버쉽 */}
        <Profile initGroups={initGroups} />

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
