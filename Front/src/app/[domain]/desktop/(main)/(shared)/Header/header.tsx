"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Image from "@/components/Image/Image";
import Link from "next/link";
import { Auth, HeaderMenu, SearchBox } from "./client";
import styles from "./header.module.css";
import { useRef, useState, useEffect,  } from "react";
import clsx from "clsx";
import CountBadge from "@/components/countBadge/countBadge";
import LineBanner from "@/components/main/lineBanner/LineBanner";
import siteInfo from "@/shared/siteInfo";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";


export default function Header() {

  const [CaOpen, SetCaOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerScroll, setHeaderScroll] = useState(false);
  const [LBHeight, setLBHeight] = useState(0);
  const { userData } = useAuth();
  const [loginLInkCheck, setLoginLInkCheck] = useState('/auth/login');

  useEffect(()=> {
    const value = !userData?.id ? '/auth/login' : siteInfo.my_profile;
    setLoginLInkCheck(value);
  }, [userData])

  // 스크롤 되면 클래스 들어옴
  const ScrollClass = headerScroll ? styles.scroll : '';

  useEffect(()=> {
    const headerScroll = () => {
        setHeaderScroll(window.scrollY > 0)
    };

    window.addEventListener('scroll', headerScroll);
    return ()=> window.removeEventListener('scroll', headerScroll);
  },[]);

  return (
    <>
      <header ref={headerRef} className={
          clsx(
            `${headerScroll ? styles.scroll : ""}`,
            styles.header
          )}
          style={{ top: headerScroll ? `-${LBHeight}px` : 0 }}
          >
        <LineBanner setLBHeight={setLBHeight} />
        <HorizontalFlex
          className={styles.header_wrap}
        >
          <FlexChild gap={20}>
            <FlexChild className={styles.logo}>
              <Link href="/">
                <Image
                  src="/resources/images/header/logo.png"
                />
              </Link>
            </FlexChild>
            <HeaderMenu />
          </FlexChild>

          <FlexChild width={"auto"} className={styles.info_box}>
            <HorizontalFlex width={"auto"} gap={15}>
              <SearchBox /> {/* 검색창 */}

              <FlexChild width={"fit-content"}>
                <Link href={"/board/notice"}>
                  <Image
                    src="/resources/icons/main/customer_center.png"
                    width={25}
                    height={"auto"}
                    cursor="pointer"
                  />
                </Link>
              </FlexChild>

              <Auth />

              <FlexChild width={"fit-content"}>
                <Link href={loginLInkCheck}>
                  <Image
                    src="/resources/icons/main/user_icon.png"
                    width={25}
                    height={"auto"}
                    cursor="pointer"
                  />
                </Link>
              </FlexChild>

              <FlexChild width={"fit-content"}>
                <Link href={siteInfo.my_wishList}>
                  <Image
                    src="/resources/icons/main/heart_icon.png"
                    width={25}
                    height={"auto"}
                    cursor="pointer"
                  />
                </Link>
              </FlexChild>

              <FlexChild width={"fit-content"}>
                <Link href={siteInfo.order_cart} className={styles.cart_btn}>
                  <Image
                    src="/resources/icons/main/cart_icon.png"
                    width={20}
                    height={"auto"}
                    cursor="pointer"
                  />
                  <CountBadge bottom="-3px" right="-10px" />
                </Link>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        </HorizontalFlex>

      </header>
      </>
  );
}
