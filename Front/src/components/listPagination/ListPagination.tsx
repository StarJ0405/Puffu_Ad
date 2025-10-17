"use client";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import clsx from "clsx";
import FlexChild from "../flex/FlexChild";
import HorizontalFlex from "../flex/HorizontalFlex";
import Image from "../Image/Image";
import styles from "./ListPagination.module.css";

type Props = {
  page: number;
  maxPage: number;
  onChange: (next: number) => void;
  size?: number;
  scrollTargetRef?: React.RefObject<HTMLElement>;
};

function ListPagination({
  page,
  maxPage,
  onChange,
  size = 10,
  scrollTargetRef,
}: Props) {
  const { isMobile } = useBrowserEvent();

  const clampIndex = (p: number) =>
    Math.max(
      0,
      Math.min(Number.isFinite(p) ? Math.trunc(p) : 0, Math.max(0, maxPage))
    );

  const go = (p: number) => {
    onChange(clampIndex(p));
    if (scrollTargetRef?.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const safePage = clampIndex(page);
  const first = safePage === 0;
  const last = safePage >= Math.max(0, maxPage);

  // 페이지 블록 계산 (size당 묶음)
  const start = Math.floor(safePage / size) * size;
  const len = Math.min(size, Math.max(0, maxPage - start)); // 음수 방지
  const pages = Array.from({ length: len + 1 }, (_, i) => start + i);

  return (
    <>
      {!isMobile ? (
        // PC
        <HorizontalFlex className={styles.pagingBox}>
          <FlexChild
            className={clsx(
              styles.first_btn,
              styles.paging,
              first && styles.disabled
            )}
            onClick={() => !first && go(0)}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_first.png"}
              width={10}
            />
          </FlexChild>
          <FlexChild
            className={clsx(
              styles.prev_btn,
              styles.paging,
              first && styles.disabled
            )}
            onClick={() => !first && go(safePage - 1)}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_prev.png"}
              width={6}
            />
          </FlexChild>
          <>
            {pages.length > 0 ? (
              pages.map((p) => (
                <FlexChild
                  key={p}
                  className={clsx(
                    styles.num_btn,
                    styles.paging,
                    p === safePage && styles.active
                  )}
                  onClick={() => go(p)}
                >
                  {p + 1}
                </FlexChild>
              ))
            ) : (
              <FlexChild
                className={clsx(styles.num_btn, styles.paging, styles.active)}
              >
                1
              </FlexChild>
            )}
          </>
          <FlexChild
            className={clsx(
              styles.next_btn,
              styles.paging,
              last && styles.disabled
            )}
            onClick={() => !last && go(safePage + 1)}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_next.png"}
              width={6}
            />
          </FlexChild>
          <FlexChild
            className={clsx(
              styles.last_btn,
              styles.paging,
              last && styles.disabled
            )}
            onClick={() => !last && go(maxPage)}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_last.png"}
              width={10}
            />
          </FlexChild>
        </HorizontalFlex>
      ) : (
        // Mobile
        <HorizontalFlex className={styles.pagingBox}>
          <FlexChild
            className={clsx(
              styles.first_btn,
              styles.paging,
              first && styles.disabled
            )}
            onClick={() => !first && go(0)}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_first.png"}
              width={10}
            />
          </FlexChild>
          <FlexChild
            className={clsx(
              styles.prev_btn,
              styles.paging,
              first && styles.disabled
            )}
            onClick={() => !first && go(safePage - 1)}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_prev.png"}
              width={6}
            />
          </FlexChild>
          <>
            {pages.length > 0 ? (
              pages.map((p) => (
                <FlexChild
                  key={p}
                  className={clsx(
                    styles.num_btn,
                    styles.paging,
                    p === safePage && styles.active
                  )}
                  onClick={() => go(p)}
                >
                  {p + 1}
                </FlexChild>
              ))
            ) : (
              <FlexChild
                className={clsx(styles.num_btn, styles.paging, styles.active)}
              >
                1
              </FlexChild>
            )}
          </>
          <FlexChild
            className={clsx(
              styles.next_btn,
              styles.paging,
              last && styles.disabled
            )}
            onClick={() => !last && go(safePage + 1)}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_next.png"}
              width={6}
            />
          </FlexChild>
          <FlexChild
            className={clsx(
              styles.last_btn,
              styles.paging,
              last && styles.disabled
            )}
            onClick={() => !last && go(maxPage)}
          >
            <Image
              src={"/resources/icons/arrow/list_paging_last.png"}
              width={10}
            />
          </FlexChild>
        </HorizontalFlex>
      )}
    </>
  );
}

export default ListPagination;
