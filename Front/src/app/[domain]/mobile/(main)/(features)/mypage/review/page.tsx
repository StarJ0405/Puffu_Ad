import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import mypage from "../mypage.module.css";
import { ReviewList } from "./client";
import styles from "./page.module.css";

export default async function () {
  return (
    <>
      <VerticalFlex
        className={clsx(mypage.box_frame, styles.delivery_box, 'mob_page_container')}
        gap={35}
      >
        <ReviewList />
      </VerticalFlex>
    </>
  );
}
