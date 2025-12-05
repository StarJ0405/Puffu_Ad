"use client";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import styles from "./mobileSearch.module.css";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import useNavigate from "@/shared/hooks/useNavigate";
import Div from "@/components/div/Div";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useStore } from "@/providers/StoreProvider/StorePorivderClient";
import { requester } from "@/shared/Requester";
import Span from "@/components/span/Span";

export default function MobileSearch({
  onClose,
}: {
  onClose: (isClosed: boolean) => void;
}) {
  const { isMobile } = useBrowserEvent();
  const { userData } = useAuth();
  const { storeData } = useStore();
  const [value, setValue] = useState("");
  const [popular, setPopular] = useState<
    Array<{ keyword: string; popular: number; created_at: string }>
  >([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    const q = value.trim();
    if (!q) return;
    if (userData?.id && storeData?.id) {
      requester.addKeyword({ store_id: storeData.id, keyword: q });
    }
    navigate(`/search?q=${q}`);
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

  // 일괄 삭제
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(stored);
  }, []);

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

  // 개별 삭제
  const removeSearch = (word: string) => {
    const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");

    // 클릭한 word만 제외
    const updated = stored.filter((item: string) => item !== word);

    // localStorage & state 동기화
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecentSearches(updated);
  };

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

  return (
    <Div className={styles.search_wrap}>
      <VerticalFlex className={clsx(styles.search_frame)}>
        <FlexChild className={styles.frame_header}>
          <FlexChild className={styles.back_btn} cursor="pointer" width={"auto"} onClick={() => onClose(true)} >
            <Image src={"/resources/icons/arrow/mypage_arrow.png"} width={12} />
          </FlexChild>

          <FlexChild
            gap={10}
            className={`searchInput_Box ${styles.search_Box}`}
          >
            <input
              type="search"
              placeholder="원하시는 제품을 검색해 보세요"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onClose(true);
                  latestSearch();
                  handleSearch();
                }
              }}
            />

            <Image
              src="/resources/images/header/search_icon_white.png"
              width={20}
              height="auto"
              cursor="pointer"
              onClick={() => {
                onClose(true);
                latestSearch();
                handleSearch();
              }}
            />
          </FlexChild>
        </FlexChild>

        <VerticalFlex className={clsx("mob_page_container", styles.keyword_box)}>
          <VerticalFlex gap={20} className={styles.recent_box}>
            <HorizontalFlex className={styles.sh_header} height={"auto"}>
              <h5>최근 검색어</h5>
  
              <FlexChild
                className={styles.delete}
                width={"auto"}
                onClick={() => {
                  localStorage.removeItem("recentSearches");
                  setRecentSearches([]);
                }}
              >
                <P>전체삭제</P>
              </FlexChild>
            </HorizontalFlex>
  
            <VerticalFlex className={styles.recent_list}>
              {recentSearches.map((word, i) => {
                return (
                  <HorizontalFlex className={styles.item} key={i}>
                    <FlexChild
                      onClick={() => {
                        setValue(word);
                        navigate(`/search?q=${word}`);
                        onClose(true);
                      }}
                    >
                      <P color="#5B5B5B" size={14} fontWeight={500}>
                        {word}
                      </P>
                    </FlexChild>
  
                    <FlexChild onClick={() => removeSearch(word)}>
                      <Image src="/resources/icons/closeBtn.png" width={11} />
                    </FlexChild>
                  </HorizontalFlex>
                );
              })}
            </VerticalFlex>
          </VerticalFlex>

          <VerticalFlex gap={20} className={styles.popular_box} alignItems="start">
            <h5 className={styles.title}>
              인기 검색어
            </h5>

            {top10.length > 0 ? (
              <FlexChild className={styles.popular_list}>
                {/* 1위~5위 */}
                <FlexChild className={styles.col}>
                  <VerticalFlex gap={20}>
                    {left.map((it, i) => (
                      <FlexChild
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
                            onClose(true);
                          }}
                          title={it.keyword}
                        >
                          <Span className={styles.ellipsis}>{it.keyword}</Span>
                        </Button>
                      </FlexChild>
                    ))}
                  </VerticalFlex>
                </FlexChild>

                {/* 5위~10위 */}
                <FlexChild className={styles.col}>
                  <VerticalFlex gap={20}>
                    {right.map((it, i) => (
                      <FlexChild
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
                            onClose(true);
                          }}
                          title={it.keyword}
                        >
                          <Span className={styles.ellipsis}>{it.keyword}</Span>
                        </Button>
                      </FlexChild>
                    ))}
                  </VerticalFlex>
                </FlexChild>
              </FlexChild>
            ) : (
              <P color="#595959" size={13}>
                인기 검색어가 없습니다.
              </P>
            )}
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>
    </Div>
  );
}
