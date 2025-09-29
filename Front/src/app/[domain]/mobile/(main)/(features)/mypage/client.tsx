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
import useNavigate from "@/shared/hooks/useNavigate";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { requester } from "@/shared/Requester";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";




const editInfoModal = (userData: any, navigate: (path: string) => void) => { // 개인정보 수정
  let password = '';
  NiceModal.show(ConfirmModal, {
    // title: '개인정보 수정',
    message: (
      <EditINfo userData={userData} onPasswordChange={(p) => { password = p; }} />
    ),
    confirmText: "확인",
    withCloseButton: true,
    onConfirm: async () => {
      try {
        const res = await requester.checkCurrentPassword({ password });
        
        if (res.message === 'success') {
          navigate('/mypage/editInfo');
        } else {
          alert('비밀번호가 일치하지 않습니다.');
        }
      } catch (error) {
        console.error('Password check failed:', error);
        alert('비밀번호 확인 중 오류가 발생했습니다.');
      }
    },
  })
}



export function Profile() {

  const navigate = useNavigate();
  const { userData } = useAuth(); // 유저정보 받아오기
  

  return (
    <VerticalFlex className={clsx(styles.profile, styles.box_frame)}>
      <VerticalFlex gap={20}>
        <FlexChild width={"auto"} position="relative">
          <FlexChild className={styles.thumbnail} width={"auto"}>
            <Image
              src={userData?.thumbnail || "/resources/icons/mypage/user_no_img.png"}
              width={60}
            />
          </FlexChild>
        </FlexChild>

        <FlexChild width={"auto"} className={styles.profile_name}>
          <P>{userData?.name ?? "익명"}</P>
        </FlexChild>
      </VerticalFlex>

      <FlexChild gap={10} justifyContent="center">
        <FlexChild className={styles.wish_btn} onClick={()=> navigate('/mypage/wishList')}>
          <Image
            src={"/resources/icons/main/mob_heart_active.png"}
            width={16}
          />
          관심 리스트
        </FlexChild>

        <FlexChild className={styles.setting_btn} onClick={() => editInfoModal(userData, navigate)}>
          <Image
            src={"/resources/icons/mypage/setting_icon.png"}
            width={14}
          />
          개인정보 수정
        </FlexChild>
      </FlexChild>
    </VerticalFlex>
  )
}

export function DeliveryInfo() {
  const navigate = useNavigate();
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    fulfilled: 0,
    shipping: 0,
    complete: 0,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await requester.getOrderStatus();
      if (res && res.content) {
        const counts = {
          pending: 0,
          fulfilled: 0,
          shipping: 0,
          complete: 0,
        };
        res.content.forEach((item: { status: string; count: string }) => {
          if (item.status in counts) {
            counts[item.status as keyof typeof counts] = parseInt(item.count, 10);
          }
        });
        setStatusCounts(counts);
      }
    };
    fetchStatus();
  }, []);

  return (
    <VerticalFlex className={clsx(styles.box_frame, styles.delivery_box)}>
      <FlexChild className={styles.box_header}>
        <P>주문 배송 현황</P>
      </FlexChild>

      <FlexChild className={styles.deli_itemBox}>
        <VerticalFlex className={styles.deli_item}>
          <P>{statusCounts.pending}</P>
          <Span>상품 준비중</Span>
        </VerticalFlex>

        <VerticalFlex className={styles.deli_item}>
          <P>{statusCounts.fulfilled}</P>
          <Span>배송준비</Span>
        </VerticalFlex>

        <VerticalFlex className={styles.deli_item}>
          <P>{statusCounts.shipping}</P>
          <Span>배송중</Span>
        </VerticalFlex>

        <VerticalFlex className={styles.deli_item}>
          <P>{statusCounts.complete}</P>
          <Span>배송완료</Span>
        </VerticalFlex>
      </FlexChild>

      <FlexChild className={styles.link_btn} onClick={() => navigate("/mypage/myOrders")}>
        <Button>내 주문 확인</Button>
      </FlexChild>
    </VerticalFlex>
  )
}


export function MypageNavi() {
  const [, , removeCookie] = useCookies([Cookies.JWT]);
  const { userData } = useAuth();
  const navigate = useNavigate();
  
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
      onConfirm: () => {
        removeCookie(Cookies.JWT, getCookieOption());
      },
    })
  }

   const myshopMenu = [
      { name: "내 주문 내역", link: "/mypage/myOrders" },
      { name: "최근 본 상품", link: "/mypage/recentlyView" },
      { name: "관심리스트", link: "/mypage/wishList" },
   ];

   const myInfoMenu = [
      { name: "배송지 관리", link: "/mypage/delivery" },
      { name: "문의내역", link: "/mypage/inquiry" },
      // { name: "리뷰 관리", link: "/mypage/review" },
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
              onClick={(e) => {
                e.preventDefault();
                editInfoModal(userData, navigate);
              }}
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
            <FlexChild className={styles.inner_btn} onClick={logoutModal}>
              <Span>로그아웃</Span>
              <Image
                src={"/resources/icons/arrow/slide_arrow.png"}
                width={8}
              />
            </FlexChild>
          </li>
        </ul>
      </VerticalFlex>
    </VerticalFlex>
  );
}


// 개인정보 수정 모달 내용
export function EditINfo({ userData, onPasswordChange }: { userData: any, onPasswordChange: (password: string) => void }) {
  return (
    <VerticalFlex className="modal_edit_info" gap={50}>
      <FlexChild className="title" justifyContent="center">
        <P size={25} weight={600}>개인정보 수정</P>
      </FlexChild>

      <VerticalFlex alignItems="start" gap={30}>
        <VerticalFlex className={'input_box'} alignItems="start" gap={10}>
          <P size={16} color="#333" weight={600}>아이디</P>
          <P size={16} color="#797979">{userData?.username ?? "mynameistony"}</P>
        </VerticalFlex>

        <VerticalFlex className={'input_box'} alignItems="start" gap={10}>
          <P size={16} color="#333" weight={600}>비밀번호</P>
          <Input type="password" width={'100%'} placeHolder="비밀번호를 입력하세요." onChange={(value) => onPasswordChange(value as string)} />
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  )
}