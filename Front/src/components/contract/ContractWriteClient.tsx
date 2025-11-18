"use client";

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  Dispatch,
} from "react";
import { requester } from "@/shared/Requester";
import { fileRequester } from "@/shared/FileRequester";
import { dataURLtoFile, toast } from "@/shared/utils/Functions";
import VerticalFlex from "@/components/flex/VerticalFlex";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Button from "@/components/buttons/Button";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import styles from "./ContractWriteClient.module.css";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import clsx from "clsx";
import ContractInput from "@/app/admin/desktop/(main)/contract/template/regist/class";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useNavigate from "@/shared/hooks/useNavigate";

export default function ContractWriteClient({
  contract,
}: {
  contract: ContractData;
  }) {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [assigns, setAssigns] = useState<string[]>([]);
  const [requires, setRequires] = useState<string[]>([]);
  const [inputed, setInputed] = useState<string[]>([]);
  const [scale, setScale] = useState(100);
  const [saving, setSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputs = useRef<any[]>([]);
  const userContract = contract.contract_users.find(
    (u) => u.user_id === userData?.id
  );
  const approveStatus = userContract?.approve ?? "pending";
  const buttonText =
    approveStatus === "ready"
      ? "검토 완료"
      : approveStatus === "confirm"
      ? "완료됨"
      : "서명 완료";

  // ── 참여자별 입력권한 계산
  useEffect(() => {
    const user = contract.contract_users.find(
      (u) => u.user_id === userData?.id
    );
    setAssigns(
      contract.pages.flatMap((p) =>
        p.input_fields
          .filter((f) => f.metadata.data?.assign?.includes(user?.name))
          .map((f) => f.metadata.name)
      )
    );
    setRequires(
      contract.pages.flatMap((p) =>
        p.input_fields
          .filter(
            (f) =>
              f.metadata.data?.assign?.includes(user?.name) &&
              f.metadata.data?.require?.includes(user?.name)
          )
          .map((f) => f.metadata.name)
      )
    );
  }, [contract, userData]);

  // ── PDF 다운로드
  const exportAsPdf = async () => {
    const element = contentRef.current;
    if (!element) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const pages = element.querySelectorAll("[data-page]");

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      const canvas = await html2canvas(page, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
    pdf.save(`${contract.name}.pdf`);
    toast({ message: "PDF가 다운로드되었습니다." });
  };

  // ── 저장 / 서명 완료 or 검토 완료
  const handleSave = async () => {
    if (inputed.length < requires.length) {
      toast({ message: "필수 입력항목이 남아있습니다." });
      return;
    }

    setSaving(true);
    try {
      // 현재 사용자 상태
      const userContract = contract.contract_users.find(
        (u) => u.user_id === userData?.id
      );
      const approveStatus = userContract?.approve ?? "pending";

      // 필드 저장
      for (const page of contract.pages) {
        for (const field of page.input_fields) {
          if (assigns.includes(field.metadata.name)) {
            const val = await inputs.current[page.page]?.[
              field.metadata.name
            ]?.getValue?.();
            if (val)
              await requester.updateInputField(contract.id, field.id, val);
          }
        }
      }

      // 상태 갱신 분기
      if (approveStatus === "pending") {
        await requester.updateMyApproveStatus(contract.id, {
          approve: "ready",
        });
        toast({ message: "서명이 완료되었습니다." });
        setTimeout(() => {
          navigate(-1);
            }, 2000);
      } else if (approveStatus === "ready") {
        await requester.updateMyApproveStatus(contract.id, {
          approve: "confirm",
        });
        toast({ message: "검토가 완료되었습니다." });
        setTimeout(() => {
          navigate(-1);
            }, 2000);
      } else {
        toast({ message: "이미 완료된 계약입니다." });
      }
    } catch (err) {
      console.error(err);
      toast({ message: "저장 중 오류가 발생했습니다." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ── 헤더 */}
      <div id="contract_header" className={styles.header}>
        <HorizontalFlex
          justifyContent="space-between"
          alignItems="center"
          gap={10}
        >
          <P fontWeight={600}>{contract.name}</P>
          <HorizontalFlex gap={20} alignItems="center">
            <Image
              src="/resources/contract/file-download.svg"
              onClick={exportAsPdf}
              size={24}
            />

            <ScaleSelect
              value={scale}
              onChange={setScale}
              scales={[30, 50, 80, 100, 120, 150, 200, 300, 400]}
            />
            <Button
              styleType="admin2"
              onClick={handleSave}
              disabled={saving || approveStatus === "confirm"}
              className={styles.btnText}
            >
              {saving ? "저장 중..." : buttonText}
            </Button>
          </HorizontalFlex>
        </HorizontalFlex>
      </div>

      {/* ── 스크롤 본문 */}
      <div className={styles.scrollArea} ref={contentRef}>
        {contract.pages
          ?.sort((a, b) => a.page - b.page)
          .map((page, index) => (
            <FlexChild
              id={`page_${index}`}
              key={page.id}
              data-page
              position="relative"
              justifyContent="center"
              width={`calc(210mm * ${scale / 100})`}
              height={`calc(297mm * ${scale / 100})`}
              marginBottom={20}
            >
              <Image
                src={page.image}
                width={"210mm"}
                height={"297mm"}
                scale={scale / 100}
              />
              {page.input_fields.map((input, idx) => {
                const user = contract.contract_users.find(
                  (u) => u.user_id === userData?.id
                );
                const userApprove = user?.approve;
                const readonlyMode =
                  userApprove === "ready" || userApprove === "confirm";
                const editable =
                  assigns.includes(input.metadata.name) &&
                  !input.value &&
                  !readonlyMode;

                return (
                  <FloatInput
                    key={`${input.id}_${idx}`}
                    assign={editable}
                    require={requires.includes(input.metadata.name)}
                    input={input}
                    readonly={readonlyMode || !!input.value}
                    ref={(el) => {
                      if (!inputs.current[page.page])
                        inputs.current[page.page] = {
                          [input.metadata.name]: el,
                        };
                      else inputs.current[page.page][input.metadata.name] = el;
                    }}
                    updateInput={(status) => {
                      if (status)
                        setInputed((prev) =>
                          Array.from(new Set([...prev, input.metadata.name]))
                        );
                      else
                        setInputed((prev) =>
                          prev.filter((name) => name !== input.metadata.name)
                        );
                    }}
                  />
                );
              })}
            </FlexChild>
          ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* ScaleSelect                                   */
/* ───────────────────────────────────────────── */
function ScaleSelect({
  value,
  onChange,
  scales,
  className,
}: {
  value: number;
  onChange: Dispatch<React.SetStateAction<number>>;
  scales: number[];
  className?: string;
}) {
  const [fold, setFold] = useState(true);
  useEffect(() => {
    if (!fold) {
      const close = () => setFold(true);
      window.addEventListener("click", close);
      return () => window.removeEventListener("click", close);
    }
  }, [fold]);
  return (
    <FlexChild
      id="scaleSelect"
      className={clsx(styles.scaler, className)}
      gap={6}
      position="relative"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => setFold(false), 10);
      }}
    >
      <P>{value}%</P>
      <Image src="/resources/icons/down_arrow.png" width={12} height={"auto"} />
      <FlexChild hidden={fold} className={styles.list}>
        <VerticalFlex>
          {scales.map((s) => (
            <FlexChild
              key={s}
              className={styles.scale}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(s);
                setFold(true);
              }}
            >
              <P>{s}%</P>
            </FlexChild>
          ))}
        </VerticalFlex>
      </FlexChild>
    </FlexChild>
  );
}

/* ───────────────────────────────────────────── */
/* FloatInput                                   */
/* ───────────────────────────────────────────── */
const FloatInput = forwardRef(
  (
    {
      assign,
      require,
      input,
      updateInput,
      readonly,
    }: {
      assign: boolean;
      require: boolean;
      input: InputFieldData;
      updateInput: (status: boolean) => void;
      readonly?: boolean;
    },
    ref
  ) => {
    const divRef = useRef<any>(null);
    const timeoutRef = useRef<any>(null);
    const [ci, setCi] = useState<ContractInput>();
    const [value, setValue] = useState<any>(input.value ?? {});
    const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

    // Input Type 매칭
    useEffect(() => {
      let timer = 10;
      const interval = setInterval(() => {
        if (timer <= 0) clearInterval(interval);
        const _input = ContractInput.getList().find(
          (f: any) => f.getKey() === input.type
        );
        if (_input) {
          setCi(_input);
          clearInterval(interval);
        }
        timer--;
      }, 500);
    }, []);

    useImperativeHandle(ref, () => ({
      async getValue() {
        if (value) {
          async function transferFile(data: any) {
            await Promise.all(
              Object.keys(data).map(async (key) => {
                const v = data[key];
                if (
                  typeof v === "string" &&
                  v.startsWith("data:image/png;base64,")
                ) {
                  const file = dataURLtoFile(v, `${input.type}.png`);
                  const formData = new FormData();
                  formData.append("files", file);
                  const { urls } = await fileRequester.upload(formData);
                  data[key] = urls[0];
                } else if (typeof v === "object") {
                  data[key] = await transferFile(v);
                }
              })
            );
            return data;
          }
          return transferFile(value);
        }
        return {};
      },
      getTemp() {
        return value;
      },
    }));

    useEffect(() => {
      if (ci && require) updateInput(ci.isValid(input.metadata.data, value));
    }, [ci, value, require]);

    return (
      <FlexChild
        Ref={divRef}
        position="absolute"
        top={input.metadata.top}
        left={input.metadata.left}
        width={input.metadata.width}
        height={input.metadata.height}
        fontFamily={input.metadata.fontFamily}
        fontSize={input.metadata.fontSize}
        fontWeight={input.metadata.bold ? 700 : 500}
        fontStyle={input.metadata.italic ? "italic" : "normal"}
        textDecorationLine={input.metadata.underline ? "underline" : "none"}
        color={input.metadata.color}
        textAlign={input.metadata.align}
        alignItems={input.metadata.vertical}
        backgroundColor={input.metadata.backgroundColor}
        className={clsx({
          [styles.float]: assign,
          [styles.has]: ci?.isValid?.(input.metadata.data, value),
        })}
        pointerEvents={readonly ? "none" : assign ? undefined : "none"}
        opacity={readonly ? 0.8 : 1}
        onMouseEnter={() => {
          if (!input.metadata.data.tooltip) return;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setHover({
              x:
                divRef.current.getBoundingClientRect().x +
                divRef.current.getBoundingClientRect().width / 2,
              y:
                divRef.current.getBoundingClientRect().y +
                divRef.current.getBoundingClientRect().height / 2,
            });
          }, 1000);
        }}
        onMouseLeave={() => {
          setHover(null);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }}
      >
        {input.metadata.data.tooltip && hover && (
          <FlexChild
            zIndex={10}
            position="fixed"
            left={hover.x}
            top={hover.y}
            padding={10}
            border={"1px solid #d0d0d0"}
            borderRadius={5}
            backgroundColor="#fff"
            width={"max-content"}
            maxWidth={400}
            fontWeight={500}
            fontSize={16}
            color="#111"
          >
            <P whiteSpace="pre-wrap">{input.metadata.data.tooltip}</P>
          </FlexChild>
        )}
        {ci && (
          <ci.Write
            onChange={(val: any) => setValue(val)}
            {...value}
            data={input.metadata.data}
            width={input.metadata.width}
            height={input.metadata.height}
          />
        )}
      </FlexChild>
    );
  }
);
