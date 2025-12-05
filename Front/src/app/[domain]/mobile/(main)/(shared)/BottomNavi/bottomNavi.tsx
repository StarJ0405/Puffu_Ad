"use client";
import CountBadge from "@/components/countBadge/countBadge";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./bottomNavi.module.css";
import SideMenu from "./sideMenu";

export default function BottomNavi() {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const pathname = usePathname();
  const { userData } = useAuth();

  const shouldHideHeader =
    pathname.includes(`/products/${params.detail_id}`) ||
    pathname === `/mypage/subscription/success`;

  const linkTypeHandler = (type: string) => {
    // 링크에 따라서 active 바뀜.
    return pathname === type && active === false;
  };

  return (
    <>
      {/* 카테고리 메뉴 */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            id="motion"
            // key={active}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              background: "#111", // 검색창 배경색
              zIndex: 1200, // 다른 UI 위로
            }}
          >
            <SideMenu CaOpen={active} onClose={() => setActive(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!shouldHideHeader ? ( // detail 페이지일때는 숨겨짐.
        <FlexChild justifyContent="center" className={styles.bottom_navi}>
          <HorizontalFlex className={styles.navi_wrap} alignItems="end">
            <VerticalFlex
              className={styles.item}
              onClick={() => setActive((prev) => !prev)}
            >
              <Image
                src={`/resources/images/bottomNavi/navi_menu${
                  active ? "_active" : ""
                }.png`}
                width={24}
              />
              <FlexChild
                className={clsx(styles.txt, { [styles.active]: active })}
              >
                <P>메뉴</P>
              </FlexChild>
            </VerticalFlex>

            <VerticalFlex
              className={styles.item}
              onClick={() => {
                navigate("/mypage/wishList");
                setActive(false);
              }}
            >
              <Image
                src={`/resources/images/bottomNavi/navi_wish${
                  linkTypeHandler("/mypage/wishList") ? "_active" : ""
                }.png`}
                width={21}
              />
              <FlexChild
                className={clsx(styles.txt, {
                  [styles.active]: linkTypeHandler("/mypage/wishList"),
                })}
              >
                <P>관심 리스트</P>
              </FlexChild>
            </VerticalFlex>

            <VerticalFlex
              className={styles.item}
              onClick={() => {
                navigate("/");
                setActive(false);
              }}
            >
              <Image
                src={`/resources/images/bottomNavi/navi_home${
                  linkTypeHandler("/") ? "_active" : ""
                }.png`}
                width={20}
              />
              <FlexChild
                className={clsx(styles.txt, {
                  [styles.active]: linkTypeHandler("/"),
                })}
              >
                <P>홈</P>
              </FlexChild>
            </VerticalFlex>

            <VerticalFlex
              className={styles.item}
              onClick={() => {
                navigate("/orders/cart");
                setActive(false);
              }}
            >
              <Image
                src={`/resources/images/bottomNavi/navi_cart${
                  linkTypeHandler("/orders/cart") ? "_active" : ""
                }.png`}
                width={19}
              />
              <FlexChild
                className={clsx(styles.txt, {
                  [styles.active]: linkTypeHandler("/orders/cart"),
                })}
              >
                <P>장바구니</P>
                <CountBadge top={"-20px"} right={"0px"} />
              </FlexChild>
            </VerticalFlex>

            <VerticalFlex
              className={styles.item}
              onClick={() => {
                navigate(
                  !userData?.id
                    ? `/auth/login?redirect_url=${pathname}`
                    : "/mypage"
                );
                setActive(false);
              }}
            >
              <Image
                src={`/resources/images/bottomNavi/navi_login${
                  (pathname.includes("/mypage") &&
                    !pathname.includes("/mypage/wishList") &&
                    active === false) ||
                  linkTypeHandler("/auth/login")
                    ? "_active"
                    : ""
                }.png`}
                width={20}
              />
              <FlexChild
                className={clsx(styles.txt, {
                  [styles.active]:
                    (pathname.includes("/mypage") &&
                      !pathname.includes("/mypage/wishList") &&
                      active === false) ||
                    linkTypeHandler("/auth/login"),
                })}
              >
                <P hidden={!!userData?.id}>로그인</P>
                <P hidden={!userData?.id}>마이페이지</P>
              </FlexChild>
            </VerticalFlex>
          </HorizontalFlex>
        </FlexChild>
      ) : (
        <div style={{ display: "none" }}></div>
      )}
    </>
  );
}
