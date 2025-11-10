"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { adminRequester } from "@/shared/AdminRequester";
import Button from "@/components/buttons/Button";
import P from "@/components/P/P";
import Image from "@/components/Image/Image";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import { toast } from "@/shared/utils/Functions";

export function DetailFrame({ initTemplate }: { initTemplate: any }) {
  const [template, setTemplate] = useState<any>(initTemplate);
  const [creating, setCreating] = useState(false);

  async function handleCreateContract() {
    try {
      setCreating(true);
      const contract = await adminRequester.createContract(template.id, {
        name: `${template?.name ?? "새 계약"} 복제본`,
      });
      toast({ message: "계약이 생성되었습니다." });
      console.log("Created:", contract);
      // TODO: navigate(`/admin/contract/${contract.id}`);
    } catch (e) {
      console.error(e); 
      toast({ message: "계약 생성에 실패했습니다." });
    } finally {
      setCreating(false);
    }
  }

  if (!template) return <P>템플릿 정보를 찾을 수 없습니다.</P>;

  return (
    <VerticalFlex className={styles.detail} alignItems="flex-start" gap={20}>
      <P className={styles.title}>{template.name}</P>

      <div className={styles.preview}>
        {template.pages?.map((p: any) => (
          <Image
            key={p.id}
            src={p.image}
            alt={`page-${p.page}`}
            className={styles.pageImage}
          />
        ))}
      </div>

      <HorizontalFlex gap={12}>
        <Button disabled={creating} onClick={handleCreateContract}>
          계약 생성하기
        </Button>
        <Button styleType="white" onClick={() => history.back()}>
          돌아가기
        </Button>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
