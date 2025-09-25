import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import mypage from "../mypage.module.css";
import { MyOrdersTable } from "./client";
import styles from "./page.module.css";

export default async function () {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date();
  const initOrders = await requester.getOrders({
    relations: [
      "items.brand",
      "items.review",
      "shipping_method",
      "store",
      "address",
    ],
    start_date: startDate,
    end_date: endDate,
  });

  return (
    <>
      <VerticalFlex
        className={clsx(mypage.box_frame, styles.myOrder_box)}
        gap={35}
      >
        <FlexChild className={mypage.box_header}>
          <P>내 주문 내역</P>
        </FlexChild>
        <MyOrdersTable
          initStartDate={startDate}
          initEndDate={endDate}
          initOrders={initOrders}
        />
      </VerticalFlex>
    </>
  );
}
