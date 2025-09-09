"use client";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import styles from "./mypage.module.css";

export function MypageNavi() {

   const myshopMenu = [
      { name: "내 주문 내역", link: "/" },
      { name: "최근 본 상품", link: "/" },
      { name: "관심리스트", link: "/mypage/wishlist" },
   ];

   const myInfoMenu = [
      { name: "배송지 관리", link: "/" },
      { name: "1:1 문의내역", link: "/" },
      { name: "리뷰 관리", link: "/mypage/review" },
      { name: "회원탈퇴", link: "/" },
   ];

  return (
    <VerticalFlex className={clsx(styles.mypage_navi, styles.box_frame)}>
      <VerticalFlex className={styles.outer_menu}>
        <P>쇼핑정보</P>

        <ul className={styles.inner_menu}>
          {myshopMenu.map((item, i) => (
            <li key={i}>
              <Link className={styles.inner_btn} href={item.link}>
                <Span>{item.name}</Span>
                <Image
                  src={"/resources/icons/arrow/slide_arrow.png"}
                  width={8}
                />
              </Link>
            </li>
          ))}
        </ul>
      </VerticalFlex>

      <VerticalFlex className={styles.outer_menu}>
        <P>내 정보 관리</P>

        <ul className={styles.inner_menu}>
          <li>
            <Link className={styles.inner_btn} href={"/"}>
              <Span>개인정보 수정</Span>
              <Image
                src={"/resources/icons/arrow/slide_arrow.png"}
                width={8}
              />
            </Link>
          </li>
          {myInfoMenu.map((item, i) => (
            <li key={i}>
              <Link className={styles.inner_btn} href={item.link}>
                <Span>{item.name}</Span>
                <Image
                  src={"/resources/icons/arrow/slide_arrow.png"}
                  width={8}
                />
              </Link>
            </li>
          ))}
          <li>
            <Link className={styles.inner_btn} href={"/"}>
              <Span>로그아웃</Span>
              <Image
                src={"/resources/icons/arrow/slide_arrow.png"}
                width={8}
              />
            </Link>
          </li>
        </ul>
      </VerticalFlex>
    </VerticalFlex>
  );
}
