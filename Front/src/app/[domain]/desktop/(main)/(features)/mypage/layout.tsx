import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Link from "next/link";
import React from "react";
import { MypageNavi, MainLInkTitle } from "./client";
import LayoutClient from "./layoutClient";
import mypage from "./mypage.module.css";
import clsx from "clsx";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutClient>
      <section className={clsx(mypage.mypage_container, 'root')}>
        {/*  */}
        <VerticalFlex className={clsx(mypage.mypage_wrap, 'page_container')}>
          <MainLInkTitle />

          <HorizontalFlex alignItems="start" gap={30}>
            {/* 왼쪽 메뉴 */}
            <MypageNavi />

            {/* 메인 */}
            {children}
          </HorizontalFlex>
        </VerticalFlex>
        {/*  */}
      </section>
    </LayoutClient>
  );
}
