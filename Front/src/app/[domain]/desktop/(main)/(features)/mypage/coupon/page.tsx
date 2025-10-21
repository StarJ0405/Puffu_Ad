import { CouponList } from "./client";
import mypage from "../mypage.module.css";
import { requester } from "@/shared/Requester";

export default async function Page() {
  const initCoupons = await requester.getCoupons({
    pageSize: 12,
    relations: [ "categories","categories.parent" ,"categories.parent.parent"],
  });
  return (
    <>
      <CouponList initCoupons={initCoupons} />
    </>
  );
}
