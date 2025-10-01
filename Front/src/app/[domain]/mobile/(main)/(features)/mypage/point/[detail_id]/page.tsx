import VerticalFlex from "@/components/flex/VerticalFlex";
import mypage from '../../mypage.module.css';
import clsx from "clsx";
import styles from './page.module.css';
import { PointDetail } from "./client";

export default async function () {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date();
  return (
    <VerticalFlex className={clsx(mypage.box_frame, styles.delivery_box)} gap={35}>
      <PointDetail />
    </VerticalFlex>
  );
}