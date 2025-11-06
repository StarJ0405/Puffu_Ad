"use client";

import { useEffect, useMemo } from "react";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import Span from "@/components/span/Span";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import usePageData from "@/shared/hooks/data/usePageData";
import styles from "./page.module.css";

type ContractRow = {
  id: string;
  name: string;
  counterparty_name: string;
  period: string;
  status: string;
  updated_at: string;
};

export function ContractListClient() {
  // --- 데이터 로드 -------------------------------------------------
  const {
    data: contracts,
    origin,
    error,
    isLoading,
  } = usePageData(
    "contracts",
    (page) => ({
      pageNumber: page,
      pageSize: 20,
    }),
    (params) => adminRequester.getContracts(params),
    (data) => data?.totalPages || 1,
    {
      onReprocessing: (data) => data?.items || [],
      revalidateOnMount: true,
    }
  );

  // --- 목업 fallback ----------------------------------------------
  const dummyList: ContractRow[] = [
    {
      id: "con001",
      name: "크리에이터 전속계약",
      counterparty_name: "홍길동",
      period: "2025.01.01 ~ 2025.12.31",
      status: "active",
      updated_at: "2025-11-05T09:00:00Z",
    },
    {
      id: "con002",
      name: "외주 제작 계약",
      counterparty_name: "이몽룡",
      period: "2025.02.01 ~ 2025.07.31",
      status: "scheduled",
      updated_at: "2025-11-02T09:00:00Z",
    },
  ];

  const list: ContractRow[] = useMemo(() => {
    if (contracts && contracts.length > 0) return contracts;
    return dummyList;
  }, [contracts]);

  useEffect(() => {
    console.debug("[CONTRACT/LIST] fetched:", contracts || dummyList, origin);
  }, [contracts, origin]);

  // --- 렌더링 ------------------------------------------------------
  return (
    <VerticalFlex gap={15} alignItems="stretch" padding={50}>
      <P fontSize={18} fontWeight={600}>
        계약 목록
      </P>

      {isLoading && <P>로딩 중...</P>}
      {error && <P>데이터를 불러오는 중 오류가 발생했습니다.</P>}

      <VerticalFlex className={styles.contractList} gap={10}>
        <HorizontalFlex className={styles.header}>
          {["계약명", "피계약자", "기간", "상태", "최근 수정일"].map((h) => (
            <FlexChild key={h} justifyContent="center">
              <Span className={styles.tableHeader}>{h}</Span>
            </FlexChild>
          ))}
        </HorizontalFlex>

        {list.map((item) => (
          <HorizontalFlex
            key={item.id}
            justifyContent="space-between"
            className={styles.row}
          >
            <FlexChild justifyContent="center">
              <Span>{item.name}</Span>
            </FlexChild>
            <FlexChild justifyContent="center">
              <Span>{item.counterparty_name}</Span>
            </FlexChild>
            <FlexChild justifyContent="center">
              <Span>{item.period}</Span>
            </FlexChild>
            <FlexChild justifyContent="center">
              <Span>{item.status}</Span>
            </FlexChild>
            <FlexChild justifyContent="center">
              <Span>
                {new Date(item.updated_at).toLocaleDateString("ko-KR")}
              </Span>
            </FlexChild>
          </HorizontalFlex>
        ))}
      </VerticalFlex>
    </VerticalFlex>
  );
}
