import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";

// import { ContentBox } from "./client";
import { requester } from "@/shared/Requester";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import Image from "@/components/Image/Image";
import Span from "@/components/span/Span";
import { HistoryList } from "./client"

export default async function () {
  const initCoupons = await requester.getCoupons({
    pageSize: 12,
  });
  return (
    <>
      <VerticalFlex className={clsx(styles.wrapper, 'mob_page_container')}>

        <HistoryList initCoupons={initCoupons} />

      </VerticalFlex>
    </>
  );
}
