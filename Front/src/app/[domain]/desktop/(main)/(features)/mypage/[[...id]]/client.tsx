"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import Link from "next/link";
import boardStyle from "../boardGrobal.module.css";
import styles from "./page.module.css";
import clsx from "clsx";

export function MypageNavi() {

   const myshopMenu = [
      { name: "내 주문 내역", link: "/" },
      { name: "최근 본 상품", link: "/" },
      { name: "관심리스트", link: "/" },
   ];

   const myInfoMenu = [
      { name: "배송지 관리", link: "/" },
      { name: "1:1 문의내역", link: "/" },
      { name: "리뷰 관리", link: "/" },
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
