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

import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Input from "@/components/inputs/Input";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const editInfoModal = (userData: any, navigate: (path: string) => void) => {
  // 개인정보 수정
  let password = "";
  NiceModal.show(ConfirmModal, {
    // title: '개인정보 수정',
    message: (
      <EditINfo
        userData={userData}
        onPasswordChange={(p) => {
          password = p;
        }}
      />
    ),
    confirmText: "확인",
    withCloseButton: true,
    onConfirm: async () => {
      try {
        const res = await requester.checkCurrentPassword({ password });

        if (res.message === "success") {
          navigate("/mypage/editInfo");
        } else {
          alert("비밀번호가 일치하지 않습니다.");
        }
      } catch (error) {
        console.error("Password check failed:", error);
        alert("비밀번호 확인 중 오류가 발생했습니다.");
      }
    },
  });
};

export function Profile({ initGroups }: { initGroups: Pageable }) {
  const navigate = useNavigate();
  const { userData } = useAuth(); // 유저정보 받아오기
  const { groups } = useData(
    "groups",
    {},
    (condition) => requester.getGroups(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initGroups,
    }
  );
  const [nextGroup, setNexGroup] = useState(
    groups
      .sort((g1: GroupData, g2: GroupData) => g1.min - g2.min)
      .find((f: GroupData) => f.min > (userData?.stored || 0))
  );
  useEffect(() => {
    setNexGroup(
      groups
        .sort((g1: GroupData, g2: GroupData) => g1.min - g2.min)
        .find((f: GroupData) => f.min > (userData?.stored || 0))
    );
  }, [groups, userData]);
  return (
    <VerticalFlex className={clsx(styles.profile, styles.box_frame)}>
      <HorizontalFlex padding={"25px 45px"} gap={45}>
        <FlexChild className={styles.profile_wrap} width={"fit-content"}>
          <VerticalFlex gap={15}>
            <FlexChild width={"auto"} position="relative">
              <FlexChild className={styles.thumbnail} width={"auto"}>
                <Image
                  src={
                    userData?.thumbnail ||
                    "/resources/icons/mypage/user_no_img.png"
                  }
                  width={80}
                />
              </FlexChild>
            </FlexChild>
            <FlexChild width={"auto"} className={styles.profile_name}>
              <P>{userData?.name ?? "익명"}</P>

              <FlexChild
                width={"auto"}
                cursor="pointer"
                onClick={() => editInfoModal(userData, navigate)}
              >
                <Image
                  src={"/resources/icons/mypage/setting_icon.png"}
                  width={16}
                />
              </FlexChild>
            </FlexChild>
            <P className={styles.membership_level}>{userData?.group?.name}</P>
            <FlexChild className={styles.link_btn}>
              <Button onClick={() => navigate("/mypage/wishList")}>
                관심 리스트
              </Button>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>

        <FlexChild>
          <HorizontalFlex gap={30}>
            <VerticalFlex
              gap={15}
              borderLeft={"1px solid #797979"}
              paddingLeft={45}
            >
              <VerticalFlex className={styles.amount_box}>
                <P className={styles.title}>현재 누적 금액</P>
                <FlexChild className={styles.amount}>
                  <P>{userData?.stored}</P>
                  <P>원</P>
                </FlexChild>
              </VerticalFlex>
              {nextGroup?.id ? (
                <VerticalFlex className={styles.amount_box}>
                  <P className={styles.title}>
                    {nextGroup.name}까지 필요한 구매 금액
                  </P>
                  <FlexChild className={styles.amount}>
                    <P>{nextGroup.min - (userData?.stored || 0)}</P>
                    <P>원</P>
                  </FlexChild>
                </VerticalFlex>
              ) : (
                <VerticalFlex className={styles.amount_box}>
                  <P className={styles.title}>
                    와우! 고객님, 드디어 저희 쇼핑몰 멤버십의 정상에
                    등극하셨군요! 👑
                    <br />
                    음... 뭐라고 불러드려야 할까요? 고객님이라고 하기엔 너무
                    약하고... 혹시 저희 쇼핑몰 운영자이신가요? 😳 멤버십 레벨이
                    너무 '최고'라서, 솔직히 깜짝 놀랐지 뭐예요!
                    <br />더 이상 올라갈 곳이 없어요! 당신이 바로 저희 쇼핑몰의
                    ✨**베스트(최고)**✨입니다! 👍 이렇게 대단한 활약에 무한한
                    감사와 존경을 표합니다! 짝짝짝! 💖
                    <br />
                    by 리튼 AI
                  </P>
                </VerticalFlex>
              )}
            </VerticalFlex>

            <VerticalFlex>
              <VerticalFlex className={styles.coupon_box}>
                <FlexChild>
                  <Image
                    src="resources/icons/mypage/coupon_icon.png"
                    width={28}
                    paddingRight={7}
                  />
                  <P>보유쿠폰</P>
                </FlexChild>
                <FlexChild className={styles.coupon}>
                  <P>{userData?.coupon}</P>
                  <P>개</P>
                </FlexChild>
              </VerticalFlex>
              <VerticalFlex className={styles.point_box}>
                <FlexChild>
                  <P paddingRight={4}>나의 포인트</P>
                  <P className={styles.currency}>P</P>
                </FlexChild>
                <FlexChild className={styles.point}>
                  <P paddingRight={4}>{userData?.point}</P>
                  <P className={styles.currency}>P</P>
                </FlexChild>
              </VerticalFlex>
            </VerticalFlex>
          </HorizontalFlex>
        </FlexChild>
      </HorizontalFlex>
      <FlexChild hidden className={styles.membership_btn}>
        <P onClick={() => navigate("/mypage")} cursor="pointer">
          등급별 혜택 확인하기
        </P>
      </FlexChild>
    </VerticalFlex>
  );
}

