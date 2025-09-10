import React from "react";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import clsx from "clsx";
import { MypageNavi, Profile } from "./client";
import mypage from "./mypage.module.css";
import Link from "next/link";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="root desktop_container">
      {/*  */}
      <VerticalFlex className={mypage.mypage_wrap}>
        <FlexChild className={mypage.title}>
          <Link href={'/mypage'}><h3>마이페이지</h3></Link>
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
  );
}
