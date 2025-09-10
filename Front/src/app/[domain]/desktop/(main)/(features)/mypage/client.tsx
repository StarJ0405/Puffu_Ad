"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import styles from "./mypage.module.css";

import Input from "@/components/inputs/Input";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import NiceModal from "@ebay/nice-modal-react";


const editInfoModal = () => { // 개인정보 수정
  NiceModal.show(ConfirmModal, {
    // title: '개인정보 수정',
    message: (
      <EditINfo />
    ),
    confirmText: "확인",
    withCloseButton: true,
    onConfirm: async () => {
      
    },
  })
}

const logoutModal = () => { // 로그아웃
  NiceModal.show(ConfirmModal, {
    message: (
      <FlexChild justifyContent="center" marginBottom={30}>
        <P color="#333" fontSize={20} weight={600}>로그아웃 하시겠습니까?</P>
      </FlexChild>
    ),
    confirmText: "확인",
    cancelText: "취소",
    withCloseButton: true,
    onConfirm: async () => {
      
    },
  })
}

export function Profile() {
  return (
    <VerticalFlex className={clsx(styles.profile, styles.box_frame)}>
      <VerticalFlex gap={20}>
        <FlexChild width={"auto"} position="relative">
          <FlexChild className={styles.thumbnail} width={"auto"}>
            <Image
              src={"/resources/images/dummy_img/product_01.png"}
              width={80}
            />
          </FlexChild>
        </FlexChild>

        <FlexChild width={"auto"} className={styles.profile_name}>
          <P>콘푸로스트123</P>

          <FlexChild width={'auto'} cursor="pointer"
            onClick={editInfoModal}
          >
            <Image
              src={"/resources/icons/mypage/setting_icon.png"}
              width={16}
            />
          </FlexChild>
        </FlexChild>
      </VerticalFlex>

      <FlexChild className={styles.link_btn}>
        <Button>관심 리스트</Button>
      </FlexChild>
    </VerticalFlex>
  )
}

export function MypageNavi() {

   const myshopMenu = [
      { name: "내 주문 내역", link: "/mypage/myOrders" },
      { name: "최근 본 상품", link: "/mypage/recentlyView" },
      { name: "관심리스트", link: "/mypage/wishList" },
   ];

   const myInfoMenu = [
      { name: "배송지 관리", link: "/mypage/delivery" },
      { name: "문의내역", link: "/mypage/inquiry" },
      { name: "리뷰 관리", link: "/mypage/review" },
      { name: "회원탈퇴", link: "/mypage/deleteAccount" },
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
            <Link className={styles.inner_btn} href={"/mypage/editInfo"}
              // onClick={editInfoModal}
            >
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
            <Link className={styles.inner_btn} href={"/"}
              onClick={logoutModal}
            >
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


export function EditINfo() {
  return (
    <VerticalFlex className="modal_edit_info" gap={50}>
      <FlexChild className="title" justifyContent="center">
        <P size={25} weight={600}>개인정보 수정</P>
      </FlexChild>

      <VerticalFlex alignItems="start" gap={30}>
        <VerticalFlex className={'input_box'} alignItems="start" gap={10}>
          <P size={16} color="#333" weight={600}>아이디</P>
          <P size={16} color="#797979">mynameistony</P>
        </VerticalFlex>

        <VerticalFlex className={'input_box'} alignItems="start" gap={10}>
          <P size={16} color="#333" weight={600}>비밀번호</P>
          <Input type="password" width={'100%'} placeHolder="비밀번호를 입력하세요." />
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  )
}