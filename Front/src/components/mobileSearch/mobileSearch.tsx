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
      <VerticalFlex className={clsx("mob_page_container", styles.search_frame)}>
        <FlexChild className={styles.frame_header}>
          <FlexChild
            cursor="pointer"
            width={"auto"}
            onClick={() => onClose(true)}
          >
            <Image src={"/resources/icons/arrow/slide_arrow.png"} width={12} />
          </FlexChild>

          <FlexChild
            gap={10}
            className={`searchInput_Box ${styles.search_Box}`}
          >
            <input
              type="search"
              placeholder="2025 신제품"
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
              src="/resources/images/header/input_search_icon.png"
              width={18}
              height="auto"
              cursor="pointer"
              onClick={() => {
                onClose(true);
                latestSearch();
              }}
            />
          </FlexChild>
        </FlexChild>

        <VerticalFlex className={styles.latest_search_box}>
          <HorizontalFlex height={"auto"}>
            <FlexChild width={"auto"}>
              <P color="#fff" size={14}>
                최근 검색어
              </P>
            </FlexChild>

            <FlexChild
              className={styles.delete}
              width={"auto"}
              onClick={() => {
                localStorage.removeItem("recentSearches");
                setRecentSearches([]);
              }}
            >
              <P size={13} weight={600} color="#595959">
                전체삭제
              </P>
            </FlexChild>
          </HorizontalFlex>

          <VerticalFlex className={styles.latest_list}>
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
                    <P color="#ccc" size={14}>
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

          <VerticalFlex gap={20}>
            <Div className={styles.divider} />
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
                            onClose(true);
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
                            onClose(true);
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
                표시할 인기 검색어가 없습니다.
              </P>
            )}
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>
    </Div>
  );
}
