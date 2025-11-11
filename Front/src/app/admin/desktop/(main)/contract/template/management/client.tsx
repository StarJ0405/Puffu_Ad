"use client";

import { useEffect, useMemo } from "react";
import styles from "./page.module.css";
import { adminRequester } from "@/shared/AdminRequester";
import Button from "@/components/buttons/Button";
import P from "@/components/P/P";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import FlexChild from "@/components/flex/FlexChild";
import clsx from "clsx";
import usePageData from "@/shared/hooks/data/usePageData";
import useNavigate from "@/shared/hooks/useNavigate";

export function TemplateManagementClient() {
  const navigate = useNavigate();
  const key = useMemo(() => "templates", []);
  const {
    [key]: pageData,
    page,
    setPage,
    maxPage,
    isLoading,
  } = usePageData(
    key,
    (pageNumber) => ({
      origin_id: null,
      pageSize: 10,
      pageNumber,
    }),
    (cond) => adminRequester.getContracts(cond),
    (d: any) =>
      Math.ceil(Number(d?.NumberOfTotalElements ?? d?.totalElements ?? 0) / 10),
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

  const templates = pageData?.rows ?? [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <VerticalFlex className={styles.page} gap={20}>
      {/* 헤더 */}
      <HorizontalFlex justifyContent="space-between" alignItems="center">
        <P className={styles.title}>템플릿 관리</P>
        <Button
          styleType="admin"
          onClick={() => navigate("/contract/template/regist")}
        >
          새 템플릿 만들기
        </Button>
      </HorizontalFlex>

      {/* 테이블 헤더 */}
      <HorizontalFlex className={styles.headerRow} alignItems="center">
        <FlexChild flex="1.5" justifyContent="center">
          <P className={styles.headerText}>이름</P>
        </FlexChild>
        <FlexChild flex="1" justifyContent="center">
          <P className={styles.headerText}>최근 수정일</P>
        </FlexChild>
        <FlexChild flex="0.5" justifyContent="center">
          <P className={styles.headerText}>설정</P>
        </FlexChild>
      </HorizontalFlex>

      {/* 테이블 바디 */}
      <VerticalFlex className={styles.body} gap={6}>
        {!isLoading && templates?.length > 0 ? (
          templates.map((tpl: any) => (
            <HorizontalFlex
              key={tpl.id}
              alignItems="center"
              className={styles.row}
            >
              <FlexChild flex="1.5" justifyContent="center">
                <P>{tpl.name}</P>
              </FlexChild>
              <FlexChild flex="1" justifyContent="center">
                <P className={styles.date}>
                  {new Date(tpl.updated_at).toLocaleDateString()}
                </P>
              </FlexChild>
              <FlexChild flex="0.5" justifyContent="center">
                <Button
                  styleType="white"
                  onClick={() => navigate(`/contract/template/management/${tpl.id}`)}
                >
                  설정
                </Button>
              </FlexChild>
            </HorizontalFlex>
          ))
        ) : (
          <P className={styles.empty}>등록된 템플릿이 없습니다.</P>
        )}
      </VerticalFlex>

      {/* 페이지네이션 */}
      {maxPage > 0 && (
        <FlexChild className={styles.pageLine}>
          <HorizontalFlex
            width="max-content"
            justifyContent="center"
            alignItems="center"
            gap={10}
          >
            <FlexChild
              className={clsx(
                styles.pageButton,
                styles.arrow,
                styles.arrowTwice
              )}
              onClick={() => setPage(0)}
            />
            <FlexChild
              className={clsx(styles.pageButton, styles.arrow)}
              onClick={() => setPage(Math.max(0, page - 1))}
            />

            {Array.from(
              {
                length: Math.min(10, maxPage - Math.floor(page / 10) * 10 + 1),
              },
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
              className={clsx(
                styles.pageButton,
                styles.arrow,
                styles.arrowNext
              )}
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
