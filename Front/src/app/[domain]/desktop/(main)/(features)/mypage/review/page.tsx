import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import clsx from "clsx";
import mypage from "../mypage.module.css";
import styles from "./page.module.css";

import { ReviewList } from "./client";

export default async function () {

  return (
    <>
      <VerticalFlex className={clsx(mypage.box_frame, styles.delivery_box)} gap={35}>
        <FlexChild className={mypage.box_header}>
          <P>리뷰 관리</P>
          <FlexChild className={mypage.header_subTitle}>
            <P>전체 리뷰 56</P>
          </FlexChild>
        </FlexChild>

        <ReviewList />
      </VerticalFlex>
    </>
  );
}
