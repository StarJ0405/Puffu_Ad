"use client";
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import { useStore } from "@/providers/StoreProvider/StorePorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./SearchLayer.module.css";

export default function SearchLayer({
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

  const BrowserClassCheck = !isMobile
    ? styles.search_wrap
    : styles.mob_search_wrap;

  return (
    <Div className={clsx(BrowserClassCheck)}>
      <VerticalFlex className={clsx(styles.search_frame)}>
        <FlexChild className={styles.frame_header}>
          <FlexChild
            className={styles.back_btn}
            cursor="pointer"
            width={"auto"}
            onClick={() => onClose(true)}
          >
            {!isMobile ? (
              <Image src={"/resources/icons/closeBtn_black.png"} width={24} />
            ) : (
              <Image
                src={"/resources/icons/arrow/mypage_arrow.png"}
                width={12}
              />
            )}
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
              src={
                !isMobile
                  ? "/resources/icons/main/search_icon.png"
                  : "/resources/images/header/search_icon_white.png"
              }
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

        <VerticalFlex
          className={clsx(
            styles.keyword_box,
            isMobile ? "mob_page_container" : ""
          )}
        >
          <VerticalFlex gap={!isMobile ? 30 : 20} className={styles.recent_box}>
            <HorizontalFlex className={styles.sh_header} height={"auto"}>
              <h5>최근 검색어</h5>

              <FlexChild
                className={styles.all_delete}
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
                      className={styles.keyword}
                      onClick={() => {
                        setValue(word);
                        navigate(`/search?q=${word}`);
                        onClose(true);
                      }}
                    >
                      {!isMobile && (
                        <Image
                          src="/resources/icons/main/search_icon.png"
                          width={14}
                          marginRight={10}
                        />
                      )}
                      <P color="#5B5B5B" size={14} fontWeight={500}>
                        {word}
                      </P>
                    </FlexChild>

                    <FlexChild
                      className={styles.delete_btn}
                      width={!isMobile ? "auto" : ""}
                      onClick={() => removeSearch(word)}
                    >
                      <Image src="/resources/icons/closeBtn.png" width={11} />
                    </FlexChild>
                  </HorizontalFlex>
                );
              })}
            </VerticalFlex>
          </VerticalFlex>

          <VerticalFlex
            gap={!isMobile ? 30 : 20}
            className={styles.popular_box}
            alignItems="start"
          >
            <h5 className={styles.title}>인기 검색어</h5>

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
