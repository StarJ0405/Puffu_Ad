"use client";

import { useEffect, useState } from "react";
import VerticalFlex from "@/components/flex/VerticalFlex";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import Input from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Select from "@/components/select/Select";
import { adminRequester } from "@/shared/AdminRequester";
import { toast } from "@/shared/utils/Functions";
import usePageData from "@/shared/hooks/data/usePageData";
import styles from "./page.module.css";

type TemplateOption = {
  id: string;
  name: string;
  body: string;
};

type CounterpartyOption = {
  id: string;
  name: string;
};

export function ContractCreateClient() {
  // --- state --------------------------------------------------------
  const [templateId, setTemplateId] = useState<string | undefined>();
  const [counterpartyId, setCounterpartyId] = useState<string | undefined>();
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [payoutRate, setPayoutRate] = useState<number | "">("");
  const [body, setBody] = useState("");

  // --- data fetch (템플릿 / 피계약자) -------------------------------
  const {
    contract_templates: templates,
  } = usePageData(
    "contract_templates",
    (page) => ({ pageNumber: page, pageSize: 50 }),
    (params) => adminRequester.getContractTemplates(params),
    (data) => data?.totalPages || 1,
    { onReprocessing: (data) => data?.items || [], revalidateOnMount: true }
  );

  const {
    counterparties,
  } = usePageData(
    "counterparties",
    (page) => ({ pageNumber: page, pageSize: 50 }),
    (params) => adminRequester.getCounterparties(params),
    (data) => data?.totalPages || 1,
    { onReprocessing: (data) => data?.items || [], revalidateOnMount: true }
  );

  // --- 템플릿 선택 시 본문 자동 로드 -------------------------------
  useEffect(() => {
    if (!templateId) return;
    const selected = templates?.find((t: TemplateOption) => t.id === templateId);
    if (selected) setBody(selected.body || "");
  }, [templateId, templates]);

  // --- submit -------------------------------------------------------
  const handleSubmit = async () => {
    if (!templateId || !counterpartyId || !startsAt || !endsAt) {
      toast({ message: "필수 항목을 모두 입력하세요." });
      return;
    }

    const payload = {
      store_id: "store001", // 추후 실제 store_id 연동
      template_id: templateId,
      counterparty_id: counterpartyId,
      starts_at: startsAt,
      ends_at: endsAt,
      payout_rate: payoutRate || 0,
      body,
    };

    console.debug("[CONTRACT/CREATE] payload:", payload);
    try {
      // await adminRequester.createContract(payload);
      toast({ message: "계약 생성 API 호출 (목업)" });
    } catch (e) {
      console.error(e);
      toast({ message: "계약 생성 실패" });
    }
  };

  // --- render -------------------------------------------------------
  return (
    <VerticalFlex gap={20} padding={50}>
      <P fontSize={18} fontWeight={600}>
        계약 작성
      </P>

      <VerticalFlex gap={15}>
        {/* 템플릿 선택 */}
        <HorizontalFlex alignItems="center" gap={10}>
          <P width={120}>템플릿 선택</P>
          <FlexChild>
            <Select
              options={(templates || []).map((t: TemplateOption) => ({
                value: t.id,
                display: t.name,
              }))}
              value={templateId}
              onChange={(v) => setTemplateId(v as string)}
              placeholder="계약서 템플릿 선택"
              width="250px"
            />
          </FlexChild>
        </HorizontalFlex>

        {/* 피계약자 선택 */}
        <HorizontalFlex alignItems="center" gap={10}>
          <P width={120}>피계약자</P>
          <FlexChild>
            <Select
              options={(counterparties || []).map((c: CounterpartyOption) => ({
                value: c.id,
                display: c.name,
              }))}
              value={counterpartyId}
              onChange={(v) => setCounterpartyId(v as string)}
              placeholder="피계약자 선택"
              width="250px"
            />
          </FlexChild>
        </HorizontalFlex>

        {/* 기간 */}
        <HorizontalFlex alignItems="center" gap={10}>
          <P width={120}>계약 기간</P>
          <Input
            type="date"
            value={startsAt}
            onChange={(value: string | number) => setStartsAt(String(value))}
          />
          <Span>~</Span>
          <Input
            type="date"
            value={endsAt}
            onChange={(value: string | number) => setStartsAt(String(value))}
          />
        </HorizontalFlex>

        {/* 지급률 */}
        <HorizontalFlex alignItems="center" gap={10}>
          <P width={120}>지급률(%)</P>
          <Input
            type="number"
            value={payoutRate}
            onChange={(value: string | number) => setStartsAt(String(value))}
            placeHolder="0~100"
          />
        </HorizontalFlex>

        {/* 본문 미리보기 */}
        {body && (
          <VerticalFlex gap={5}>
            <P fontWeight={500}>계약 본문 (템플릿 기반)</P>
            <div className={styles.previewBox}>
              <div
                className={styles.previewBody}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          </VerticalFlex>
        )}

        {/* 버튼 영역 */}
        <HorizontalFlex justifyContent="flex-end" gap={10}>
          <Button styleType="white" onClick={() => history.back()}>
            취소
          </Button>
          <Button styleType="admin" onClick={handleSubmit}>
            저장
          </Button>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
