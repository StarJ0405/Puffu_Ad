import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";


import { requester } from "@/shared/Requester";

export default async function () {
  const initCoupons = await requester.getCoupons({
    pageSize: 12,
  });
  return (
    <>
      <VerticalFlex
        className={clsx(styles.box_frame, styles.coupon_box)}
        gap={35}
      >
        
      </VerticalFlex>
    </>
  );
}
