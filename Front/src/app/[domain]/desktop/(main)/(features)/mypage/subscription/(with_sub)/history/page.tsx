import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";
import mypage from "../../../mypage.module.css";
import { HistoryList } from "./client";
import FlexChild from "@/components/flex/FlexChild";
import Div from "@/components/div/Div";
import P from "@/components/P/P";

export default async function () {
  return (
    <>
      <VerticalFlex className={clsx(mypage.box_frame)} gap={35}>
        <FlexChild className={clsx(mypage.box_header)}>
          <P>연간 구독 서비스</P>
        </FlexChild>

        <HistoryList/>

      </VerticalFlex>
    </>
  );
}
