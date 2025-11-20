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
import useNavigate from "@/shared/hooks/useNavigate";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";

export default function Client() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [list, setList] = useState<ContractData[]>([]);

  const navigate = useNavigate();
  const getContractStatus = (contract: ContractData) => {
    return contract.completed_at ? "complete" : "pending";
  };

  const handleComplete = async (id: string) => {
    if (!confirm("모든 참여자의 서명이 완료되었습니까?")) return;
    try {
      await adminRequester.completeContract(id);
      toast({ message: "계약이 완료되었습니다." });
      await loadContracts();
    } catch (e) {
      toast({ message: "완료 처리 중 오류가 발생했습니다." });
      console.error(e);
    }
  };

  const getUserBadge = (cu: ContractUserData, is_delete?: boolean) => {
    if (is_delete) {
      return (
        <Span className={clsx(styles.badge, styles.deleted)}>파기된 계약</Span>
      );
    }
    return (
      <Span
        className={clsx(styles.badge, {
          [styles.active]: cu.approve === "pending",
          [styles.ready]: cu.approve === "ready",
          [styles.complete]: cu.approve === "confirm",
        })}
      >
        {cu.approve === "pending"
          ? "서명 진행 중"
          : cu.approve === "ready"
          ? "서명 완료"
          : "검토 완료"}
      </Span>
    );
  };

  const loadContracts = async () => {
    let statusFilter: any = {};

    if (status === "pending") {
      statusFilter = {
        completed_at: null,
        is_delete: null,
      };
    } else if (status === "complete") {
      statusFilter = {
        completed_at__not: null,
      };
    } else if (status === "delete") {
      statusFilter = {
        is_delete__not: null,
      };
    }

    const res = await adminRequester.getContracts({
      q: search,
      pageSize: 20,
      origin_id__not: null,
      relations: ["contract_users", "contract_users.user"],
      ...statusFilter,
    });

    setList(res?.content ?? []);
  };

  useEffect(() => {
    loadContracts();
  }, [search, status]);

  return (
    <VerticalFlex className={styles.wrapper}>
      {/* Header */}
      <HorizontalFlex
        justifyContent="space-between"
        alignItems="center"
        className={styles.header}
      >
        <P className={styles.title}>전자계약 목록</P>
        <Button styleType="admin2" onClick={() => navigate("/contract/create")}>
          새 계약 등록
        </Button>
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
        <FlexChild>
          <Select
            width="160px"
            placeholder="전체 상태"
            options={[
              { display: "전체 상태", value: "" },
              { display: "진행 중", value: "pending" },
              { display: "완료", value: "complete" },
              { display: "파기", value: "delete" },
            ]}
            onChange={(v) => setStatus(String(v))}
          />
        </FlexChild>
        <FlexChild>
          <Button styleType="admin" onClick={loadContracts}>
            검색
          </Button>
        </FlexChild>
      </HorizontalFlex>

      {/* List */}
      <VerticalFlex gap={8} className={styles.listBox} alignItems="flex-start">
        {list.length === 0 && <P>계약 데이터가 없습니다.</P>}

        {list.map((contract) => {
          const adminUser = contract.contract_users.find(
            (u) => u.user?.role === "admin"
          );
          const otherUsers = contract.contract_users.filter(
            (u) => u.user?.role !== "admin"
          );
          const allParticipantsConfirmed = otherUsers.every(
            (u) => u.approve === "confirm"
          );

          const isAdminPending = adminUser?.approve === "pending";
          const isAdminReady = adminUser?.approve === "ready";
          const isAdminConfirm = adminUser?.approve === "confirm";

          const state = getContractStatus(contract);
          const users = contract.contract_users ?? [];

          const is_complete = !!contract.completed_at;
          const is_delete = !!contract.is_delete;

          let statusClass = styles.active;
          let statusText = "계약 진행 중";

          if (is_delete) {
            statusClass = styles.deleted;
            statusText = "파기된 계약";
          } else if (is_complete) {
            statusClass = styles.complete;
            statusText = "계약 완료";
          }

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
                      <HorizontalFlex key={cu.id} gap={8} alignItems="center">
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
                          <Div>{getUserBadge(cu, is_delete)}</Div>
                        </FlexChild>
                      </HorizontalFlex>
                    ))}
                  </VerticalFlex>
                </VerticalFlex>

                {/* 우측 영역 */}
                <VerticalFlex alignItems="flex-end" gap={8}>
                  <Span className={clsx(styles.badge, statusClass)}>
                    {statusText}
                  </Span>

                  <P className={styles.date}>
                    {new Date(contract.created_at).toLocaleDateString("ko-KR")}
                  </P>

                  <HorizontalFlex gap={6} justifyContent="flex-end">
                    {/* 삭제 버튼: 항상 보임 (Modal Confirm) */}
                    <Button
                      hidden={is_delete}
                      styleType="admin2"
                      className={styles.deleteBtn}
                      onClick={() => {
                        NiceModal.show("confirm", {
                          message: "정말로 이 계약을 파기하시겠습니까?",
                          confirmText: "확인",
                          withCloseButton: true,
                          onConfirm: async () => {
                            try {
                              await adminRequester.deleteContract(contract.id);
                              toast({ message: "계약이 파기되었습니다." });
                              await loadContracts();
                            } catch (e) {
                              toast({
                                message: "파기 중 오류가 발생했습니다.",
                              });
                              console.error(e);
                            }
                          },
                        });
                      }}
                    >
                      파기
                    </Button>
                    {/* 보기 버튼: 항상 가능 */}
                    <Button
                      styleType="admin2"
                      onClick={() => navigate(`/contract/list/${contract.id}`)}
                    >
                      보기
                    </Button>
                    <FlexChild flexGrow={0} width={"auto"} hidden={is_delete}>
                      {/* 상태별 버튼 분기 */}
                      {contract.completed_at ? (
                        <Button styleType="admin2" disabled>
                          계약 완료
                        </Button>
                      ) : isAdminPending ? (
                        <Button
                          styleType="admin2"
                          onClick={() =>
                            navigate(`/contract/list/${contract.id}`)
                          }
                        >
                          서명 및 확인
                        </Button>
                      ) : isAdminReady && !allParticipantsConfirmed ? (
                        <Button styleType="admin2" disabled>
                          참여자 검토 중
                        </Button>
                      ) : isAdminReady && allParticipantsConfirmed ? (
                        <Button
                          styleType="admin2"
                          onClick={() =>
                            navigate(`/contract/list/${contract.id}`)
                          }
                        >
                          검토하기
                        </Button>
                      ) : isAdminConfirm && !contract.completed_at ? (
                        <Button
                          styleType="admin2"
                          onClick={() => handleComplete(contract.id)}
                        >
                          계약 완료처리
                        </Button>
                      ) : null}
                    </FlexChild>
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
