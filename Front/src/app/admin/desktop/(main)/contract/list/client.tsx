"use client";

import { useEffect, useState } from "react";
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
  // usePageData는 실제 API 호출
  const {
    contracts,
    origin,
    error,
    isLoading,
    mutate,
    page,
    setPage,
    maxPage,
    hasNext,
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

  // 렌더링용 목업 데이터
  const [list, setList] = useState<ContractRow[]>([]);

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

  useEffect(() => {
    // 실제 API 결과는 로그로 확인
    console.debug("[CONTRACT] fetched:", contracts, origin);

    // 렌더링은 목업 데이터 기준
    setList(dummyList);
  }, []);

  return (
    <VerticalFlex gap={15} alignItems="stretch" padding={50}>
      <P fontSize={18} fontWeight={600}>
        계약 목록
      </P>

      {isLoading && <P>로딩 중...</P>}
      {error && <P>데이터를 불러오는 중 오류가 발생했습니다.</P>}

      <VerticalFlex className="contract-list" gap={10}>
        <HorizontalFlex className="header">
          <FlexChild justifyContent="center">
            <Span className={styles.tableHeader}>계약명</Span>
          </FlexChild>
          <FlexChild justifyContent="center">
            <Span className={styles.tableHeader}>피계약자</Span>
          </FlexChild>
          <FlexChild justifyContent="center">
            <Span className={styles.tableHeader}>기간</Span>
          </FlexChild>
          <FlexChild justifyContent="center">
            <Span className={styles.tableHeader}>상태</Span>
          </FlexChild>
          <FlexChild justifyContent="center">
            <Span className={styles.tableHeader}>최근 수정일</Span>
          </FlexChild>
        </HorizontalFlex>

        {list.map((item) => (
          <HorizontalFlex
            key={item.id}
            justifyContent="space-between"
            className="row"
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
              <Span>{item.updated_at}</Span>
            </FlexChild>
          </HorizontalFlex>
        ))}
      </VerticalFlex>
    </VerticalFlex>
  );
}