export function MypageNavi() {
  const [, , removeCookie] = useCookies([Cookies.JWT]);

  const { userData } = useAuth();
  const navigate = useNavigate();
  const pathname = usePathname();

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

  const logoutModal = () => {
    // 로그아웃
    NiceModal.show(ConfirmModal, {
      message: (
        <FlexChild justifyContent="center" marginBottom={30}>
          <P color="#333" fontSize={20} weight={600}>
            로그아웃 하시겠습니까?
          </P>
        </FlexChild>
      ),
      confirmText: "확인",
      cancelText: "취소",
      withCloseButton: true,
      onConfirm: async () => {
        removeCookie(Cookies.JWT, getCookieOption());
      },
    });
  };

  return (
    <VerticalFlex className={clsx(styles.mypage_navi, styles.box_frame)}>
      <VerticalFlex className={styles.outer_menu}>
        <P>쇼핑정보</P>

        <ul className={styles.inner_menu}>
          {myshopMenu.map((item, i) => {
            const active = pathname === item.link;

            return (
              <li key={i}>
                <Link
                  className={clsx(styles.inner_btn, active && styles.active)}
                  href={item.link}
                >
                  <Span>{item.name}</Span>
                  <Image
                    src={"/resources/icons/arrow/slide_arrow.png"}
                    width={8}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </VerticalFlex>

      <VerticalFlex className={styles.outer_menu}>
        <P>내 정보 관리</P>

        <ul className={styles.inner_menu}>
          <li>
            <Link
              className={styles.inner_btn}
              href={"/mypage/editInfo"}
              onClick={(e) => {
                e.preventDefault();
                editInfoModal(userData, navigate);
              }}
            >
              <Span>개인정보 수정</Span>
              <Image src={"/resources/icons/arrow/slide_arrow.png"} width={8} />
            </Link>
          </li>

          {myInfoMenu.map((item, i) => {
            const active = pathname === item.link;

            return (
              <li key={i}>
                <Link
                  className={clsx(styles.inner_btn, active && styles.active)}
                  href={item.link}
                >
                  <Span>{item.name}</Span>
                  <Image
                    src={"/resources/icons/arrow/slide_arrow.png"}
                    width={8}
                  />
                </Link>
              </li>
            );
          })}
          <li>
            <Link className={styles.inner_btn} href={"/"} onClick={logoutModal}>
              <Span>로그아웃</Span>
              <Image src={"/resources/icons/arrow/slide_arrow.png"} width={8} />
            </Link>
          </li>
        </ul>
      </VerticalFlex>
    </VerticalFlex>
  );
}

export function EditINfo({
  userData,
  onPasswordChange,
}: {
  userData: any;
  onPasswordChange: (password: string) => void;
}) {
  return (
    <VerticalFlex className="modal_edit_info" gap={50}>
      <FlexChild className="title" justifyContent="center">
        <P size={25} weight={600}>
          개인정보 수정
        </P>
      </FlexChild>

      <VerticalFlex alignItems="start" gap={30}>
        <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
          <P size={16} color="#333" weight={600}>
            아이디
          </P>
          <P size={16} color="#797979">
            {userData?.username ?? "mynameistony"}
          </P>
        </VerticalFlex>

        <VerticalFlex className={"input_box"} alignItems="start" gap={10}>
          <P size={16} color="#333" weight={600}>
            비밀번호
          </P>
          <Input
            type="password"
            width={"100%"}
            placeHolder="비밀번호를 입력하세요."
            onChange={(value) => onPasswordChange(value as string)}
          />
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
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
            counts[item.status as keyof typeof counts] = parseInt(
              item.count,
              10
            );
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

      <FlexChild
        className={styles.link_btn}
        onClick={() => navigate("/mypage/myOrders")}
      >
        <Button>내 주문 확인</Button>
      </FlexChild>
    </VerticalFlex>
  );
}
