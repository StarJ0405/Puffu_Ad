import VerticalFlex from "@/components/flex/VerticalFlex";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import { Params } from "next/dist/server/request/params";
import { DeliveryInfo, MypageNavi, Profile } from "./client";
import mypage from "./mypage.module.css";

// import {RecentlyViewTable} from '../recentlyView/client'

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const initGroups = await requester.getGroups();

  return (
    <>
      {/* 오른쪽 내용 */}
      <VerticalFlex className={clsx(mypage.mypage_wrap, 'mob_page_container')}>
        {/* 프로필 */}
        <Profile initGroups={initGroups} />

        {/* 배송정보 */}
        <DeliveryInfo />

        {/* 하단 메뉴 */}
        <MypageNavi />
      </VerticalFlex>
    </>
  );
}
