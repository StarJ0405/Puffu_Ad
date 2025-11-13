"use client";

import styles from "./page.module.css";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Input from "@/components/inputs/Input";
import Select from "@/components/select/Select";
import { useEffect, useState } from "react";
import { adminRequester } from "@/shared/AdminRequester";
import Div from "@/components/div/Div";
import clsx from "clsx";

export default function Client() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [list, setList] = useState<ContractData[]>([]);

  const getContractStatus = (contract: ContractData) => {
    return contract.completed_at ? "complete" : "pending";
  };

  const handleReview = async (id: string, user_id: string) => {
    if (!confirm("모든 참여자의 작성 내용이 검토되었습니까?")) return;
    await adminRequester.updateContractUserStatus(id, {
      user_id,
      status: "confirm",
    });
    await loadContracts();
  };

  const handleComplete = async (id: string) => {
    if (!confirm("모든 참여자의 서명이 완료되었습니까?")) return;
    await adminRequester.completeContract(id);
    await loadContracts();
  };

  const getUserBadge = (cu: ContractUserData) => {
    return (
      <Span
        className={clsx(styles.badge, {
          [styles.active]: cu.approve === "pending",
          [styles.ready]: cu.approve === "ready",
          [styles.complete]: cu.approve === "confirm",
        })}
      >
        {cu.approve === "pending"
          ? "진행 중"
          : cu.approve === "ready"
          ? "검토 중"
          : "검토 완료"}
      </Span>
    );
  };

  const loadContracts = async () => {
    const res = await adminRequester.getContracts({
      q: search,
      pageSize: 20,
      origin_id__not: null,
      relations: ["contract_users", "contract_users.user"],
    });
    setList(res?.content ?? []);
  };

  useEffect(() => {
    loadContracts();
  }, []);

  return (
    <VerticalFlex className={styles.wrapper}>
      {/* Header */}
      <HorizontalFlex
        justifyContent="space-between"
        alignItems="center"
        className={styles.header}
      >
        <P className={styles.title}>전자계약 목록</P>
        <Button styleType="admin2">새 계약 등록</Button>
      </HorizontalFlex>

      {/* Filter */}
      <HorizontalFlex
        gap={10}
        className={styles.filterBox}
        justifyContent="flex-start"
      >
        <Input
          placeHolder="계약명 / 참여자 검색"
          value={search}
          onChange={(value) => setSearch(String(value))}
          width="250px"
        />

        <Select
          width="160px"
          placeholder="전체 상태"
          options={[
            { display: "전체 상태", value: "" },
            { display: "진행 중", value: "pending" },
            { display: "완료", value: "complete" },
          ]}
          onChange={(v) => setStatus(String(v))}
        />

        <Button styleType="admin" onClick={loadContracts}>
          검색
        </Button>
      </HorizontalFlex>

      {/* List */}
      <VerticalFlex gap={8} className={styles.listBox} alignItems="flex-start">
        {list.length === 0 && <P>계약 데이터가 없습니다.</P>}

        {list.map((contract) => {
          const state = getContractStatus(contract);
          const users = contract.contract_users ?? [];
          const isAllReady = users
            .slice(1)
            .every((u) => u.approve !== "pending"); // 발송자 제외

          return (
            <FlexChild key={contract.id} className={styles.card}>
              <HorizontalFlex
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <VerticalFlex alignItems="flex-start" gap={5}>
                  <P className={styles.contractName}>{contract.name}</P>

                  <VerticalFlex alignItems="flex-start" gap={5}>
                    {users.map((cu, idx) => (
                      <HorizontalFlex
                        key={cu.id}
                        gap={8}
                        alignItems="center"
                        justifyContent="flex_start"
                      >
                        <FlexChild flexGrow={1} width="auto" minWidth={"120px"}>
                          <P>
                            {cu.name}
                            {cu.user?.name && (
                              <>
                                {" : "}
                                {cu.user.name}
                              </>
                            )}
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <Div>{getUserBadge(cu)}</Div>
                        </FlexChild>
                      </HorizontalFlex>
                    ))}
                  </VerticalFlex>
                </VerticalFlex>

                {/* 우측 영역 */}
                <VerticalFlex alignItems="flex-end" gap={8}>
                  <Span
                    className={clsx(styles.badge, {
                      [styles.complete]: contract.completed_at,
                      [styles.active]: !contract.completed_at,
                    })}
                  >
                    {contract.completed_at ? "계약 완료" : "계약 진행 중"}
                  </Span>

                  <P className={styles.date}>
                    {new Date(contract.created_at).toLocaleDateString("ko-KR")}
                  </P>

                  <HorizontalFlex gap={6} justifyContent="flex-end">
                    <Button styleType="admin2">보기</Button>

                    {/* 모든 참여자가 ready일 때만 관리자 검토 버튼 노출 */}
                    {!contract.completed_at && isAllReady && (
                      <Button
                        styleType="admin2"
                        onClick={() => handleComplete(contract.id)}
                      >
                        검토 완료
                      </Button>
                    )}
                  </HorizontalFlex>
                </VerticalFlex>
              </HorizontalFlex>
            </FlexChild>
          );
        })}
      </VerticalFlex>
    </VerticalFlex>
  );
}
