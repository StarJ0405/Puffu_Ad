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
import { adminRequester } from "@/shared/AdminRequester";
import { fileRequester } from "@/shared/FileRequester";
import {
  dataURLtoFile,
  exportAsPdf,
  pageToDataURL,
  toast,
  parseCalc,
} from "@/shared/utils/Functions";
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
import NiceModal from "@ebay/nice-modal-react";
import Span from "../span/Span";

export default function ContractWriteClient({
  contract,
  mode = "user",
  readOnly = false,
}: {
  contract: ContractData;
  mode?: "user" | "admin";
  readOnly?: boolean;
}) {
  const [isViewMode, setIsViewMode] = useState<boolean | null>(null);
  const requesterInstance = mode === "admin" ? adminRequester : requester;
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [assigns, setAssigns] = useState<string[]>([]);
  const [requires, setRequires] = useState<string[]>([]);
  const [inputed, setInputed] = useState<string[]>([]);
  const [scale, setScale] = useState(100);
  const [saving, setSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputs = useRef<any[]>([]);
  const isComplete = !!contract.completed_at;
  const isDeleted = !!contract.is_delete;
  const openRef = useRef<Window>(null);
  const userContract =
    mode === "admin"
      ? contract.contract_users.find((u) => u.user?.role === "admin")
      : contract.contract_users.find((u) => u.user_id === userData?.id);
  const approveStatus = userContract?.approve ?? "pending";
  const buttonText =
    approveStatus === "ready"
      ? "검토 완료"
      : approveStatus === "confirm"
      ? "완료됨"
      : "서명 및 확인 완료";

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

  // ── 저장 / 서명 완료 or 검토 완료
  const handleSave = async () => {
    if (isViewMode || isComplete || isDeleted) {
      navigate(-1);
      return;
    }
    if (inputed.length < requires.length) {
      toast({ message: "필수 입력항목이 남아있습니다." });
      return;
    }

    setSaving(true);
    try {
      const isAdmin = mode === "admin" || userData?.role === "admin";
      // 필드 저장 (공통)
      for (const page of contract.pages) {
        for (const field of page.input_fields) {
          if (assigns.includes(field.metadata.name)) {
            const val = await inputs.current[page.page]?.[
              field.metadata.name
            ]?.getValue?.();
            if (val)
              await requesterInstance.updateInputField(
                contract.id,
                field.id,
                val
              );
          }
        }
      }
      if (isAdmin) {
        const allParticipantsReady = contract.contract_users
          .filter((u) => u.user?.role !== "admin")
          .every((u) => ["ready", "confirm"].includes(u.approve));
        if (approveStatus === "pending") {
          await requesterInstance.updateApproveStatus(contract.id, {
            approve: "ready",
            user_id: userContract?.user_id,
          });
          toast({ message: "관리자 서명 및 확인이 완료되었습니다." });
        } else if (approveStatus === "ready" && allParticipantsReady) {
          await requesterInstance.updateApproveStatus(contract.id, {
            approve: "confirm",
            user_id: userContract?.user_id,
          });
          toast({ message: "검토가 완료되었습니다." });
        } else if (approveStatus === "ready" && !allParticipantsReady) {
          toast({ message: "아직 모든 참여자가 서명을 완료하지 않았습니다." });
        } else if (approveStatus === "confirm") {
          toast({ message: "이미 검토가 완료된 계약입니다." });
        } else {
          toast({ message: "이미 완료된 계약입니다." });
        }
      } else {
        // 일반 사용자
        if (approveStatus === "pending") {
          await requesterInstance.updateApproveStatus(contract.id, {
            approve: "ready",
          });
          toast({ message: "서명 및 확인이 완료되었습니다." });
        } else if (approveStatus === "ready") {
          await requesterInstance.updateApproveStatus(contract.id, {
            approve: "confirm",
          });
          toast({ message: "검토가 완료되었습니다." });
        } else {
          toast({ message: "이미 완료된 계약입니다." });
        }
      }

      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      console.error(err);
      toast({ message: "저장 중 오류가 발생했습니다." });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setIsViewMode(q.get("view") === "readonly");
  }, []);
  return (
    <div className={styles.wrapper} style={{ color: "black" }}>
      {/* ── 헤더 */}
      <div id="contract_header" className={styles.header}>
        <HorizontalFlex
          justifyContent="space-between"
          alignItems="center"
          gap={10}
        >
          <P fontWeight={600} color="#e7e7e7">
            {contract.name}
          </P>
          <HorizontalFlex gap={20} alignItems="center">
            <Image
              src="/resources/contract/file-download.svg"
              style={{
                filter: "brightness(0) invert(1)",
              }}
              onClick={() =>
                NiceModal.show("confirm", {
                  message: `${contract.name}을 다운로드 하시겠습니까?`,
                  confirmText: "다운로드",
                  cancelText: "취소",
                  onConfirm: async () => {
                    const pages = contract.pages.map((_, index) => {
                      const page = document.getElementById(`page_${index}`);
                      if (page) page.className = styles.print;
                      return page;
                    });
                    const uploads = contract.pages
                      .map((page) =>
                        page.input_fields
                          .filter((f) => f.type === "upload")
                          .map((input) => {
                            const files =
                              inputs.current?.[page.page]?.[
                                input.metadata.name
                              ]?.getTemp()?.value?.files || [];
                            return files
                              .map((file: any) =>
                                file.images.map((_: any, idx: number) =>
                                  document.getElementById(`${input.id}_${idx}`)
                                )
                              )
                              .flat();
                          })
                          .flat()
                      )
                      .flat()
                      .filter((f) => f !== null);

                    await exportAsPdf(
                      [...pages.filter((f) => f !== null), ...(uploads || [])],
                      contract.name
                    );
                    pages.forEach((page) => {
                      if (page) page.className = "";
                    });
                  },
                })
              }
              size={24}
            />
            <Image
              src="/resources/contract/print.svg"
              size={24}
              onClick={async () => {
                const pages = contract.pages.map((_, index) =>
                  document.getElementById(`page_${index}`)
                );
                const images = await pageToDataURL(
                  pages
                    .filter((f) => f !== null)
                    .map((page) => {
                      page.classList.add(styles.print);
                      return page;
                    })
                );
                pages
                  .filter((f) => f !== null)
                  .map((page) => {
                    page.classList.remove(styles.print);
                    return page;
                  });
                /* console.log(
                  contract.pages
                    .map((page) =>
                      page.input_fields
                        .filter((f) => f.type === "upload")
                        .map((input) => {
                          const files =
                            inputs.current?.[page.page]?.[
                              input.metadata.name
                            ]?.getTemp()?.value?.files || [];
                          return files.map((file: any) =>
                            file.images.map((_: any, idx: number) =>
                              document.getElementById(`${input.id}_${idx}`)
                            )
                          );
                        })
                        .flat()
                    )
                    .flat()
                    .filter((f) => f !== null)
                ); */
                const upload_pages = contract.pages
                  .map((page) =>
                    page.input_fields
                      .filter((f) => f.type === "upload")
                      .map((input) => {
                        const files =
                          inputs.current?.[page.page]?.[
                            input.metadata.name
                          ]?.getTemp()?.value?.files || [];
                        return files
                          .map((file: any) =>
                            file.images.map((_: any, idx: number) =>
                              document.getElementById(`${input.id}_${idx}`)
                            )
                          )
                          .flat();
                      })
                      .flat()
                  )
                  .flat()
                  .filter((f) => f !== null);

                const uploads = upload_pages?.length
                  ? await pageToDataURL(upload_pages)
                  : [];
                if (images) {
                  // const content = document.getElementById("print-content");
                  if (openRef.current) openRef.current.close();
                  const printWindow = window.open(
                    "",
                    "",
                    "height=600,width=800"
                  );
                  openRef.current = printWindow;
                  // 1. 인쇄 CSS를 포함하여 새 창에 내용을 복사
                  printWindow?.document.write(
                    "<html><head><title>다중 페이지 인쇄</title>"
                  );

                  // 인쇄 전용 스타일 태그 추가 (여기서 page-break 속성 정의)
                  printWindow?.document.write(
                    "<style>@media print { .page-break { page-break-after: always; } }</style>"
                  );
                  printWindow?.document.write("</head><body>");
                  images.forEach((url) => {
                    printWindow?.document.write(
                      `<img src="${url}" style="width: 100%;"/>`
                    );
                  });
                  uploads?.forEach((url: string) => {
                    printWindow?.document.write(
                      `<img src="${url}" style="width: 100%;"/>`
                    );
                  });
                  // printWindow?.document.write(content?.innerHTML || "");
                  printWindow?.document.write("</body></html>");
                  printWindow?.document.close();
                  setTimeout(() => {
                    printWindow?.print();
                  }, 500);
                }
              }}
            />

            <ScaleSelect
              value={scale}
              onChange={setScale}
              scales={[30, 50, 80, 100, 120, 150, 200, 300, 400]}
            />
            {isViewMode !== null && mode !== "admin" && (
              <P
                color="#e7e7e7"
                fontWeight={500}
                width="auto"
                whiteSpace="nowrap"
              >
                필수입력항목 ({inputed.length} / {requires.length})
              </P>
            )}
            <Button
              styleType="admin2"
              onClick={() => {
                if (isViewMode || isComplete || isDeleted) {
                  navigate(-1);
                  return;
                }
                handleSave();
              }}
              disabled={saving}
              className={styles.btnText}
            >
              {isViewMode || isComplete || isDeleted
                ? "확인"
                : saving
                ? "저장 중..."
                : buttonText}
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
                const forceReadonly =
                  isViewMode || readOnly || isComplete || isDeleted;

                const readonlyMode =
                  forceReadonly ||
                  userApprove === "ready" ||
                  userApprove === "confirm";

                const editable =
                  assigns.includes(input.metadata.name) && !readonlyMode;

                return (
                  <FloatInput
                    key={`${input.id}_${idx}`}
                    assign={editable}
                    require={requires.includes(input.metadata.name)}
                    input={input}
                    scale={scale}
                    readonly={!editable}
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
      <P color="#e7e7e7">{value}%</P>
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
      scale,
    }: {
      assign: boolean;
      require: boolean;
      input: InputFieldData;
      updateInput: (status: boolean) => void;
      readonly?: boolean;
      scale: number;
    },
    ref
  ) => {
    const divRef = useRef<any>(null);
    const timeoutRef = useRef<any>(null);
    const [ci, setCi] = useState<ContractInput>();
    const [value, setValue] = useState<any>(input.value ?? {});
    const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

    const toNum = (v: any) => {
      if (v === null || v === undefined) return 0;
      if (typeof v === "number") return v;
      const n = parseFloat(String(v).replace("px", ""));
      return isNaN(n) ? 0 : n;
    };
    const scaled = scale / 100;
    const rawFont = input.metadata.fontSize ?? 16; // 기본값 16
    const scaledFont = rawFont * scaled;
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
        top={parseCalc(input.metadata.top) * scaled}
        left={parseCalc(input.metadata.left) * scaled}
        width={toNum(input.metadata.width) * scaled}
        height={toNum(input.metadata.height) * scaled}
        fontFamily={input.metadata.fontFamily}
        fontSize={scaledFont}
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
