"use client";

import styles from "./page.module.css";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import { useEffect, useState } from "react";
import useNavigate from "@/shared/hooks/useNavigate";
import { adminRequester } from "@/shared/AdminRequester";
import Select from "@/components/select/Select";
import Div from "@/components/div/Div";

export default function Client({ contract }: { contract: ContractData }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const res = await adminRequester.getUsers({ role: "vendor" });
      setUsers(res?.content ?? []);
    })();
  }, []);

  const handleSelect = (userId: string) => {
    if (userId && !participants.includes(userId)) {
      setParticipants((prev) => [...prev, userId]);
    }
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((id) => id !== userId));
  };

  const handleNext = () => {
    const required = (contract.contract_users?.length ?? 1) - 1;
    const selected = participants.length;

    if (selected !== required) {
      alert(`이 계약에는 총 ${required}명의 참여자가 필요합니다.`);
      return;
    }

    const params = new URLSearchParams();
    params.set("contract_id", contract.id);
    params.set("user_ids", participants.join(","));
    navigate(`/contract/create/temp/${contract.id}?${params.toString()}`);
  };

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((p) => Math.max(0, p - 1));
  };

  const handleNextPage = () => {
    if (!contract.pages) return;
    setCurrentPage((p) => Math.min(contract.pages.length - 1, p + 1));
  };

  return (
    <HorizontalFlex className={styles.page}>
      {/* 왼쪽: 미리보기 */}
      <FlexChild flex="1" className={styles.previewSection}>
        <VerticalFlex alignItems="center" justifyContent="center" gap={20}>
          <P className={styles.title}>{contract.name}</P>
          <Div className={styles.previewBox}>
            {contract.pages && contract.pages.length > 0 ? (
              <Div className={styles.imageWrapper}>
                <Button
                  className={`${styles.navBtn} ${styles.left}`}
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                >
                  ‹
                </Button>

                <Image
                  src={contract.pages[currentPage].image}
                  className={styles.previewImage}
                  alt={`page-${currentPage + 1}`}
                />

                <Button
                  className={`${styles.navBtn} ${styles.right}`}
                  onClick={handleNextPage}
                  disabled={currentPage === contract.pages.length - 1}
                >
                  ›
                </Button>
              </Div>
            ) : (
              <P>페이지 이미지가 없습니다.</P>
            )}

            <P className={styles.pageIndicator}>
              {currentPage + 1} / {contract.pages?.length ?? 0}
            </P>
          </Div>
        </VerticalFlex>
      </FlexChild>

      {/* 오른쪽: 참여자 설정 */}
      <FlexChild flex="1" className={styles.participantSection}>
        <VerticalFlex gap={20}>
          <P className={styles.subTitle}>
            참여자 설정 ({(contract.contract_users?.length ?? 1) - 1}명)
          </P>

          <div className={styles.row}>
            <P>발송자</P>
            <input className={styles.input} value="관리자" disabled />
          </div>

          <Div className={styles.row}>
            <P>참여자 선택</P>
            <Select
              width="100%"
              placeholder="참여자를 선택하세요"
              options={users.map((u) => ({
                value: u.id,
                display: u.name,
              }))}
              onChange={(val) => {
                if (typeof val === "string") handleSelect(val);
              }}
            />
          </Div>

          {participants.map((id) => {
            const user = users.find((u) => u.id === id);
            return (
              <P
                key={id}
                className={styles.participantTag}
                onClick={() => removeParticipant(id)}
              >
                {user?.name ?? id} ✕
              </P>
            );
          })}

          <Button
            styleType="admin"
            className={styles.nextBtn}
            onClick={handleNext}
          >
            다음 단계로
          </Button>
        </VerticalFlex>
      </FlexChild>
    </HorizontalFlex>
  );
}
