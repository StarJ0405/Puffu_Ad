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
import useNavigate from "@/shared/hooks/useNavigate";
import { usePathname } from "next/navigation";
import NiceModal from "@ebay/nice-modal-react";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { useStore } from "@/providers/StoreProvider/StorePorivderClient";
import { requester } from "@/shared/Requester";
import Div from "@/components/div/Div";
import Button from "@/components/buttons/Button";

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

  // 안전한 LS 접근
  const getStored = () => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]");
    } catch {
      return [];
    }
  };
  const setStored = (arr: string[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("recentSearches", JSON.stringify(arr.slice(0, 5)));
  };
  const addTerm = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const stored = getStored();
    const updated = [t, ...stored.filter((v: string) => v !== t)].slice(0, 5);
    setStored(updated);
    setRecentSearches(updated);
  };
  const removeTerm = (term: string) => {
    const updated = getStored().filter((v: string) => v !== term);
    setStored(updated);
    setRecentSearches(updated);
  };
  const clearAll = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  useEffect(() => {
    setRecentSearches(getStored());
  }, []);

  // 외부 클릭 닫기
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleSearch = (term?: string) => {
    const q = (term ?? value).trim();
    if (!q) return;
    if (userData?.id && storeData?.id) {
      requester.addKeyword({ store_id: storeData.id, keyword: q });
    }
    addTerm(q);
    setOpen(false);
    setActiveIndex(null);
    setShowAll(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const latestSearch = () => {
    const q = value.trim();
    if (!q) return;

    // 서버 로깅: 로그인 사용자만
    if (userData?.id && storeData?.id) {
      requester.addKeyword({ store_id: storeData.id, keyword: q });
    }

    // 로컬 최근검색어
    const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    const updated = [q, ...stored.filter((item: string) => item !== q)];
    const limited = updated.slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(limited));

    navigate(`/search?q=${q}`);
  };

  useEffect(() => {
    // store 준비 후 인기검색어 로딩
    if (!storeData?.id) return;
    requester
      .getKeywords({ store_id: storeData.id })
      .then((res: any) => {
        const list =
          res?.content?.map((it: any) => ({
            keyword: it?.keyword,
            popular: Number(it?.popular ?? 0),
            created_at: it?.created_at,
          })) ?? [];
        setPopular(list);
      })
      .catch(() => {
        setPopular([]);
      });
  }, [storeData?.id]);

  const top10 = popular.slice(0, 10);
  const left = top10.slice(0, 5);
  const right = top10.slice(5, 10);
  const rankClass = (i: number) =>
    i === 0
      ? styles.rank1
      : i === 1
      ? styles.rank2
      : i === 2
      ? styles.rank3
      : styles.rank;

  const base = recentSearches;
  const filtered = value
    ? base.filter((v) => v.toLowerCase().includes(value.toLowerCase()))
    : base;
  const items = showAll ? base : filtered;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!items.length) return;
      setActiveIndex((prev) => {
        const idx = prev === null ? 0 : (prev + 1) % items.length;
        return idx;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      setActiveIndex((prev) => {
        if (prev === null) return items.length - 1;
        return (prev - 1 + items.length) % items.length;
      });
    } else if (e.key === "Enter") {
      if (activeIndex !== null && items[activeIndex]) {
        handleSearch(items[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(null);
    }
  };

  return (
    <FlexChild
      gap={10}
      className={`searchInput_Box ${styles.search_Box}`}
      position="relative"
      Ref={wrapRef}
    >
      <input
        type="search"
        placeholder="상품 검색"
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
        onKeyDown={onKeyDown}
      />
      <Image
        src="/resources/images/header/input_search_icon.png"
        width={18}
        height="auto"
        cursor="pointer"
        onClick={() => {
            latestSearch();
            handleSearch();
          }
        }
      />

      {open && (items.length > 0 || recentSearches.length > 0) && (
        <FlexChild className={styles.search_dropdown}>
          <div
            role="listbox"
            aria-label="최근 검색어"
          >
            <VerticalFlex className={styles.recent_search} alignItems="start">
              <FlexChild className={styles.title}>
                <P>최근 검색어</P>
              </FlexChild>
              <ul className={styles.search_list}>
                {(items.length ? items : recentSearches).map((word, i) => (
                  <li
                    key={`${word}-${i}`}
                    role="option"
                    aria-selected={activeIndex === i}
                    className={clsx(styles.search_item, {
                      [styles.active]: activeIndex === i,
                    })}
                  >
                    <button
                      type="button"
                      className={styles.search_item_btn}
                      onClick={() => handleSearch(word)}
                      title={`${word} 검색`}
                    >
                      <Image
                        src="/resources/images/header/input_search_icon.png"
                        width={14}
                        height="auto"
                      />
                      <span>{word}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`${word} 삭제`}
                      className={styles.search_item_remove}
                      onClick={() => removeTerm(word)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
    
              <div className={styles.search_actions}>
                <button
                  type="button"
                  onClick={clearAll}
                  className={styles.clear_all}
                >
                  전체삭제
                </button>
              </div>
            </VerticalFlex>
          </div>

          <VerticalFlex gap={20} hidden>
            <Div className={styles.divider} />
            <VerticalFlex gap={20} padding={'0 13px'}>
              <FlexChild>
                <P color="#fff" size={14} marginTop={5} className={styles.popularTitle}>
                  인기 검색어
                </P>
              </FlexChild>
              {top10.length > 0 ? (
                <HorizontalFlex className={styles.popular_grid}>
                  {/* Left column */}
                  <FlexChild className={styles.col}>
                    <VerticalFlex gap={20}>
                      {left.map((it, i) => (
                        <HorizontalFlex
                          key={`L-${it.keyword}-${i}`}
                          className={styles.row}
                          alignItems="center"
                          justifyContent="flex-start"
                        >
                          <Span className={rankClass(i)}>{i + 1}</Span>
                          <Button
                            type="button"
                            className={styles.term}
                            onClick={() => {
                              setValue(it.keyword);
                              if (userData?.id && storeData?.id) {
                                requester.addKeyword({
                                  store_id: storeData.id,
                                  keyword: it.keyword,
                                });
                              }
                              navigate(`/search?q=${it.keyword}`);
                            }}
                            title={it.keyword}
                          >
                            <Span className={styles.ellipsis}>{it.keyword}</Span>
                          </Button>
                        </HorizontalFlex>
                      ))}
                    </VerticalFlex>
                  </FlexChild>
  
                  {/* Right column */}
                  <FlexChild className={styles.col}>
                    <VerticalFlex gap={20}>
                      {right.map((it, i) => (
                        <HorizontalFlex
                          key={`R-${it.keyword}-${i}`}
                          className={styles.row}
                          alignItems="center"
                          justifyContent="flex-start"
                        >
                          <Span className={rankClass(i + 5)}>{i + 6}</Span>
                          <Button
                            type="button"
                            className={styles.term}
                            onClick={() => {
                              setValue(it.keyword);
                              if (userData?.id && storeData?.id) {
                                requester.addKeyword({
                                  store_id: storeData.id,
                                  keyword: it.keyword,
                                });
                              }
                              navigate(`/search?q=${it.keyword}`);
                            }}
                            title={it.keyword}
                          >
                            <Span className={styles.ellipsis}>{it.keyword}</Span>
                          </Button>
                        </HorizontalFlex>
                      ))}
                    </VerticalFlex>
                  </FlexChild>
                </HorizontalFlex>
              ) : (
                <P color="#595959" size={13}>
                  인기 검색어가 없습니다.
                </P>
              )}
            </VerticalFlex>
          </VerticalFlex>
        </FlexChild>

      )}
    </FlexChild>
  );
}

export function HeaderBottom() {
  const menu1 = [
    { name: "BEST 상품", link: "/products/best" },
    { name: "입고예정", link: "/products/commingSoon" },
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
    { name: "포토 사용후기", link: "/board/photoReview" },
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
  const [CaOpen, SetCaOpen] = useState(false);

  // 피드백 받고 이상하다 하면 돌려놓기
  // const bottomRef = useRef<HTMLDivElement | null>(null);
  // const [fixed, setFixed] = useState(false);

  // useEffect(() => {
  //   const headerScroll = () => {
  //     const elmt = bottomRef.current?.getBoundingClientRect();
  //     if (!elmt) return;
  //     setFixed(elmt.top <= 0);
  //   };

  //   window.addEventListener("scroll", headerScroll);
  //   return () => window.removeEventListener("scroll", headerScroll);
  // }, [bottomRef]);

  return (
    <>
      {/* 헤더 높이계산용 더미 */}
      {/* <div ref={bottomRef}></div> */}
      {/* <div className={`${fixed ? styles.fixed : ""}`}> */}
      <HorizontalFlex className="page_container" position="relative">
        <HorizontalFlex gap={25} justifyContent="start">
          <FlexChild
            width={"auto"}
            position="relative"
            className={styles.CategoryBox}
            // onMouseEnter={() => test()}
            onMouseEnter={() => SetCaOpen(true)}
            onMouseLeave={() => SetCaOpen(false)}
          >
            <FlexChild gap={10} width={"auto"} className={styles.category_btn}>
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
                  <li
                    key={i}
                    className={clsx({
                      [styles.active]: pathname === item.link,
                    })}
                  >
                    <Link href={item.link} className="SacheonFont">
                      {item.name}
                      {item.icon ? <Image src={item.icon} width={12} /> : null}
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
              <li
                key={i}
                className={clsx({ [styles.active]: pathname === item.link })}
              >
                <Link href={item.link}>{item.name}</Link>
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
      {/* </div> */}
    </>
  );
}

export function Auth() {
  const [, , removeCookie] = useCookies([Cookies.JWT]);
  const { userData } = useAuth();
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
