import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import clsx from "clsx";
import mypage from "../mypage.module.css";
import styles from "./page.module.css";
import { Params } from "next/dist/server/request/params";
import { ReviewList } from "./client";
import { requester } from "@/shared/Requester";

export default async function () {
  return (
    <>
      <VerticalFlex
        className={clsx(mypage.box_frame, styles.delivery_box)}
        gap={35}
      >
        <ReviewList />
      </VerticalFlex>
    </>
  );
}
