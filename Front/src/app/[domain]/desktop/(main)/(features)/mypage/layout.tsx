import React from "react";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import clsx from "clsx";
import { MypageNavi } from "./client";
import styles from "./mypage.module.css";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="root desktop_container">
      {/*  */}
      <HorizontalFlex className={styles.mypage_wrap} gap={30}>
        {/* 왼쪽 메뉴 */}
        <VerticalFlex gap={20} className={styles.left_bar}>
          <VerticalFlex className={clsx(styles.profile, styles.box_frame)}>
            <VerticalFlex gap={20}>
              <FlexChild width={"auto"} position="relative">
                <FlexChild className={styles.thumbnail} width={"auto"}>
                  <Image
                    src={"/resources/images/dummy_img/product_01.png"}
                    width={80}
                  />
                </FlexChild>

                <FlexChild className={styles.setting_btn}>
                  <Image
                    src={"/resources/icons/mypage/setting_icon.png"}
                    width={16}
                  />
                </FlexChild>
              </FlexChild>

              <FlexChild width={"auto"} className={styles.profile_name}>
                <P>콘푸로스트123</P>
              </FlexChild>
            </VerticalFlex>

            <FlexChild className={styles.link_btn}>
              <Button>관심 리스트</Button>
            </FlexChild>
          </VerticalFlex>

          <MypageNavi />
        </VerticalFlex>

        {/* 메인 */}
        {children}
      </HorizontalFlex>
      {/*  */}
    </section>
  );
}
