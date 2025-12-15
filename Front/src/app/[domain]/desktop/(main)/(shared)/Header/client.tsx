"use client";

import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import SearchLayer from "@/components/searchLayer/SearchLayer";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import siteInfo from "@/shared/siteInfo";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./header.module.css";

export function HeaderMenu() {
  const menu1 = [
    { name: "상품", link: siteInfo.pt_best},
    { name: "픽업 매장", link: siteInfo.map_location },
    { name: "멤버쉽&구독", link: siteInfo.memberShip },
    { name: "이벤트", link: siteInfo.bo_event },
    { name: "사용후기", link: siteInfo.bo_review },
    { name: "창업안내", link: siteInfo.startUps },
  ];

  const pathname = usePathname();
  const [CaOpen, SetCaOpen] = useState(false);

  return (
    <>
      <HorizontalFlex className="page_container" position="relative">
        <HorizontalFlex gap={25} justifyContent="start">
          <FlexChild width={"auto"}>
            <nav>
              <ul className={clsx(styles.outerMenu, styles.shop_outer)}>
                {menu1.map((item, i) => (
                  <li
                    key={i}
                    className={clsx({
                      [styles.active]: item.name == '상품' ? pathname.includes('/products') : pathname === item.link,
                    })}
                  >
                    <Link href={item.link}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </FlexChild>
        </HorizontalFlex>
      </HorizontalFlex>
      {/* </div> */}
    </>
  );
}


export function SearchBox() {
  const [value, setValue] = useState("");
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <FlexChild
        gap={10}
        className={`searchInput_Box ${styles.search_modal_btn}`}
        Ref={wrapRef}
        onClick={() => {setShowSearch(prev => !prev);}}
      >
        <input
          type="search"
          placeholder="원하시는 제품을 검색해 보세요."
          value={value}
          autoComplete="off"
          // onFocus={() => {
          //   setOpen(true);
          //   setShowAll(true);
          // }}
          // onChange={(e) => {
          //   setValue(e.target.value);
          //   setOpen(true);
          //   setActiveIndex(null);
          //   setShowAll(false);
          // }}
          // onKeyDown={onKeyDown}
          readOnly
        />
        <FlexChild className={styles.search_icon}>
          <Image
            src="/resources/icons/main/search_icon.png"
            width={16}
            height="auto"
            cursor="pointer"
          />
        </FlexChild>
      </FlexChild>
      <AnimatePresence mode="wait">
      {
        showSearch && (
           <motion.div
              id="motion"
              key={showSearch ? "search-open" : "search-closed"}
              initial={{ opacity: 0, y: -20,}}
              animate={{ opacity: 1, y: 0,}}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{
                 position: "absolute",
                 top: '100%',
                 left: 0,
                 width: "100%",
                 height: "auto",
                 background: "#fff",   // 검색창 배경색
              }}
           >
              <SearchLayer onClose={() => setShowSearch(false)} />
           </motion.div>
        )
      }
      </AnimatePresence>
    </>
  );
}

export function Auth() {
  const [, , removeCookie] = useCookies([Cookies.JWT]);
  const { userData } = useAuth();
  const logoutModal = () => {
    // 로그아웃
    NiceModal.show(ConfirmModal, {
      message: '로그아웃 하시겠습니까?',
      title: '로그아웃',
      confirmText: "확인",
      cancelText: "취소",
      withCloseButton: true,
      onConfirm: async () => {
        removeCookie(Cookies.JWT, getCookieOption());
      },
    });
  };

  return (
    <FlexChild
      // onClick={() => removeCookie(Cookies.JWT, getCookieOption())}
      onClick={logoutModal}
      cursor="pointer"
      hidden={!userData?.id}
      width={'auto'}
    >
      <Image
        src="/resources/icons/main/logout_icon.png"
        width={20}
        height={"auto"}
      />
    </FlexChild>
    // <HorizontalFlex gap={13} className={styles.info_top} width={"auto"} >
      
    //   <Link href={"/auth/signup"} hidden={!!userData?.id}>
    //     회원가입
    //   </Link>
    //   <Link href={"/auth/login"} hidden={!!userData?.id}>
    //     로그인
    //   </Link>
    // </HorizontalFlex>
  );
}
