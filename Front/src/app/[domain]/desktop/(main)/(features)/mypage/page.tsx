import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { Params } from "next/dist/server/request/params";
import styles from "./mypage.module.css";


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
        <VerticalFlex className={clsx(styles.box_frame, styles.delivery_box)}>
          <FlexChild className={styles.box_header}>
            <P>주문 배송 현황</P>
          </FlexChild>

          <FlexChild className={styles.deli_itemBox}>
            <VerticalFlex className={styles.deli_item}>
              <P>15</P>
              <Span>상품 준비중</Span>
            </VerticalFlex>

            <VerticalFlex className={styles.deli_item}>
              <P>21</P>
              <Span>배송준비</Span>
            </VerticalFlex>

            <VerticalFlex className={styles.deli_item}>
              <P>4</P>
              <Span>배송중</Span>
            </VerticalFlex>

            <VerticalFlex className={styles.deli_item}>
              <P>36</P>
              <Span>배송완료</Span>
            </VerticalFlex>
          </FlexChild>

          <FlexChild className={styles.link_btn}>
            <Button>내 주문 확인</Button>
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={clsx(styles.box_frame, styles.delivery_box)}>
          <FlexChild className={styles.box_header}>
            <P>내 주문 내역</P>
          </FlexChild>

          <MyOrdersTable />
        </VerticalFlex>


        <VerticalFlex className={clsx(styles.box_frame, styles.delivery_box)}>
          <FlexChild className={styles.box_header}>
            <P>리뷰 관리</P>
          </FlexChild>

          <ReviewList listCount={3} />
        </VerticalFlex>


        <VerticalFlex className={clsx(styles.box_frame, styles.delivery_box)}>
          <FlexChild className={styles.box_header}>
            <P>최근 본 상품</P>
          </FlexChild>

          <RecentlyViewTable />
        </VerticalFlex>
      </VerticalFlex>
    </>
  );
}
