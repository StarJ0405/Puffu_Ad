"use client";

import styles from "./page.module.css";
import TemplateCard from "@/components/card/TemplateCard";
import { adminRequester } from "@/shared/AdminRequester";
import useNavigate from "@/shared/hooks/useNavigate";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import FlexChild from "@/components/flex/FlexChild";
import clsx from "clsx";
import P from "@/components/P/P";
import usePageData from "@/shared/hooks/data/usePageData";
import Div from "@/components/div/Div";

export default function ContractCreatePage() {
  const navigate = useNavigate();

  const {
    templates,
    page,
    setPage,
    maxPage,
    isLoading,
  } = usePageData(
    "templates",
    (pageNumber) => ({
      origin_id: null,
      pageSize: 12,
      pageNumber,
      relations: ["pages"],
    }),
    (cond) => adminRequester.getContracts(cond),
    (d: any) =>
      Math.ceil(Number(d?.NumberOfTotalElements ?? d?.totalElements ?? 0) / 12),
    {
      onReprocessing: (d: any) => {
        const rows = Array.isArray(d?.content)
          ? d.content
          : Array.isArray(d)
          ? d
          : [];
        const count = Number(
          d?.NumberOfTotalElements ?? d?.totalElements ?? rows.length
        );
        return { rows, count };
      },
      fallbackData: { rows: [], count: 0 },
      revalidateOnMount: true,
    }
  );

  const list = templates?.rows ?? [];
  // console.log(list)
  return (
    <VerticalFlex className={styles.page}>
      <P className={styles.title}>템플릿으로 계약 작성</P>

      <Div className={styles.grid}>
        {isLoading ? (
          <P className={styles.loading}>로딩 중...</P>
        ) : list.length > 0 ? (
          list.map((tpl: any) => (
            <TemplateCard
              key={tpl.id}
              image={tpl.pages?.[0]?.image || "/resources/images/placeholder.png"}
              title={tpl.name}
              onCreate={() => navigate(`/contract/create/${tpl.id}`)}
            />
          ))
        ) : (
          <P className={styles.empty}>등록된 템플릿이 없습니다.</P>
        )}
      </Div>

      {maxPage > 0 && (
        <FlexChild className={styles.pageLine}>
          <HorizontalFlex
            width="max-content"
            justifyContent="center"
            gap={10}
          >
            <FlexChild
              className={clsx(styles.pageButton, styles.arrow, styles.arrowTwice)}
              onClick={() => setPage(0)}
            />
            <FlexChild
              className={clsx(styles.pageButton, styles.arrow)}
              onClick={() => setPage(Math.max(0, page - 1))}
            />

            {Array.from(
              { length: Math.min(10, maxPage - Math.floor(page / 10) * 10 + 1) },
              (_, i) => Math.floor(page / 10) * 10 + i
            ).map((index) => (
              <FlexChild
                key={`page_${index}`}
                className={clsx(styles.pageButton, {
                  [styles.selected]: index === page,
                })}
                onClick={() => setPage(index)}
              >
                <P width="100%">{index + 1}</P>
              </FlexChild>
            ))}

            <FlexChild
              className={clsx(styles.pageButton, styles.arrow, styles.arrowNext)}
              onClick={() => setPage(Math.min(maxPage, page + 1))}
            />
            <FlexChild
              className={clsx(
                styles.pageButton,
                styles.arrow,
                styles.arrowNext,
                styles.arrowTwice
              )}
              onClick={() => setPage(maxPage)}
            />
          </HorizontalFlex>
        </FlexChild>
      )}
    </VerticalFlex>
  );
}
