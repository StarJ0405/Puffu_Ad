"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Link from "next/link";
import { Auth, HeaderBottom, SearchBox } from "./client";
import styles from "./header.module.css";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import CountBadge from "@/components/countBadge/countBadge";

export default function Header() {

  const headerRef = useRef<HTMLDivElement | null>(null);
  const [fixed, setFixed] = useState(false);
  const [CaOpen, SetCaOpen] = useState(false);

  useEffect(() => {
    const headerScroll = () => {
      setFixed(window.scrollY > 0);
    };

    window.addEventListener("scroll", headerScroll);
    return () => window.removeEventListener("scroll", headerScroll);
  }, [headerRef]);

  return (
    <>
      {/* className={styles.header} className={clsx(`${fixed ? styles.scroll : ""}`, styles.header)} */}
      <header ref={headerRef} className={clsx(`${fixed ? styles.scroll : ""}`, styles.header)}>
        <HorizontalFlex
          className={clsx('page_container', styles.header_wrap)}
        >
          <FlexChild gap={20}>
            <FlexChild className={styles.logo}>
              <Link href="/">
                <Image
                  src="/resources/images/header/logo.png"
                />
              </Link>
            </FlexChild>
            <SearchBox /> {/* 검색창 */}
          </FlexChild>

          <FlexChild width={"auto"} className={styles.info_box}>
            <VerticalFlex className={styles.info_wrap}>
              <Auth />

              <HorizontalFlex width={"auto"} gap={10}>
                <FlexChild>
                  <Link href={"/mypage"}>
                    <Image
                      src="/resources/icons/main/user_icon.png"
                      width={28}
                      height={"auto"}
                      cursor="pointer"
                    />
                  </Link>
                </FlexChild>

                <FlexChild>
                  <Link href={"/orders/cart"} className={styles.cart_btn}>
                    <Image
                      src="/resources/icons/main/cart_icon.png"
                      width={30}
                      height={"auto"}
                      cursor="pointer"
                    />
                    <CountBadge bottom="-3px" right="-5px" />
                  </Link>
                </FlexChild>

                <FlexChild>
                  <Link href={"/mypage/wishList"}>
                    <Image
                      src="/resources/icons/main/product_heart_icon.png"
                      width={30}
                      height={"auto"}
                      cursor="pointer"
                    />
                  </Link>
                </FlexChild>
              </HorizontalFlex>
            </VerticalFlex>
          </FlexChild>
        </HorizontalFlex>

        <HeaderBottom />
      </header>
    </>
  );
}
