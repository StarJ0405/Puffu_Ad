"use client";
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
import { HeaderCategory } from "./headerCategory";
import { useCart } from "@/providers/StoreProvider/StorePorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { usePathname } from "next/navigation";

interface ShopMenuItem {
  name: string;
  link: string;
  icon?: string; // menu1에 icon이 있음
}

interface SubMenuItem {
  name: string;
  link: string;
}

// interface CommunityMenuItem {
//   name: string;
//   link: string;
//   inner?: SubMenuItem[]; // menu2는 inner 조건 처리
// }

export function CartLength() {
  const { cartData } = useCart();
  const [length, setLength] = useState<number>(0);

  useEffect(() => {
    setLength(cartData?.items.length ?? 0);
  }, [cartData]);
  
  return (
    <FlexChild className={styles.cart_length}>
      {length}
    </FlexChild>
  )
}

export function SearchBox() {

  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (value.trim()) {
      navigate(`/search?q=${value}`);
    }
  };

  return (
    <FlexChild gap={10} className={`searchInput_Box ${styles.search_Box}`}>
      <input
        type="search"
        placeholder="2025 신제품"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />

      <Image
        src="/resources/images/header/input_search_icon.png"
        width={18}
        height="auto"
        cursor="pointer"
        onClick={()=>handleSearch()}
      />
    </FlexChild>
  );
}

export function HeaderBottom() {

  const menu1 = [
    // 임시 데이터
    { name: "BEST 상품", link: "/products/best" },
    // { name: "입고예정", link: "/products/commingSoon" },
    { name: "신상품", link: "/products/new" },
    {
      name: "이달의 핫딜",
      link: "/products/hot",
      icon: "/resources/images/header/HotDeal_icon.png",
    },
    // { name: "세트메뉴", link: "/products/set" },
    // { name: "랜덤박스", link: "/products/randomBox" },
  ];

  const menu2 = [
    // 임시 데이터
    // { name: "포토 사용후기", link: "/board/photoReview" },
    { name: "공지사항", link: "/board/notice" },
    { name: "1:1문의", link: "/board/inquiry" },
    { name: "이벤트", link: "/board/event" },
    // {
    //   name: "고객센터",
    //   link: "/board/notice",
    //   inner: [
    //     { name: "공지사항", link: "/board/notice" },
    //     { name: "1:1문의", link: "/board/inquiry" },
    //     { name: "이벤트", link: "/board/event" },
    //   ],
    // },
  ];

  const pathname = usePathname();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [fixed, setFixed] = useState(false);
  const [CaOpen, SetCaOpen] = useState(false);

  useEffect(() => {
    const headerScroll = () => {
      const elmt = bottomRef.current?.getBoundingClientRect();
      if (!elmt) return;
      setFixed(elmt.top <= 0);
    };

    window.addEventListener("scroll", headerScroll);
    return () => window.removeEventListener("scroll", headerScroll);
  }, [bottomRef]);

  return (
    <>
      <div ref={bottomRef}></div>{/* 헤더 높이계산용 더미 */}
      <div className={`${fixed ? styles.fixed : ""}`}>
        <HorizontalFlex className="page_container" position="relative">
          <HorizontalFlex gap={25} justifyContent="start">
            <FlexChild
              width={"auto"}
              onMouseEnter={() => SetCaOpen(true)}
              onMouseLeave={() => SetCaOpen(false)}
              className={styles.CategoryBox}
            >
              <FlexChild
                gap={10}
                width={"auto"}
                className={styles.category_btn}
              >
                <Image
                  src="/resources/images/header/category_menu_icon.png"
                  width={18}
                />
                <span className="SacheonFont">카테고리</span>
              </FlexChild>
              <HeaderCategory CaOpen={CaOpen} />
            </FlexChild>

            <FlexChild width={"auto"}>
              <nav>
                <ul className={clsx(styles.outerMenu, styles.shop_outer)}>
                  {menu1.map((item, i) => (
                    <li key={i} className={clsx({[styles.active]: pathname === item.link})}>
                      <Link href={item.link} className="SacheonFont">
                        {item.name}
                        {item.icon ? (
                          <Image src={item.icon} width={12} />
                        ) : null}
                      </Link>
                      <Span className={styles.active_line}></Span>
                    </li>
                  ))}
                </ul>
              </nav>
            </FlexChild>
          </HorizontalFlex>

          <FlexChild gap={20} width={"auto"}>
            <ul className={clsx(styles.outerMenu, styles.commu_outer)}>
              {menu2.map((item, i) => (
                <li key={i} className={clsx({[styles.active]: pathname === item.link})}>
                  <Link href={item.link}>
                    {item.name}
                  </Link>
                </li>
              ))}
              {/* <li key={i} className={clsx({[styles.active]: pathname === item.link})}>
                  <Link href={item.link}>
                    {item.name}
                    {item.inner ? (
                      <Image
                        src={"/resources/icons/arrow/arrow_bottom_icon.png"}
                        width={10}
                        height={"auto"}
                      />
                    ) : null}
                  </Link>

                  {item.inner && (
                    <ul className={styles.subMenu}>
                      {item.inner.map((sub, j) => (
                        <li key={j}>
                          <Link href={sub.link}>{sub.name}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li> */}
            </ul>
          </FlexChild>
        </HorizontalFlex>
      </div>
    </>
  );
}

export function Auth() {
  const [, , removeCookie] = useCookies([Cookies.JWT]);
  const { userData } = useAuth();
  return (
    <HorizontalFlex gap={20} className={styles.info_top} width={"auto"}>
      <P
        onClick={() => removeCookie(Cookies.JWT, getCookieOption())}
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
