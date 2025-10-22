import VerticalFlex from "@/components/flex/VerticalFlex";
import mypage from "../mypage.module.css";
import clsx from "clsx";
import styles from "./page.module.css";

import { CouponList } from "./client";
import { requester } from "@/shared/Requester";

export default async function () {
  const initCoupons = await requester.getCoupons({
    pageSize: 12,
  });
  return (
    <>
      <VerticalFlex
        className={clsx(mypage.box_frame, styles.coupon_box, 'mob_page_container')}
        gap={35}
      >
        <CouponList initCoupons={initCoupons} />
      </VerticalFlex>
    </>
  );
}
