"use client";

import siteInfo from "@/shared/siteInfo";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { useCategories } from "@/providers/StoreProvider/StorePorivderClient";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./sideMenu.module.css";
import useNavigate from "@/shared/hooks/useNavigate";
import { AnimatePresence, motion } from "framer-motion";
import SearchLayer from "@/components/searchLayer/SearchLayer";
import Span from "@/components/span/Span";
import { usePathname } from "next/navigation";

export default function SideMenu({
  CaOpen,
  onClose,
}: {
  CaOpen?: boolean;
  onClose?: () => void;
}) {
  // 카테고리메뉴
  const { categoriesData } = useCategories();
  const costumeData = categoriesData.find((ca)=> ca.name === '코스튬/의류');
  const pathname = usePathname();

  useEffect(() => {
    if (CaOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    // 혹시 컴포넌트가 언마운트될 때도 풀어주기
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [CaOpen]);

  const [showSearch, setShowSearch] = useState(false);
  const bodyOverflow = (e: string) => {
    document.body.style.overflow = e;
  }

  useEffect(()=> {
    if(showSearch) {
      bodyOverflow('hidden')
    } else {
      bodyOverflow('')
    }

    return () => {
      bodyOverflow('')
    };
  }, [showSearch])


  const communityLink = [
    {name: '사용 후기', link: siteInfo.bo_review},
  ]

  const customerLink = [
    {name: '공지사항', link: siteInfo.bo_notice},
    {name: '이벤트', link: siteInfo.bo_event},
  ]

  const myPageLink = [
    {name: '내 정보', link: siteInfo.my_profile},
    {name: '내 주문 관리', link: siteInfo.my_order},
    {name: '최근 본 상품', link: siteInfo.my_recentlyView},
    {name: '배송지 관리', link: siteInfo.my_delivery},
    {name: '문의 내역', link: siteInfo.my_inquiry},
    {name: '리뷰 관리', link: siteInfo.my_review},
  ]

  const pathnameActive = (itemLink: string) => {
    return pathname == itemLink ? styles.active : ''
  }

  return (
    <>
      {/* 모바일 검색창 페이지 */}
      <AnimatePresence mode="wait" onExitComplete={() => bodyOverflow('')}>
        {showSearch && (
          <motion.div
            id="motion"
            key={showSearch ? "search-open" : "search-closed"}
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
              zIndex: 10000, // 다른 UI 위로
            }}
          >
            <SearchLayer onClose={() => setShowSearch(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Div className={styles.menu_wrap}>
        <HorizontalFlex className={styles.frame_header}>
          <FlexChild cursor="pointer" width={"auto"} onClick={onClose} className={styles.back_btn}>
            <Image src={"/resources/icons/arrow/mypage_arrow.png"} width={12} />
          </FlexChild>

          <FlexChild
            gap={10}
            className={`searchInput_Box ${styles.search_Box}`}
            onClick={() => setShowSearch(true)}
          >
            <input type="search" placeholder="원하시는 제품을 검색해 보세요" />

            <Image
              src="/resources/images/header/search_icon_white.png"
              width={20}
              height="auto"
              cursor="pointer"
            />
          </FlexChild>
        </HorizontalFlex>
        <Div className={clsx(styles.container)}>
          {/* 대분류 */}
          <VerticalFlex className={clsx(styles.category_menu, 'mob_page_container')} alignItems="start">

            <h5 className={clsx(styles.title, 'Wanted')}>category</h5>

            <nav className={styles.category_list}>
              {categoriesData
                .sort((c1, c2) => c1.index - c2.index)
                .filter((ca)=> ca.name !== '코스튬/의류')
                .map((cat, i) => (
                  <VerticalFlex className={styles.ca_item} key={i} justifyContent="end">
                    <Link href={`/categories/${cat.id}`}>
                      <FlexChild className={styles.ca_img} justifyContent="center" alignItems="center">
                        <Image src={cat.thumbnail}/>
                      </FlexChild>
                    </Link>
                    <VerticalFlex className={styles.text_box}>
                      <h5>{cat.name}</h5>
                      <Span className="Wanted">{cat.english_name}</Span>
                    </VerticalFlex>
                  </VerticalFlex>
                ))}
            </nav>

            <Link href={`categories/${costumeData?.id}`} className={styles.exhibitionBox}>
              <Div className={styles.itemBox}>
                <VerticalFlex className={styles.text_box} alignItems="start">
                  <h3>{costumeData?.name}</h3>
                  <P className={styles.text2}>{costumeData?.english_name}</P>
                </VerticalFlex>
                <Image src={costumeData?.thumbnail}/>
              </Div>

              <Div className={styles.bg_layer}>
                <Image src={costumeData?.thumbnail} />
                <Image src={costumeData?.thumbnail} />
                <Image src={costumeData?.thumbnail} />
              </Div>
            </Link>
          </VerticalFlex>

          <VerticalFlex className={clsx(styles.link_menu, 'mob_page_container')}>
            <VerticalFlex className={styles.link_box} alignItems="start">
              <h5 className={clsx(styles.title, 'Wanted')}>Community</h5>
              <Div className={styles.grid}>
                {communityLink.map((item, i)=> {
                    return (
                      <Div className={clsx(pathnameActive(item.link))} key={i}><Link href={item.link}>{item.name}</Link></Div>
                    )
                })}
              </Div>
            </VerticalFlex>

            <VerticalFlex className={styles.link_box} alignItems="start">
              <h5 className={clsx(styles.title, 'Wanted')}>Customer Center</h5>
              <Div className={styles.grid}>
                {customerLink.map((item, i)=> {
                    return (
                      <Div className={clsx(pathnameActive(item.link))} key={i}><Link href={item.link}>{item.name}</Link></Div>
                    )
                })}
              </Div>
            </VerticalFlex>

            <VerticalFlex className={styles.link_box} alignItems="start">
              <h5 className={clsx(styles.title, 'Wanted')}>My page</h5>
              <Div className={styles.grid}>
                {myPageLink.map((item, i)=> {
                    return (
                      <Div className={clsx(pathnameActive(item.link))} key={i}><Link href={item.link}>{item.name}</Link></Div>
                    )
                })}
              </Div>
            </VerticalFlex>


          </VerticalFlex>
  
          {/* <HorizontalFlex className={styles.ca_wrap} >
            <nav className={clsx(styles.ca_tab1, styles.ca_box)}>
              {categoriesData
                .sort((c1, c2) => c1.index - c2.index)
                .map((cat, i) => (
                  <FlexChild
                    key={i}
                    className={clsx(styles.tab_item, 
                      {[styles.active]: activeDepth1 === cat.id,}
                    )}
                  >
                    <P>
                     {cat.name}
                   </P>
                  </FlexChild>
                ))}
            </nav>
  
            <VerticalFlex className={clsx(styles.child_wrap)}>
              <VerticalFlex alignItems="start">
                {categoriesData
                  .sort((c1, c2) => c1.index - c2.index)
                  .map((cat1, i) => (
                    <VerticalFlex
                      key={cat1.id ?? i}
                      className={clsx(styles.ca_child, {
                        [styles.active]: activeDepth1 === cat1.id,
                      })}
                      onMouseEnter={() => setActiveDepth1(cat1.id)}
                      onMouseLeave={() => setActiveDepth1(null)}
                    >
                      <FlexChild
                        className={styles.cat1_item}
                        onClick={() => navigate(`/categories/${cat1.id}`)}
                      >
                        <P>{cat1.name}</P>
                        <Image
                          src={"/resources/icons/arrow/list_paging_next.png"}
                          width={7}
                        />
                      </FlexChild>
  
                      {cat1.children
                        ?.sort((c1, c2) => c1.index - c2.index)
                        .map((child2, j) => (
                          <Link
                            href={`/categories/${child2.id}`}
                            key={child2.id ?? j}
                          >
                            <FlexChild
                              cursor="pointer"
                              className={styles.child_item}
                            >
                              <P>{child2.name}</P>
                              <Image
                                src={
                                  "/resources/icons/arrow/list_paging_next.png"
                                }
                                width={5}
                              />
                            </FlexChild>
                          </Link>
                        ))}
                    </VerticalFlex>
                  ))}
              </VerticalFlex>
            </VerticalFlex>
          </HorizontalFlex> */}
        </Div>
      </Div>
    </>
  );
}
