import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import { Params } from "next/dist/server/request/params";
import mypage from "./mypage.module.css";
import {Profile, MypageNavi, DeliveryInfo} from "./client"


// import {RecentlyViewTable} from '../recentlyView/client'

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  console.log(id);

  return (
    <>
      {/* 오른쪽 내용 */}
      <VerticalFlex className={mypage.mypage_wrap}>

        {/* 프로필 */}
        <Profile />

        {/* 배송정보 */}
        <DeliveryInfo />

        {/* 하단 메뉴 */}
        <MypageNavi />      
      </VerticalFlex>
    </>
  );
}
