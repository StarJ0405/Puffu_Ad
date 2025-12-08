"use client";

import siteInfo from "@/shared/siteInfo";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { Cookies } from "@/shared/utils/Data";
import { getCookieOption } from "@/shared/utils/Functions";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./header.module.css";
import useNavigate from "@/shared/hooks/useNavigate";
import { usePathname } from "next/navigation";
import NiceModal from "@ebay/nice-modal-react";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { useStore } from "@/providers/StoreProvider/StorePorivderClient";
import { requester } from "@/shared/Requester";
import Div from "@/components/div/Div";
import Button from "@/components/buttons/Button";
import SearchLayer from "@/components/searchLayer/SearchLayer";
import { AnimatePresence, motion } from "framer-motion";

interface ShopMenuItem {
  name: string;
  link: string;
  icon?: string; // menu1에 icon이 있음
}

interface SubMenuItem {
  name: string;
  link: string;
}

export function HeaderMenu() {
  const menu1 = [
    { name: "상품", link: "/" },
    { name: "픽업 매장", link: "/map" },
    { name: "멤버쉽&구독", link: "/" },
    { name: "이벤트", link: siteInfo.bo_event },
    { name: "사용후기", link: siteInfo.bo_review },
    { name: "창업안내", link: "/" },
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
                  // className={clsx({
                  //   [styles.active]: pathname === item.link,
                  // })}
                  >
                    <Link href={item.link}>
                      {item.name}
                      {/* {item.icon ? <Image src={item.icon} width={12} /> : null} */}
                    </Link>
                    {/* <Span className={styles.active_line}></Span> */}
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
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { storeData } = useStore();
  const { userData } = useAuth();
  const [popular, setPopular] = useState<
    Array<{ keyword: string; popular: number; created_at: string }>
  >([]);

  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <FlexChild
        gap={10}
        className={`searchInput_Box ${styles.search_modal_btn}`}
        Ref={wrapRef}
        onClick={() => {setShowSearch(true)}}
      >
        <input
          type="search"
          placeholder="원하시는 제품을 검색해 보세요."
          value={value}
          autoComplete="off"
          onFocus={() => {
            setOpen(true);
            setShowAll(true);
          }}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActiveIndex(null);
            setShowAll(false);
          }}
          // onKeyDown={onKeyDown}
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

      
      {/* {open && (items.length > 0 || recentSearches.length > 0) && (
  
        )} */}
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
    <HorizontalFlex gap={13} className={styles.info_top} width={"auto"}>
      <P
        // onClick={() => removeCookie(Cookies.JWT, getCookieOption())}
        onClick={logoutModal}
        hidden={!userData?.id}
        cursor="pointer"
        className={styles.logout_txt}
      >
        로그아웃
      </P>
      <Link href={"/auth/signup"} hidden={!!userData?.id}>
        회원가입
      </Link>
      <Link href={"/auth/login"} hidden={!!userData?.id}>
        로그인
      </Link>
    </HorizontalFlex>
  );
}
