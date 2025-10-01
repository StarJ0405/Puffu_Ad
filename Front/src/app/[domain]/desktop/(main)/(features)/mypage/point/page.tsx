import VerticalFlex from "@/components/flex/VerticalFlex";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import mypage from '../mypage.module.css';
import clsx from "clsx";
import styles from './page.module.css';
import { PointHistory } from "./client";

export default async function () {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date();
  return (
    <VerticalFlex className={clsx(mypage.box_frame)} gap={35}>
      <FlexChild className={mypage.box_header}>
          <P>포인트 내역</P>
        </FlexChild>
      <PointHistory
        initStartDate={startDate}
        initEndDate={endDate}
      />
    </VerticalFlex>
  );
}