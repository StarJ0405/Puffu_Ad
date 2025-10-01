import { CouponList } from "./client";
import mypage from "../mypage.module.css";
import { requester } from "@/shared/Requester";

export default async function Page() {
  const initCoupons = await requester.getCoupons({
    pageSize: 12,
  });
  return (
    <>
      <CouponList initCoupons={initCoupons} />
    </>
  );
}
