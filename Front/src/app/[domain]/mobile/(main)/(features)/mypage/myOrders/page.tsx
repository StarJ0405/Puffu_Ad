import VerticalFlex from "@/components/flex/VerticalFlex";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import mypage from "../mypage.module.css";
import { MyOrdersTable } from "./client";
import styles from "./page.module.css";

export default async function () {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date();
  const PAGE_SIZE = 5;
  const raw = await requester.getOrders({
    relations: [
      "refunds.items",
      "items.refunds.refund",
      "items.exchanges.exchange",
      "items.exchanges.swaps",
      "items.brand",
      "items.review",
      "shipping_method.coupons",
      "store",
      "address",
      "coupons",
      "items.coupons",
      "subscribe",
      "items",
      "items.variant",
    ],
    start_date: startDate,
    end_date: endDate,
    pageNumber: 0,
    pageSize: PAGE_SIZE,
    order: { created_at: "DESC" },
  });

  const initOrders = Array.isArray(raw)
    ? {
        content: raw,
        totalElements: raw.length,
        totalPages: 1,
        pageNumber: 0,
        pageSize: PAGE_SIZE,
      }
    : raw;
  return (
    <>
      <VerticalFlex
        className={clsx(mypage.box_frame, styles.myOrder_box, 'mob_page_container')}
        gap={35}
      >
        <MyOrdersTable
          initStartDate={startDate}
          initEndDate={endDate}
          initOrders={initOrders}
        />
      </VerticalFlex>
    </>
  );
}
