
import VerticalFlex from "@/components/flex/VerticalFlex";
import mypage from "../mypage.module.css";
import clsx from "clsx";
import styles from "./page.module.css";

import { CouponList } from "./client";
import { requester } from "@/shared/Requester";

export default async function () {
  // const initWishList = await requester.getWishlists({
  //   relations: ["product"],
  //   pageSize: 10,
  // });
  return (
    <>
      <VerticalFlex
        className={clsx(mypage.box_frame, styles.coupon_box)}
        gap={35}
      >

        <CouponList />
      </VerticalFlex>
    </>
  );
}
