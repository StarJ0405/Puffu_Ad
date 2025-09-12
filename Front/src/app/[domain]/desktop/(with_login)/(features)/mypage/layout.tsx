import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Link from "next/link";
import React from "react";
import { MypageNavi, Profile } from "./client";
import LayoutClient from "./layoutClient";
import mypage from "./mypage.module.css";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutClient>
      <section className="root page_container">
        {/*  */}
        <VerticalFlex className={mypage.mypage_wrap}>
          <FlexChild className={mypage.title}>
            <Link href={"/mypage"}>
              <h3>마이페이지</h3>
            </Link>
          </FlexChild>

          <HorizontalFlex alignItems="start" gap={30}>
            {/* 왼쪽 메뉴 */}
            <VerticalFlex gap={20} className={mypage.left_bar}>
              <Profile />

              <MypageNavi />
            </VerticalFlex>

            {/* 메인 */}
            {children}
          </HorizontalFlex>
        </VerticalFlex>
        {/*  */}
      </section>
    </LayoutClient>
  );
}
