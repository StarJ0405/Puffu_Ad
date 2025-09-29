"use client"
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import StarRate from "@/components/star/StarRate";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./sideMenu.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { Cookies } from "@/shared/utils/Data";

import Input from "@/components/inputs/Input";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import { getCookieOption } from "@/shared/utils/Functions";
import { useCookies } from "react-cookie";


const SideMenu = NiceModal.create(() => {
  const modal = useModal();
  const navigate = useNavigate();
  const modalRef = useRef<any>(null);
  const [menuTab, setMenuTab] = useState('mypage');
  const { userData } = useAuth();
  const [, , removeCookie] = useCookies([Cookies.JWT]);


  type PagingItem = {
    name: string;
    link: string;
  };

  const cutomerMenu: PagingItem[] = [
    { name: '공지사항', link: '/board/notice' },
    { name: '1:1 문의', link: '/board/inquiry' },
    { name: '이벤트', link: '/board/event' },
  ]

  const shopMenu: PagingItem[] = [
    { name: '내 주문 관리', link: '/mypage/myOrders' },
    { name: '최근 본 상품', link: '/mypage/recentlyView' },
    { name: '관심 리스트', link: '/mypage/wishList' },
  ]

  const myInfoMenu: PagingItem[] = [
    { name: '내 정보', link: '/mypage' },
    { name: '배송지 관리', link: '/mypage/delivery' },
    { name: '문의 내역', link: '/mypage/inquiry' },
    {name: '리뷰 관리', link: '/mypage/review'},
  ]

  const communityMenu: PagingItem[] = [
    { name: '포토 사용후기', link: '/board/photoReview' },
  ]

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

  return (
    <ModalBase
      ref={modalRef}
      slideLeft
      cancelBack
      // withHeader
      // title={product.name}
      // withFooter
      // buttonText="닫기"
      width={'70%'}
      maxWidth={300}
      minWidth={220}

      clickOutsideToClose={true}
      onClose={modal.remove}
    >
      <VerticalFlex className={styles.sideMenu} alignItems="start" justifyContent="start">
        <HorizontalFlex className={styles.menu_header}>
          <FlexChild className={styles.title}>
            <P>전체서비스</P>
          </FlexChild>

          <FlexChild className={styles.close_btn} onClick={() => modalRef.current?.close()}>
            <Image src={"/resources/icons/modal_close_icon.png"} width={15} />
          </FlexChild>
        </HorizontalFlex>

        <VerticalFlex className={styles.tab_container}>
          <FlexChild className={styles.tab_wrap} justifyContent="start">
            <FlexChild
              className={
                clsx(styles.tab_btn,
                  { [styles.active]: menuTab === "mypage" }
                )
              }
              onClick={() => setMenuTab('mypage')}
            >
              <P>마이페이지</P>
            </FlexChild>
  
            <FlexChild
              className={
                clsx(styles.tab_btn,
                  { [styles.active]: menuTab === "cs" }
                )
              }
              onClick={() => setMenuTab('cs')}
            >
              <P>고객센터</P>
            </FlexChild>
  
            <FlexChild
              className={
                clsx(styles.tab_btn,
                  { [styles.active]: menuTab === "community" }
                )
              }
              onClick={() => setMenuTab('community')}
            >
              <P>커뮤니티</P>
            </FlexChild>
          </FlexChild>
  
          <AnimatePresence mode="wait">
  
            {/* 마이페이지 */}
            {
              menuTab === 'mypage' && (
                <motion.div
                  key="mypage"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <VerticalFlex className={styles.menu_inner}>
                    <VerticalFlex className={styles.inner_wrap} alignItems="start" justifyContent="start">
                      <FlexChild className={styles.inner_title}>
                        <P>쇼핑정보</P>
                      </FlexChild>
  
                      <VerticalFlex className={styles.inner_box} alignItems="start" justifyContent="start">
                        {
                          shopMenu.map((item, i) => (
                            <HorizontalFlex key={i} className={styles.inner_btn}>
                              <FlexChild
                                className={styles.inner_txt}
                                onClick={() => {
                                  modalRef.current?.close();
                                  navigate(item.link);
                                }}
                              >
                                <P>{item.name}</P>
                              </FlexChild>
  
                              <Image src={"/resources/icons/arrow/list_paging_next.png"} width={7} />
                            </HorizontalFlex>
                          ))
                        }
                      </VerticalFlex>
                    </VerticalFlex>
  
                    <VerticalFlex className={styles.inner_wrap} alignItems="start" justifyContent="start">
                      <FlexChild className={styles.inner_title}>
                        <P>내 정보 관리</P>
                      </FlexChild>
  
                      <VerticalFlex className={styles.inner_box} alignItems="start" justifyContent="start">
                        {
                          myInfoMenu.map((item, i) => (
                            <HorizontalFlex key={i} className={styles.inner_btn}>
                              <FlexChild
                                className={styles.inner_txt}
                                onClick={() => {
                                  modalRef.current?.close();
                                  navigate(item.link);
                                }}
                              >
                                <P>{item.name}</P>
                              </FlexChild>
                              <Image src={"/resources/icons/arrow/list_paging_next.png"} width={7} />
                            </HorizontalFlex>
                          ))
                        }
                        <HorizontalFlex className={styles.inner_btn} hidden={!userData?.id}>
                          <FlexChild
                            className={styles.inner_txt}
                            onClick={logoutModal}
                          >
                            <P>로그아웃</P>
                          </FlexChild>
                          <Image src={"/resources/icons/arrow/list_paging_next.png"} width={7} />
                        </HorizontalFlex>
                        <HorizontalFlex className={styles.inner_btn} hidden={!!userData?.id}>
                          <FlexChild
                            className={styles.inner_txt}
                            onClick={()=> {
                              modalRef.current?.close();
                              navigate("/auth/login");
                            }}
                          >
                            <P>로그인</P>
                          </FlexChild>
                          <Image src={"/resources/icons/arrow/list_paging_next.png"} width={7} />
                        </HorizontalFlex>
                        <HorizontalFlex className={styles.inner_btn} hidden={!!userData?.id}>
                          <FlexChild
                            className={styles.inner_txt}
                            onClick={()=> {
                              modalRef.current?.close();
                              navigate("/auth/signup");
                            }}
                          >
                            <P>회원가입</P>
                          </FlexChild>
                          <Image src={"/resources/icons/arrow/list_paging_next.png"} width={7} />
                        </HorizontalFlex>
                      </VerticalFlex>
                    </VerticalFlex>
  
                  </VerticalFlex>
                </motion.div>
              )
            }
  
            {/* 고객센터 */}
            {
              menuTab === 'cs' && (
                <motion.div
                  key="cs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <VerticalFlex className={styles.menu_inner}>
                    <VerticalFlex className={styles.inner_wrap} alignItems="start" justifyContent="start">
                      <FlexChild className={styles.inner_title}>
                        <P>고객센터</P>
                      </FlexChild>
  
                      <VerticalFlex className={styles.inner_box} alignItems="start" justifyContent="start">
                        {
                          cutomerMenu.map((item, i) => (
                            <HorizontalFlex key={i} className={styles.inner_btn}>
                              <FlexChild
                                className={styles.inner_txt}
                                onClick={() => {
                                  modalRef.current?.close();
                                  navigate(item.link);
                                }}
                              >
                                <P>{item.name}</P>
                              </FlexChild>
  
                              <Image src={"/resources/icons/arrow/list_paging_next.png"} width={7} />
                            </HorizontalFlex>
                          ))
                        }
                      </VerticalFlex>
                    </VerticalFlex>
                  </VerticalFlex>
                </motion.div>
              )
            }
  
  
            {/* 고객센터 */}
            {
              menuTab === 'community' && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <VerticalFlex className={styles.menu_inner}>
                    <VerticalFlex className={styles.inner_wrap} alignItems="start" justifyContent="start">
                      <FlexChild className={styles.inner_title}>
                        <P>커뮤니티</P>
                      </FlexChild>
  
                      <VerticalFlex className={styles.inner_box} alignItems="start" justifyContent="start">
                        {
                          communityMenu.map((item, i) => (
                            <HorizontalFlex key={i} className={styles.inner_btn}>
                              <FlexChild
                                className={styles.inner_txt}
                                onClick={() => {
                                  modalRef.current?.close();
                                  navigate(item.link);
                                }}
                              >
                                <P>{item.name}</P>
                              </FlexChild>
  
                              <Image src={"/resources/icons/arrow/list_paging_next.png"} width={7} />
                            </HorizontalFlex>
                          ))
                        }
                      </VerticalFlex>
                    </VerticalFlex>
                  </VerticalFlex>
                </motion.div>
              )
            }
  
          </AnimatePresence>
        </VerticalFlex>
      </VerticalFlex>
    </ModalBase>
  );
});


export default SideMenu;