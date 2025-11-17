"use client";

import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { useAdminAuth } from "@/providers/AdminAuthPorivder/AdminAuthPorivderClient";
import { adminRequester } from "@/shared/AdminRequester";
import { fileRequester } from "@/shared/FileRequester";
import useNavigate from "@/shared/hooks/useNavigate";
import {
  dataURLtoFile,
  exportAsPdf,
  pageToDataURL,
  toast,
} from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import _ from "lodash";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ContractInput from "../../template/regist/class";
import styles from "./page.module.css";
import Input from "@/components/inputs/Input";

export default function Client({ contract }: { contract: ContractData }) {
  const { userData } = useAdminAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [contractUsers, setContractUsers] = useState<ContractUserData[]>(
    contract.contract_users ?? []
  );
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      const res = await adminRequester.getUsers({ role: "vendor" });
      setUsers(res?.content ?? []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await adminRequester.getUsers();
      const filtered = (res?.content ?? []).filter(
        (u: UserData) => u.role === "vendor" || u.role === "admin"
      );
      setUsers(filtered);
    })();
  }, []);

  const removeContractUser = (index: number) => {
    setContractUsers((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        user_id: undefined,
        user: undefined,
      };
      return updated;
    });
  };

  const handleNext = () => {
    const required = (contractUsers.length ?? 1) - 1;
    const selected = contractUsers.filter((u) => u.user_id).length - 1;

    if (selected !== required) {
      alert(`이 계약에는 총 ${required + 1}명의 참여자가 필요합니다.`);
      return;
    }

    setReady(true);
  };

  const handleSelectUser = (index: number, user: UserData) => {
    setContractUsers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], user_id: user.id, user };
      return updated;
    });
  };

  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((p) => Math.max(0, p - 1));
  };
  const handleNextPage = () => {
    if (!contract.pages) return;
    setCurrentPage((p) => Math.min(contract.pages.length - 1, p + 1));
  };
  if (ready && userData) {
    return (
      <Write
        user={userData}
        contract={{ ...contract, contract_users: contractUsers }}
      />
    );
  }

  return (
    <HorizontalFlex className={styles.page}>
      {/* 왼쪽: 미리보기 */}
      <FlexChild flex="1" className={styles.previewSection}>
        <VerticalFlex alignItems="center" justifyContent="center" gap={20}>
          <P className={styles.title}>{contract.name}</P>
          <Div className={styles.previewBox}>
            {contract.pages &&
            contract.pages.sort((p1, p2) => p1.page - p2.page).length > 0 ? (
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
            참여자 설정 ({contract.contract_users?.length ?? 1}명)
          </P>
          {contractUsers.map((cu, index) => (
            <Div key={cu.id || index} className={styles.row}>
              <P minWidth={60}>{index === 0 ? cu.name : cu.name}</P>
              <HorizontalFlex gap={15}>
                <Input
                  className={styles.input}
                  value={cu.user?.name || ""}
                  placeHolder="미지정"
                  disabled
                  width={"100%"}
                />
                <Button
                  className={styles.btnSelectUser}
                  styleType="admin2"
                  onClick={() => {
                    const selectedIds = contractUsers
                      .filter((u) => u.user_id)
                      .map((u) => u.user_id);

                    const availableUsers = users.filter(
                      (u) =>
                        (u.role === "vendor" || u.role === "admin") &&
                        !selectedIds.includes(u.id)
                    );

                    NiceModal.show("contractUser", {
                      users: availableUsers,
                      onSelect: (user: UserData) =>
                        handleSelectUser(index, user),
                    });
                  }}
                >
                  선택
                </Button>
                {cu.user_id && (
                  <Button
                    styleType="admin"
                    onClick={() => removeContractUser(index)}
                  >
                    ✕
                  </Button>
                )}
              </HorizontalFlex>
            </Div>
          ))}

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

function Write({ user, contract }: { user: UserData; contract: ContractData }) {
  const navigate = useNavigate();
  const contentRef = useRef<any>(null);
  const inputs = useRef<any[]>([]);
  const openRef = useRef<Window>(null);
  const [name, setName] = useState(contract.name);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [scale, setScale] = useState(100);
  const [assigns, setAssigns] = useState<string[]>([]);
  const [requires, setRequires] = useState<string[]>([]);
  const [inputed, setInputed] = useState<string[]>([]);
  useEffect(() => {
    function setMaxHeight() {
      const admin_header = document.getElementById("admin_header");
      const header = document.getElementById("setting_header");
      const headerHeight =
        (admin_header?.offsetHeight || 128) + (header?.offsetHeight || 56);

      // 2. 뷰포트 높이에서 헤더 높이를 뺀 값을 계산합니다.
      const baseHeight = document.documentElement.clientHeight;
      const contentMaxHeight = baseHeight - headerHeight - 15;

      setHeight(contentMaxHeight);
      const width = document.documentElement.clientWidth;
      setWidth(document.documentElement.clientWidth);
    }
    setMaxHeight();
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      const onWheel = (e: WheelEvent) => {
        if (!e.ctrlKey) return;

        e.preventDefault();
        setScale((scale) =>
          Math.min(400, Math.max(30, e.deltaY < 0 ? scale + 10 : scale - 10))
        );
      };
      content.addEventListener("wheel", onWheel);
      return () => content.removeEventListener("wheel", onWheel);
    }
  }, []);
  useEffect(() => {
    const _user = contract.contract_users.find((f) => f.user_id === user.id);

    setRequires(
      contract.pages
        .map((page) =>
          page.input_fields
            .filter(
              (f) =>
                f.metadata.data?.assign?.includes(_user?.name) &&
                f.metadata.data?.require?.includes(_user?.name)
            )
            .map((input) => input.metadata.name)
        )
        .flat()
    );
    setAssigns(
      contract.pages
        .map((page) =>
          page.input_fields
            .filter((f) => f.metadata.data?.assign?.includes(_user?.name))
            .map((input) => input.metadata.name)
        )
        .flat()
    );
  }, []);

  return (
    <VerticalFlex className={styles.setting}>
      <FlexChild>
        <HorizontalFlex
          id="setting_header"
          className={styles.header}
          justifyContent="flex-start"
        >
          <FlexChild width={"max-content"}>
            <Image
              src="/resources/icons/closeBtn_white.png"
              size={20}
              onClick={() =>
                NiceModal.show("confirm", {
                  message: "저장하지 않고 나가시겠습니까?",
                  confirmText: "나가기",
                  cancelText: "취소",
                  onConfirm: () => navigate(-1),
                })
              }
              cursor="pointer"
            />
          </FlexChild>
          <FlexChild width={"max-content"}>
            <P>{name}</P>
          </FlexChild>
          <FlexChild>
            <Image
              src="/resources/images/edit_white.png"
              size={20}
              cursor="pointer"
              onClick={() =>
                NiceModal.show("input", {
                  input: [
                    {
                      label: "이름",
                      value: name,
                      placeHolder: name,
                    },
                  ],
                  cancelText: "취소",
                  confirmText: "변경",
                  onConfirm: (value: string) => {
                    if (!value) value = `이름없음_${new Date().getTime()}`;
                    setName(value);
                  },
                })
              }
            />
          </FlexChild>
          <FlexChild width={"max-content"}>
            <P>
              필수 입력 항목 ({inputed.length}/{requires.length})
            </P>
          </FlexChild>
          <FlexChild width={"max-content"}>
            <Button
              className={styles.button}
              onClick={async () => {
                if (inputed.length < requires.length) {
                  toast({ message: "필수 입력항목이 남아있습니다." });
                  return;
                }
                const _data = { ...contract };
                _data.pages = await Promise.all(
                  _data.pages.map(async (page) => {
                    page.input_fields = await Promise.all(
                      page.input_fields.map(async (input) => {
                        input.value = await inputs.current[page.page][
                          input.metadata.name
                        ]?.getValue?.();
                        return input;
                      })
                    );
                    return page;
                  })
                );
                _data.name = name;

                const changed = _data.pages.map((page) => {
                  const input_fields =
                    page.input_fields.filter((f) =>
                      assigns.includes(f.metadata.name)
                    ) || [];
                  return { ...page, input_fields };
                });

                try {
                  const templateData = {
                    ...contract,
                    name,
                    pages: contract.pages.map((page) => ({
                      ...page,
                      input_fields: page.input_fields.map((f) => ({
                        ...f,
                        value: {}, // value 제거
                      })),
                    })),
                  };

                  const newContract =
                    await adminRequester.createContractFromTemplate(
                      contract.id,
                      templateData
                    );

                  for (const page of changed) {
                    for (const field of page.input_fields) {
                      const newPage = newContract.pages.find(
                        (p: any) => p.page === page.page
                      );
                      const newField = newPage?.input_fields.find(
                        (f: any) => f.metadata.name === field.metadata.name
                      );
                      if (newField) {
                        await adminRequester.updateInputField(
                          newContract.id,
                          newField.id,
                          field.value
                        );
                      }
                    }
                  }

                  NiceModal.show("toast", {
                    message: "계약이 성공적으로 생성 및 저장되었습니다.",
                  });
                  navigate(-1);
                } catch (err) {
                  console.error(err);
                  NiceModal.show("toast", {
                    message: "계약 생성 중 오류가 발생했습니다.",
                  });
                }
              }}
            >
              저장
            </Button>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild justifyContent="center">
        <VerticalFlex className={styles.middleSide}>
          <FlexChild className={styles.toolbar}>
            <FlexChild className={styles.group}>
              <HorizontalFlex justifyContent="flex-start">
                <FlexChild
                  width={"max-content"}
                  className={styles.slot}
                  onClick={() =>
                    NiceModal.show("confirm", {
                      message: `${name}을 다운로드 하시겠습니까?`,
                      confirmText: "다운로드",
                      cancelText: "취소",
                      onConfirm: async () => {
                        const pages = contract.pages.map((_, index) => {
                          const page = document.getElementById(`page_${index}`);
                          if (page) page.className = styles.print;
                          return page;
                        });
                        await exportAsPdf(
                          pages.filter((f) => f !== null),
                          name
                        );
                        pages.forEach((page) => {
                          if (page) page.className = "";
                        });
                      },
                    })
                  }
                >
                  <Image
                    src={"/resources/contract/file-download.svg"}
                    size={24}
                  />
                </FlexChild>
                <FlexChild
                  width={"max-content"}
                  className={styles.slot}
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
                      // printWindow?.document.write(content?.innerHTML || "");
                      printWindow?.document.write("</body></html>");
                      printWindow?.document.close();
                      setTimeout(() => {
                        printWindow?.print();
                      }, 500);
                    }
                  }}
                >
                  <Image src={"/resources/contract/print.svg"} size={24} />
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
            <FlexChild className={styles.group}>
              <HorizontalFlex justifyContent="flex-start">
                <FlexChild
                  width={"max-content"}
                  className={styles.slot}
                  onClick={() =>
                    document.getElementById("scaleSelect")?.click()
                  }
                >
                  <ScaleSelect
                    className={styles.scaler}
                    value={scale}
                    onChange={setScale}
                    scales={[30, 50, 80, 100, 120, 150, 200, 300, 400]}
                  />
                </FlexChild>
                <FlexChild
                  width={"max-content"}
                  className={styles.slot}
                  onClick={() => setScale(Math.max(30, scale - 10))}
                >
                  <Image
                    src={
                      scale <= 30
                        ? "/resources/images/minusWhite.png"
                        : "/resources/images/minus.png"
                    }
                    width={24}
                    height={"auto"}
                  />
                </FlexChild>
                <FlexChild
                  width={"max-content"}
                  className={styles.slot}
                  onClick={() => setScale(Math.min(400, scale + 10))}
                >
                  <Image
                    src={
                      scale >= 400
                        ? "/resources/images/plusWhite.png"
                        : "/resources/images/plus.png"
                    }
                    width={24}
                    height={"auto"}
                  />
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          </FlexChild>
          <FlexChild justifyContent="center">
            <VerticalFlex
              Ref={contentRef}
              id="print-content"
              position="relative"
              className={styles.scrollbar}
              alignItems="center"
              maxHeight={height - 57}
              height={height - 57}
              minHeight={height - 57}
              overflow="scroll"
              backgroundColor="#e0e0e0"
              padding={"30px"}
              gap={12}
            >
              {contract.pages
                ?.sort((a, b) => a.page - b.page)
                .map((page, index) => (
                  <FlexChild
                    id={`page_${index}`}
                    key={index}
                    position="relative"
                    justifyContent="center"
                    width={`calc(210mm * ${scale / 100})`}
                    height={`calc(297mm * ${scale / 100})`}
                  >
                    <Image
                      src={page.image}
                      width={"210mm"}
                      height={"297mm"}
                      scale={scale / 100}
                    />
                    {page.input_fields.map((input, index) => (
                      <FloatInput
                        require={requires.includes(input.metadata.name)}
                        assign={assigns.includes(input.metadata.name)}
                        ref={(el) => {
                          if (!inputs.current[page.page])
                            inputs.current[page.page] = {
                              [input.metadata.name]: el,
                            };
                          else {
                            inputs.current[page.page][input.metadata.name] = el;
                          }
                        }}
                        key={`${input.type}_${index}`}
                        input={input as any}
                        updateInput={(status) => {
                          if (status)
                            setInputed(
                              _.uniq([...inputed, input?.metadata?.name])
                            );
                          else
                            setInputed((prev) =>
                              prev.filter((f) => f !== input?.metadata?.name)
                            );
                        }}
                      />
                    ))}
                  </FlexChild>
                ))}
            </VerticalFlex>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
function ScaleSelect({
  value,
  onChange,
  scales,
  className,
}: {
  value: number;
  onChange: Dispatch<SetStateAction<number>>;
  scales: number[];
  className?: React.HTMLAttributes<HTMLElement>["className"];
}) {
  const [fold, setFold] = useState(true);
  useEffect(() => {
    if (!fold) {
      const handleClick = () => {
        setFold(true);
      };
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [fold]);
  return (
    <FlexChild
      id="scaleSelect"
      className={className}
      gap={6}
      position="relative"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
          setFold(false);
        }, 10);
      }}
    >
      <P>{value}%</P>
      <Image src="/resources/icons/down_arrow.png" width={12} height={"auto"} />
      <FlexChild hidden={fold} className={styles.list}>
        <VerticalFlex>
          {scales.map((scale) => (
            <FlexChild
              key={scale}
              className={styles.scale}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(scale);
                setFold(true);
              }}
            >
              <P>{scale}%</P>
            </FlexChild>
          ))}
        </VerticalFlex>
      </FlexChild>
    </FlexChild>
  );
}
const FloatInput = forwardRef(
  (
    {
      assign,
      require,
      input,
      updateInput,
    }: {
      assign: boolean;
      require: boolean;
      input: InputFieldData;
      updateInput: (status: boolean) => void;
    },
    ref
  ) => {
    const divRef = useRef<any>(null);
    const timeoutRef = useRef<any>(null);
    const [ci, setCi] = useState<ContractInput>();
    const [value, setValue] = useState<any>();
    const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
    useEffect(() => {
      let timer = 10;
      const interval = setInterval(() => {
        if (timer <= 0) clearInterval(interval);
        const _input = ContractInput.getList().find(
          (f) => f.getKey() === input.type
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
                const value = data[key];
                if (
                  typeof value === "string" &&
                  value.startsWith("data:image/png;base64,")
                ) {
                  const file = dataURLtoFile(value, `${input.type}.png`);
                  const formData = new FormData();
                  formData.append("files", file);
                  const { urls } = await fileRequester.upload(formData);
                  data[key] = urls[0];
                } else if (typeof value === "object") {
                  data[key] = transferFile(value);
                }
              })
            );
            return data;
          }
          return transferFile(value);
        }
        return {};
      },
    }));
    useEffect(() => {
      if (ci && require) updateInput(ci.isValid(value));
    }, [ci, value, require]);
    return (
      <FlexChild
        Ref={divRef}
        position={"absolute"}
        top={input.metadata.top}
        left={input.metadata.left}
        minWidth={input.metadata.width}
        width={input.metadata.width}
        height={input.metadata.height}
        minHeight={input.metadata.height}
        fontFamily={input.metadata.fontFamily}
        fontSize={input.metadata.fontSize}
        fontWeight={input.metadata.bold ? 700 : 500}
        fontStyle={input.metadata.italic ? "italic" : "normal"}
        textDecorationLine={input.metadata.underline ? "underline" : "none"}
        color={input.metadata.color}
        textAlign={input.metadata.align}
        alignItems={input.metadata.vertical}
        backgroundColor={input.metadata.backgroundColor}
        className={clsx({ [styles.float]: assign, [styles.has]: value })}
        transition={"0.5s all"}
        onMouseEnter={() => {
          if (!input.metadata.data.tooltip) return;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setHover({
              x:
                divRef.current.getBoundingClientRect().x +
                divRef.current.getBoundingClientRect().width * 0.5,
              y:
                divRef.current.getBoundingClientRect().y +
                divRef.current.getBoundingClientRect().height * 0.5,
            });
          }, 1000);
        }}
        onMouseLeave={() => {
          setHover(null);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }}
        pointerEvents={assign ? undefined : "none"}
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
            fontStyle="normal"
            textDecorationLine="none"
            textAlign="left"
          >
            <P whiteSpace="pre-wrap">{input.metadata.data.tooltip}</P>
          </FlexChild>
        )}
        {ci && (
          <ci.Write
            onChange={(value: any) => setValue(value)}
            {...value}
            data={input.metadata.data}
            width={input.metadata.width}
            heigh={input.metadata.height}
          />
        )}
      </FlexChild>
    );
  }
);
