"use client";

import Button from "@/components/buttons/Button";
import TemplateCard from "@/components/card/TemplateCard";
import FlexChild from "@/components/flex/FlexChild";
import FlexGrid from "@/components/flex/FlexGrid";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import usePageData from "@/shared/hooks/data/usePageData";
import useNavigate from "@/shared/hooks/useNavigate";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useMemo } from "react";
import styles from "./page.module.css";

export function TemplateManagementClient() {
  const navigate = useNavigate();
  const key = useMemo(() => "templates", []);
  const {
    [key]: pageData,
    page,
    setPage,
    maxPage,
    isLoading,
    mutate,
  } = usePageData(
    key,
    (pageNumber) => ({
      origin_id: null,
      pageSize: 10,
      pageNumber,
      relations: ["pages"],
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

      <VerticalFlex className={styles.body} gap={6} borderRadius={14}>
        {/* 템플릿 그리드 */}
        {!isLoading && templates?.length > 0 ? (
          <FlexGrid columns={3} paddingTop={20} paddingBottom={10}>
            {templates.map((tpl: any) => (
              <FlexChild
                key={tpl.id}
                justifyContent="center"
                alignItems="center"
                paddingBottom={15}
              >
                <TemplateCard
                  key={tpl.id}
                  image={
                    tpl.pages?.[0]?.image || "/resources/images/placeholder.png"
                  }
                  title={tpl.name}
                  onCreate={() =>
                    navigate(`/contract/template/management/create/${tpl.id}`)
                  }
                  onEdit={() =>
                    navigate(`/contract/template/management/edit/${tpl.id}`)
                  }
                  onDelete={() =>
                    NiceModal.show("confirm", {
                      message: "이 템플릿을 삭제하시겠습니까?",
                      confirmText: "삭제",
                      cancelText: "취소",
                      withCloseButton: true,
                      onConfirm: async () => {
                        await adminRequester.deleteContract(tpl.id);
                        toast({ message: "삭제되었습니다." });
                        mutate();
                      },
                    })
                  }
                />
              </FlexChild>
            ))}
          </FlexGrid>
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
