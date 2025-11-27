"use client";

import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { adminRequester } from "@/shared/AdminRequester";
import { fileRequester } from "@/shared/FileRequester";
import useNavigate from "@/shared/hooks/useNavigate";
import { dataURLtoFile, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import _ from "lodash";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ContractInput from "../../../regist/class";
import styles from "./page.module.css";

async function getPdfPageAsBase64(pdfFileUrlOrData: any) {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/resources/pdf.worker.min.mjs`;

  // 1. PDF 로드
  const loadingTask = pdfjsLib.getDocument(pdfFileUrlOrData);
  const pdf = await loadingTask.promise;

  // 2. 첫 페이지 (1페이지) 로드
  const numPages = pdf.numPages;
  const base64Pages: string[] = [];

  // 3. A4 규격 뷰포트 설정
  // A4 비율을 유지하면서 이미지 품질을 위해 높은 DPI(예: 150 DPI) 기준 픽셀 크기 사용
  const A4_WIDTH_PX = 1240; // A4 (210mm) @ 150 DPI
  const A4_HEIGHT_PX = 1754; // A4 (297mm) @ 150 DPI (1.414 ratio)

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    // 페이지의 기본 크기를 A4 너비에 맞게 조정
    const originalViewport = page.getViewport({ scale: 1 });
    const scale = A4_WIDTH_PX / originalViewport.width;
    const viewport = page.getViewport({ scale: scale });
    // 4. 캔버스 설정
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = A4_WIDTH_PX;
    canvas.height = A4_HEIGHT_PX;

    // 5. 페이지를 캔버스에 렌더링
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext as any).promise;

    // 6. 캔버스 이미지를 Base64 Data URL로 변환
    const dataUrl = canvas.toDataURL("image/png");
    base64Pages.push(dataUrl);
  }
  return base64Pages;
}
const includes = [
  ".pdf",
  // ".hwp",
  // ".doc",
  // ".docx",
  // ".xls",
  // ".xlsx",
  // ".ppt",
  // ".pptx",
];
const mtypes: { name: string; check: (type: string) => boolean }[] = [
  { name: "image/*", check: (type) => type.startsWith("image/") },
  {
    name: "application/pdf",
    check: (type) => type === "application/pdf",
  },
];
const checkFiles = (name: string, type: string) => {
  return (
    includes.some((inc) => name.endsWith(inc)) ||
    mtypes.some((m) => m.check(type))
  );
};
interface Data {
  id?: string;
  input: ContractInput;
  name: string;
  top: React.CSSProperties["top"];
  left: React.CSSProperties["left"];
  width: number;
  height: number;
  fontFamily?: React.CSSProperties["fontFamily"];
  fontSize?: number;
  fontWeight?: React.CSSProperties["fontWeight"];
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: React.CSSProperties["color"];
  align?: React.CSSProperties["textAlign"];
  vertical?: React.CSSProperties["alignItems"];
  backgroundColor?: React.CSSProperties["backgroundColor"];
  data?: any;
}
interface PageData {
  [key: number]: {
    page: number;
    inputs: Data[];
  };
}
export default function ({ contract }: { contract: ContractData }) {
  const [images, setImages] = useState<string[]>(
    contract.pages.sort((p1, p2) => p1.page - p2.page).map((page) => page.image)
  );
  const navigate = useNavigate();
  const contentRef = useRef<any>(null);
  const inputs = useRef<any>({});
  const mouseRef = useRef<any>(null);
  const [inputList, setInputList] = useState<ContractInput[]>([]);
  const [name, setName] = useState(contract.name);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [scale, setScale] = useState(100);
  const [contractUsers, setContractUser] = useState<ContractUserDataFrame[]>(
    contract.contract_users
  );
  const [selectedUser, setSelectedUser] = useState<string>(
    contract.contract_users[0].name
  );
  const [selectedInput, setSelectedInput] = useState<ContractInput>();
  const [selectFontFamilly, setFontFamilly] = useState<string>("");
  const [isBold, setBold] = useState(false);
  const [isItalic, setItalic] = useState(false);
  const [isUnderLine, setUnderLine] = useState(false);
  const [color, setColor] = useState<string>("");
  const [align, setAlign] = useState<string>("");
  const [vertical, setVertical] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [extra, setExtra] = useState(false);
  const [fold, setFold] = useState(true);
  const [pageData, setPageData] = useState<PageData>({});
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);

  const undoStack = useRef<PageData[]>([]);
  const redoStack = useRef<PageData[]>([]);
  const saveTimer = useRef<any>(null);
  const pageDataRef = useRef(pageData);
  useEffect(() => {
    pageDataRef.current = pageData;
  }, [pageData]);
  useHotkeys(
    "delete",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      Object.keys(pageData).forEach((k) => {
        pageData[Number(k)].inputs = pageData[Number(k)].inputs.filter(
          (f) => !selectedInputs.includes(f.name)
        );
      });
      setPageData({ ...pageData });
      setSelectedInputs([]);
    },
    {},
    [selectedInputs]
  );
  useHotkeys("ctrl+a", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let input = new Set<string>();
    Object.keys(pageData).forEach((k) => {
      pageData[Number(k)].inputs.forEach((e) => input.add(e.name));
    });
    setSelectedInputs(Array.from(input));
  });
  useHotkeys("ctrl+o", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("file_change")?.click();
  });
  useHotkeys(
    "ctrl+c",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!selectedInputs.length) {
        return;
      }
      const copies: any[] = [];
      Object.keys(pageData).forEach((k) => {
        pageData[Number(k)].inputs
          .filter((f) => selectedInputs.includes(f.name))
          .forEach((input) => {
            copies.push({
              key: input.input.getKey(),
              data: input,
              page: Number(k),
            });
          });
      });
      sessionStorage.setItem("copy", JSON.stringify(copies));
    },
    {},
    [selectedInputs]
  );
  useHotkeys("ctrl+v", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const copied = sessionStorage.getItem("copy");
    if (copied) {
      const array: any[] = JSON.parse(copied);
      const selected: string[] = [];
      array.forEach((element) => {
        const {
          key,
          data: _data,
          page,
        }: { key: string; data: Data; page: number } = element;
        if (_data) {
          let number = 1;
          while (true) {
            if (
              !Object.keys(pageData).some((k) =>
                pageData[Number(k)].inputs.some(
                  (input) => input.name === _data.name + ` ${number}`
                )
              )
            ) {
              break;
            } else {
              number++;
            }
          }
          _data.name += ` ${number}`;
          selected.push(_data.name);
          const input = ContractInput.getList().find((f) => f.getKey() === key);
          if (input) _data.input = input;
          pageData[page].inputs.push(_data);
        }
      });
      setPageData({ ...pageData });
      setSelectedInputs(selected);
    }
  });

  useHotkeys(
    "ctrl+z",
    (e) => {
      e.preventDefault();
      if (!undoStack.current.length) return;

      redoStack.current.push(_.cloneDeep(pageDataRef.current));
      const prev = undoStack.current.pop();
      if (prev) setPageData(_.cloneDeep(prev));
    },
    { preventDefault: true },
    []
  );

  useHotkeys(
    "ctrl+y",
    (e) => {
      e.preventDefault();
      if (!redoStack.current.length) return;

      undoStack.current.push(_.cloneDeep(pageDataRef.current));
      const next = redoStack.current.pop();
      if (next) setPageData(_.cloneDeep(next));
    },
    { preventDefault: true },
    []
  );

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
      setExtra(width < 1500);
    }
    setMaxHeight();
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);
  useEffect(() => {
    if (!fold) {
      const closeCheck = (e: MouseEvent) => {
        const extra = document.getElementById("extra");
        if (extra?.contains(e.target as HTMLElement)) {
          return;
        } else {
          setFold(true);
        }
      };
      window.addEventListener("click", closeCheck);
      return () => window.removeEventListener("click", closeCheck);
    }
  }, [fold]);
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
    if (inputList.length > 0)
      setPageData(
        contract.pages.reduce((acc: PageData, now) => {
          acc[now.page] = {
            page: now.page,
            inputs: now.input_fields.map((input) => ({
              id: input.id,
              input: inputList.find((f) => f.getKey() === input.type) as any,
              name: input.metadata.name,
              top: input.metadata.top,
              left: input.metadata.left,
              width: input.metadata.width,
              height: input.metadata.height,
              fontFamily: input.metadata.fontFamily,
              fontSize: input.metadata.fontSize,
              bold: input.metadata.bold,
              italic: input.metadata.italic,
              underline: input.metadata.underline,
              color: input.metadata.color,
              align: input.metadata.align,
              vertical: input.metadata.vertical,
              backgroundColor: input.metadata.backgroundColor,
              data: input.metadata.data,
            })),
          };
          return acc;
        }, {})
      );
  }, [inputList]);

  useEffect(() => {
    let timer = 10;
    const interval = setInterval(() => {
      if (timer <= 0) clearInterval(interval);
      const list = Array.from(ContractInput.getList());
      if (list.length > 0) {
        setInputList(list);
        clearInterval(interval);
      } else timer--;
    }, 500);
  }, []);

  useEffect(() => {
    setFontFamilly("");
    setBold(false);
    setItalic(false);
    setUnderLine(false);
    setColor("");
    setAlign("");
    setVertical("");
    setBackgroundColor("");
  }, [selectedInputs]);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      undoStack.current.push(_.cloneDeep(pageData));
    }, 300);
  }, [pageData]);

  return (
    <VerticalFlex className={styles.setting}>
      <input
        type="file"
        hidden
        id="file_change"
        accept="image/*,.pdf"
        onChange={async (e) => {
          const files = e.target.files;
          if (!files || files?.length === 0) {
            toast({ message: "파일이 없습니다." });
            return;
          }
          const file = files[0];
          if (!checkFiles(file.name, file.type)) {
            toast({ message: "허용되지않는 파일 형식입니다." });
            return;
          }
          if (file.size > 1024 * 1024 * 100) {
            toast({ message: "파일의 용량이 제한된 크기를 넘겼습니다." });
            return;
          }

          const index = file.name.lastIndexOf(".");
          setName(file.name.slice(0, index));
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            // 3. 파일 읽기가 완료되었을 때 실행될 이벤트 핸들러 정의
            reader.onload = function (e) {
              // e.target.result에 Base64 문자열이 담겨 있습니다.
              const base64String = e.target?.result;
              setImages([base64String as string]);
              setPageData({ 0: pageData?.[0] });
            };
            reader.readAsDataURL(file);
          } else if (file.name.endsWith(".pdf")) {
            const dataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result); // Base64 Data URL
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            const result = await getPdfPageAsBase64(dataUrl);
            const _pageData: PageData = {};
            Object.keys(pageData).forEach((k) => {
              if (Number(k) < result.length) {
                _pageData[Number(k)] = pageData[Number(k)];
              }
            });
            setImages(result);
            setPageData(_pageData);
          }
        }}
      />
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
            <P>탬플릿 설정</P>
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
            <Button
              className={styles.button}
              onClick={async () => {
                const _data: ContractDataFrame = {
                  id: contract.id,
                  name,
                  pages: images.map((_, key) => ({
                    id: contract.pages[key].id,
                    page: Number(key),
                    image: images[Number(key)],
                    input_fields:
                      pageData[Number(key)]?.inputs?.map((input) => ({
                        id: input.id,
                        type: input.input.getKey(),
                        metadata: {
                          name: input.name,
                          top: input.top,
                          left: input.left,
                          width: input.width,
                          height: input.height,
                          fontFamily: input.fontFamily,
                          fontSize: input.fontSize,
                          bold: input.bold,
                          italic: input.italic,
                          underline: input.underline,
                          color: input.color,
                          align: input.align,
                          vertical: input.vertical,
                          backgroundColor: input.backgroundColor,
                          data: input.data || {},
                        },
                      })) || [],
                  })),
                  contract_users: contractUsers,
                };

                _data.pages = await Promise.all(
                  _data.pages.map(async (page) => {
                    if (page.image.startsWith("data:")) {
                      const formData = new FormData();
                      const file = dataURLtoFile(
                        page.image,
                        `${_data.name}_${page.page}.png`
                      );
                      formData.append("files", file);
                      const { urls } = await fileRequester.upload(
                        formData,
                        "/contract"
                      );
                      page.image = urls[0];
                    }
                    return page;
                  })
                );

                try {
                  const result = await adminRequester.updateContract(
                    contract.id,
                    _data
                  );
                  toast({ message: "템플릿이 성공적으로 저장되었습니다." });
                  // console.log("[Template Create Result]", result);
                  setTimeout(() => {
                    navigate("/contract/template/management");
                  }, 2000);
                } catch (err) {
                  console.error(err);
                  toast({ message: "템플릿 저장 중 오류가 발생했습니다." });
                }
              }}
            >
              저장
            </Button>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <HorizontalFlex>
          <FlexChild width={"max-content"}>
            <VerticalFlex
              className={clsx(styles.leftSide, styles.scrollbar)}
              alignItems="flex-start"
              maxHeight={height}
              height={height}
              minHeight={height}
            >
              <LeftSlot title={`서명 참여자 (${contractUsers.length}명)`}>
                <VerticalFlex>
                  {contractUsers.map((user) => (
                    <FlexChild
                      key={user.name}
                      className={clsx(styles.slot_user, {
                        [styles.selected]: selectedUser === user.name,
                      })}
                      onClick={() => setSelectedUser(user.name)}
                    >
                      <HorizontalFlex>
                        <FlexChild>
                          <P>{user.name}</P>
                        </FlexChild>
                        <FlexChild
                          width={"max-content"}
                          gap={4}
                          hidden={contractUsers.length === 1}
                        >
                          <Image
                            src="/resources/images/editing.png"
                            size={16}
                            cursor="pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              NiceModal.show("input", {
                                message: `${user.name}의 이름을 변경하시겠습니까?`,
                                input: {
                                  label: "역할명",
                                  maxLength: 10,
                                  value: user.name,
                                  placeHolder: user.name,
                                },
                                confirmText: "변경",
                                cancelText: "취소",
                                onConfirm: (value: string) => {
                                  value = value.trim();
                                  if (value) {
                                    if (
                                      contractUsers.some(
                                        (f) => f.name === value
                                      )
                                    )
                                      return;
                                    if (selectedUser === user.name)
                                      setSelectedUser(value);
                                    Object.keys(pageData).map((key) => {
                                      pageData[Number(key)].inputs = pageData[
                                        Number(key)
                                      ].inputs.map((input) => {
                                        input.data.assign =
                                          input.data?.assign?.map(
                                            (ass: string) => {
                                              if (ass === user.name)
                                                return value;
                                              return ass;
                                            }
                                          );
                                        input.data.require =
                                          input.data?.require?.map(
                                            (req: string) => {
                                              if (req === user.name)
                                                return value;
                                              return req;
                                            }
                                          );
                                        return input;
                                      });
                                    });
                                    setPageData({ ...pageData });
                                    setContractUser(
                                      contractUsers.map((u) => {
                                        if (u.name === user.name)
                                          u.name = value;
                                        return u;
                                      })
                                    );
                                  }
                                },
                              });
                            }}
                          />
                          <Image
                            src="/resources/images/closeBtn2x_2.png"
                            width={14}
                            cursor="pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              NiceModal.show("confirm", {
                                message: `${user.name}을 제외 하시겠습니까?`,
                                confirmText: "제외하기",
                                cancelText: "취소",
                                onConfirm: () => {
                                  const filtered = contractUsers.filter(
                                    (f) => f.name !== user.name
                                  );
                                  setContractUser(filtered);
                                  if (selectedUser === user.name) {
                                    setSelectedUser(filtered?.[0].name);
                                  }
                                },
                              });
                            }}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                  ))}
                  <FlexChild justifyContent="center" fontSize={12}>
                    <P
                      className={styles.slot_user}
                      onClick={(e) => {
                        e.stopPropagation();
                        NiceModal.show("input", {
                          message: `참여자를 추가하시겠습니까?`,
                          input: {
                            label: "역할명",
                            maxLength: 10,
                          },
                          confirmText: "추가",
                          cancelText: "취소",
                          onConfirm: (value: string) => {
                            value = value.trim();
                            if (value) {
                              if (contractUsers.some((f) => f.name === value)) {
                                let count = 1;
                                while (true) {
                                  const _name = value + " " + count;
                                  if (
                                    contractUsers.some((f) => f.name === _name)
                                  ) {
                                    count++;
                                    continue;
                                  } else {
                                    value = _name;
                                    break;
                                  }
                                }
                              }
                              setContractUser([
                                ...contractUsers,
                                { name: value },
                              ]);
                            }
                          },
                        });
                      }}
                    >
                      + 추가
                    </P>
                  </FlexChild>
                </VerticalFlex>
              </LeftSlot>
              <LeftSlot title={"입력항목"}>
                <VerticalFlex>
                  {inputList.map((input) => (
                    <input.Input
                      key={input.key}
                      className={clsx(styles.slot_input, {
                        [styles.selected]: selectedInput?.key === input.key,
                      })}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedInput(
                          selectedInput?.key === input.key ? undefined : input
                        );
                        if (mouseRef.current) {
                          mouseRef.current?.remove?.();
                          mouseRef.current = null;
                        }
                      }}
                    />
                  ))}
                </VerticalFlex>
              </LeftSlot>
            </VerticalFlex>
          </FlexChild>
          <FlexChild>
            <VerticalFlex className={styles.middleSide}>
              <FlexChild className={styles.toolbar}>
                <HorizontalFlex justifyContent="flex-start">
                  <FlexChild className={styles.group}>
                    <HorizontalFlex
                      justifyContent="flex-start"
                      width={"max-content"}
                    >
                      <FlexChild
                        className={styles.slot}
                        color={true ? "#d0d0d0" : undefined}
                      >
                        <Icon
                          src="contract/"
                          name="backward"
                          type="svg"
                          size={20}
                          cursor="pointer"
                        />
                      </FlexChild>
                      <FlexChild
                        className={styles.slot}
                        color={true ? "#d0d0d0" : undefined}
                      >
                        <Icon
                          src="contract/"
                          name="forward"
                          type="svg"
                          size={20}
                          cursor="pointer"
                        />
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild className={styles.group}>
                    <HorizontalFlex
                      justifyContent="flex-start"
                      width={"max-content"}
                    >
                      <FlexChild className={styles.slot}>
                        <Select
                          disabled={!selectedInputs.length}
                          zIndex={1}
                          width={150}
                          maxWidth={150}
                          classNames={{ header: styles.selectHeader }}
                          options={[
                            {
                              value: "var(--font-pretendard)",
                              display: "Pretendard",
                            },
                            {
                              value: "var(--font-notosans)",
                              display: "구글 본고딕",
                            },
                            {
                              value: "var(--font-barun-gothic)",
                              display: "나눔 바른 고딕",
                            },
                            {
                              value: "var(--font-brush)",
                              display: "나눔 붓글씨",
                            },
                            {
                              value: "var(--font-gothic)",
                              display: "sksnarhelr",
                            },
                            { value: "var(--font-human)", display: "나눔휴먼" },
                            {
                              value: "var(--font-myeongjo)",
                              display: "나눔명조",
                            },
                            { value: "var(--font-pen)", display: "나눔펜" },
                            {
                              value: "var(--font-square-neo)",
                              display: "나눔스퀘어네오",
                            },
                            {
                              value: "var(--font-sacheon)",
                              display: "사천항공체",
                            },
                          ]}
                          placeholder=""
                          value={selectFontFamilly}
                          onChange={(value) => {
                            setFontFamilly(value as string);
                            Object.keys(pageData).forEach((key) => {
                              const inputs = pageData[Number(key)].inputs;
                              pageData[Number(key)].inputs = inputs.map(
                                (input) => {
                                  if (selectedInputs.includes(input.name)) {
                                    input.fontFamily = value as string;
                                  }
                                  return input;
                                }
                              );
                            });
                            setPageData({ ...pageData });
                          }}
                        />
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild className={styles.group}>
                    <HorizontalFlex
                      justifyContent="flex-start"
                      width={"max-content"}
                    >
                      <FlexChild className={styles.slot}>
                        <InputNumber
                          disabled={!selectedInputs.length}
                          ref={(el) => {
                            inputs.current["fontsize"] = el;
                          }}
                          value={16}
                          min={1}
                          max={150}
                          onChange={(value) => {
                            Object.keys(pageData).forEach((key) => {
                              const inputs = pageData[Number(key)].inputs;
                              pageData[Number(key)].inputs = inputs.map(
                                (input) => {
                                  if (selectedInputs.includes(input.name)) {
                                    input.fontSize = value;
                                  }
                                  return input;
                                }
                              );
                            });
                            setPageData({ ...pageData });
                          }}
                        />
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild className={styles.group}>
                    <HorizontalFlex
                      justifyContent="flex-start"
                      width={"max-content"}
                    >
                      <FlexChild
                        className={clsx(styles.slot, {
                          [styles.selected]: isBold,
                        })}
                        color={!selectedInputs.length ? "#d0d0d0" : undefined}
                      >
                        <Icon
                          src="contract/"
                          name="bold"
                          type="svg"
                          cursor="pointer"
                          size={15}
                          onClick={() => {
                            if (!selectedInputs.length) return;
                            setBold(!isBold);
                            Object.keys(pageData).forEach((key) => {
                              const inputs = pageData[Number(key)].inputs;
                              pageData[Number(key)].inputs = inputs.map(
                                (input) => {
                                  if (selectedInputs.includes(input.name)) {
                                    input.bold = !isBold;
                                  }
                                  return input;
                                }
                              );
                            });
                            setPageData({ ...pageData });
                          }}
                        />
                      </FlexChild>
                      <FlexChild
                        className={clsx(styles.slot, {
                          [styles.selected]: isItalic,
                        })}
                        color={!selectedInputs.length ? "#d0d0d0" : undefined}
                        onClick={() => {
                          if (!selectedInputs.length) return;
                          setItalic(!isItalic);
                          Object.keys(pageData).forEach((key) => {
                            const inputs = pageData[Number(key)].inputs;
                            pageData[Number(key)].inputs = inputs.map(
                              (input) => {
                                if (selectedInputs.includes(input.name)) {
                                  input.italic = !isItalic;
                                }
                                return input;
                              }
                            );
                          });
                          setPageData({ ...pageData });
                        }}
                      >
                        <Icon
                          src="contract/"
                          name="italic"
                          type="svg"
                          cursor="pointer"
                          size={15}
                        />
                      </FlexChild>
                      <FlexChild
                        className={clsx(styles.slot, {
                          [styles.selected]: isUnderLine,
                        })}
                        color={!selectedInputs.length ? "#d0d0d0" : undefined}
                        onClick={() => {
                          if (!selectedInputs.length) return;
                          setUnderLine(!isUnderLine);
                          Object.keys(pageData).forEach((key) => {
                            const inputs = pageData[Number(key)].inputs;
                            pageData[Number(key)].inputs = inputs.map(
                              (input) => {
                                if (selectedInputs.includes(input.name)) {
                                  input.underline = !isUnderLine;
                                }
                                return input;
                              }
                            );
                          });
                          setPageData({ ...pageData });
                        }}
                      >
                        <Icon
                          src="contract/"
                          name="underline"
                          type="svg"
                          cursor="pointer"
                          size={15}
                        />
                      </FlexChild>
                      <FlexChild
                        className={styles.slot}
                        color={!selectedInputs.length ? "#d0d0d0" : undefined}
                        onClick={() => {
                          if (!selectedInputs.length) return;
                          NiceModal.show("contract/color", {
                            onConfirm: ({ color }: { color: string }) => {
                              setColor(color);
                              Object.keys(pageData).forEach((key) => {
                                const inputs = pageData[Number(key)].inputs;
                                pageData[Number(key)].inputs = inputs.map(
                                  (input) => {
                                    if (selectedInputs.includes(input.name)) {
                                      input.color = color;
                                    }
                                    return input;
                                  }
                                );
                                setPageData({ ...pageData });
                              });
                            },
                          });
                        }}
                      >
                        <Icon
                          src="contract/"
                          name="color"
                          type="svg"
                          cursor="pointer"
                          size={15}
                        />
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild id="extra" position="relative">
                    {extra && (
                      <FlexChild
                        width={"max-content"}
                        className={styles.slot}
                        onClick={() => setFold(false)}
                      >
                        <Icon
                          src="contract/"
                          name="more_v"
                          type="svg"
                          cursor="pointer"
                          size={15}
                        />
                      </FlexChild>
                    )}
                    <HorizontalFlex
                      className={clsx({ [styles.extra]: extra })}
                      hidden={fold && extra}
                      justifyContent="flex-start"
                      width={"max-content"}
                    >
                      <FlexChild className={styles.group}>
                        <HorizontalFlex
                          justifyContent="flex-start"
                          width={"max-content"}
                        >
                          <FlexChild
                            className={styles.slot}
                            color={
                              !selectedInputs.length ? "#d0d0d0" : undefined
                            }
                            onClick={() => {
                              if (!selectedInputs.length) return;
                              setAlign("left");
                              Object.keys(pageData).forEach((key) => {
                                const inputs = pageData[Number(key)].inputs;
                                pageData[Number(key)].inputs = inputs.map(
                                  (input) => {
                                    if (selectedInputs.includes(input.name)) {
                                      input.align = "left";
                                    }
                                    return input;
                                  }
                                );
                              });
                              setPageData({ ...pageData });
                              setFold(true);
                            }}
                          >
                            <Icon
                              src="contract/"
                              name="align-left"
                              type="svg"
                              cursor="pointer"
                              size={15}
                            />
                          </FlexChild>
                          <FlexChild
                            className={styles.slot}
                            color={
                              !selectedInputs.length ? "#d0d0d0" : undefined
                            }
                            onClick={() => {
                              if (!selectedInputs.length) return;
                              setAlign("center");
                              Object.keys(pageData).forEach((key) => {
                                const inputs = pageData[Number(key)].inputs;
                                pageData[Number(key)].inputs = inputs.map(
                                  (input) => {
                                    if (selectedInputs.includes(input.name)) {
                                      input.align = "center";
                                    }
                                    return input;
                                  }
                                );
                              });
                              setPageData({ ...pageData });
                              setFold(true);
                            }}
                          >
                            <Icon
                              src="contract/"
                              name="align-center"
                              type="svg"
                              cursor="pointer"
                              size={15}
                            />
                          </FlexChild>
                          <FlexChild
                            className={styles.slot}
                            color={
                              !selectedInputs.length ? "#d0d0d0" : undefined
                            }
                            onClick={() => {
                              if (!selectedInputs.length) return;
                              setAlign("right");
                              Object.keys(pageData).forEach((key) => {
                                const inputs = pageData[Number(key)].inputs;
                                pageData[Number(key)].inputs = inputs.map(
                                  (input) => {
                                    if (selectedInputs.includes(input.name)) {
                                      input.align = "right";
                                    }
                                    return input;
                                  }
                                );
                              });
                              setPageData({ ...pageData });
                              setFold(true);
                            }}
                          >
                            <Icon
                              src="contract/"
                              name="align-right"
                              type="svg"
                              cursor="pointer"
                              size={15}
                            />
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                      <FlexChild className={styles.group}>
                        <HorizontalFlex
                          justifyContent="flex-start"
                          width={"max-content"}
                        >
                          <FlexChild
                            className={styles.slot}
                            color={
                              !selectedInputs.length ? "#d0d0d0" : undefined
                            }
                            onClick={() => {
                              if (!selectedInputs.length) return;
                              setVertical("flex-start");
                              Object.keys(pageData).forEach((key) => {
                                const inputs = pageData[Number(key)].inputs;
                                pageData[Number(key)].inputs = inputs.map(
                                  (input) => {
                                    if (selectedInputs.includes(input.name)) {
                                      input.vertical = "flex-start";
                                    }
                                    return input;
                                  }
                                );
                              });
                              setPageData({ ...pageData });
                              setFold(true);
                            }}
                          >
                            <Icon
                              src="contract/"
                              name="align-top"
                              type="svg"
                              cursor="pointer"
                              size={20}
                            />
                          </FlexChild>
                          <FlexChild
                            className={styles.slot}
                            color={
                              !selectedInputs.length ? "#d0d0d0" : undefined
                            }
                            onClick={() => {
                              if (!selectedInputs.length) return;
                              setVertical("center");
                              Object.keys(pageData).forEach((key) => {
                                const inputs = pageData[Number(key)].inputs;
                                pageData[Number(key)].inputs = inputs.map(
                                  (input) => {
                                    if (selectedInputs.includes(input.name)) {
                                      input.vertical = "center";
                                    }
                                    return input;
                                  }
                                );
                              });
                              setPageData({ ...pageData });
                              setFold(true);
                            }}
                          >
                            <Icon
                              src="contract/"
                              name="align-middle"
                              type="svg"
                              cursor="pointer"
                              size={20}
                            />
                          </FlexChild>
                          <FlexChild
                            className={styles.slot}
                            color={
                              !selectedInputs.length ? "#d0d0d0" : undefined
                            }
                            onClick={() => {
                              if (!selectedInputs.length) return;
                              setVertical("flex-end");
                              Object.keys(pageData).forEach((key) => {
                                const inputs = pageData[Number(key)].inputs;
                                pageData[Number(key)].inputs = inputs.map(
                                  (input) => {
                                    if (selectedInputs.includes(input.name)) {
                                      input.vertical = "flex-end";
                                    }
                                    return input;
                                  }
                                );
                              });
                              setPageData({ ...pageData });
                              setFold(true);
                            }}
                          >
                            <Icon
                              src="contract/"
                              name="align-bottom"
                              type="svg"
                              cursor="pointer"
                              size={20}
                            />
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                      <FlexChild className={styles.group}>
                        <HorizontalFlex
                          justifyContent="flex-start"
                          width={"max-content"}
                        >
                          <FlexChild
                            className={styles.slot}
                            color={
                              !selectedInputs.length ? "#d0d0d0" : undefined
                            }
                            onClick={() => {
                              if (!selectedInputs.length) return;
                              NiceModal.show("contract/color", {
                                background: true,
                                onConfirm: ({ color }: { color: string }) => {
                                  setBackgroundColor(color);
                                  Object.keys(pageData).forEach((key) => {
                                    const inputs = pageData[Number(key)].inputs;
                                    pageData[Number(key)].inputs = inputs.map(
                                      (input) => {
                                        if (
                                          selectedInputs.includes(input.name)
                                        ) {
                                          input.backgroundColor = color;
                                        }
                                        return input;
                                      }
                                    );
                                    setPageData({ ...pageData });
                                    setFold(true);
                                  });
                                },
                              });
                            }}
                          >
                            <Icon
                              src="contract/"
                              name="paint"
                              type="svg"
                              cursor="pointer"
                              size={20}
                            />
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex justifyContent="flex-end" paddingRight={20}>
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
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <VerticalFlex
                  Ref={contentRef}
                  position="relative"
                  className={styles.scrollbar}
                  alignItems="center"
                  maxHeight={height - 57}
                  height={height - 57}
                  minHeight={height - 57}
                  width={`calc(max(${width}px,1440px) - 500px)`}
                  overflow="scroll"
                  maxWidth={`calc(max(${width}px,1440px) - 500px)`}
                  backgroundColor="#e0e0e0"
                  padding={"30px"}
                  gap={12}
                  onMouseEnter={(e) => {
                    if (selectedInput && !mouseRef.current) {
                      const empty = selectedInput.getEmpty();
                      mouseRef.current = empty;
                      contentRef.current.appendChild(empty);
                      empty.style.top = `${e.clientY}px`;
                      empty.style.left = `${e.clientX}px`;
                    }
                  }}
                  onMouseMove={(e) => {
                    if (mouseRef.current) {
                      const content: HTMLElement = contentRef.current;
                      const empty = mouseRef.current;
                      const bound = content.getBoundingClientRect();
                      empty.style.top = `${
                        e.clientY - bound.top + content.scrollTop
                      }px`;
                      empty.style.left = `${
                        e.clientX - bound.x + content.scrollLeft
                      }px`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (mouseRef.current) {
                      mouseRef.current?.remove?.();
                      mouseRef.current = null;
                    }
                  }}
                >
                  {images.map((image, index) => (
                    <FlexChild
                      id={`page_${index}`}
                      key={index}
                      position="relative"
                      justifyContent="center"
                      width={`calc(210mm * ${scale / 100})`}
                      height={`calc(297mm * ${scale / 100})`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!selectedInput || !mouseRef.current) {
                          setSelectedInputs([]);
                          return;
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        NiceModal.show("contextMenu", {
                          x: e.clientX,
                          y: e.clientY,
                          rows: [
                            {
                              label: "파일 변경",
                              key: "ctrl+o",
                              onClick: () => {
                                document.getElementById("file_change")?.click();
                              },
                            },
                          ],
                        });
                      }}
                      onMouseUp={(e) => {
                        if (!selectedInput || !mouseRef.current) return;

                        if (!pageData[index])
                          pageData[index] = { page: index, inputs: [] };

                        const page = document.getElementById(
                          `page_${index}`
                        ) as HTMLElement;
                        const pbounds: DOMRect = page.getBoundingClientRect();
                        const cbounds: DOMRect =
                          contentRef.current.getBoundingClientRect();
                        const top = `calc(${mouseRef.current.style.top} - ${
                          pbounds.top -
                          cbounds.top +
                          contentRef.current.scrollTop
                        }px)`;
                        const left = `calc(${mouseRef.current.style.left} - ${
                          pbounds.left - cbounds.left
                        }px)`;
                        const id = selectedInput.getTitle();

                        let number = 1;
                        while (true) {
                          if (
                            !Object.keys(pageData).some((key) => {
                              return pageData[Number(key)].inputs.some(
                                (f) => f.name === `${id} ${number}`
                              );
                            })
                          ) {
                            break;
                          } else {
                            number++;
                          }
                        }
                        pageData[index].inputs.push({
                          top,
                          left,
                          input: selectedInput,
                          name: `${id} ${number}`,
                          height: selectedInput.getHeight(),
                          width: selectedInput.getWidth(),
                          data: {
                            assign: [selectedUser],
                            require: [selectedUser],
                            icon: true,
                            ...selectedInput.initData(),
                          },
                        });
                        setSelectedInputs([`${id} ${number}`]);
                        setPageData({ ...pageData });
                        setSelectedInput(undefined);
                        mouseRef.current?.remove();
                        mouseRef.current = null;
                      }}
                    >
                      <Image
                        src={image}
                        width={"210mm"}
                        height={"297mm"}
                        scale={scale / 100}
                      />
                      {pageData[index]?.inputs?.map((input, idx) => (
                        <FloatInput
                          pageData={pageData}
                          setPageData={setPageData}
                          page={index}
                          maxPage={images.length}
                          key={input.name}
                          input={input}
                          top={`calc(${input.top} * ${scale / 100})`}
                          left={`calc(${input.left} * ${scale / 100})`}
                          selected={selectedInputs.some(
                            (id) => id === input.name
                          )}
                          width={(input.width * scale) / 100}
                          height={(input.height * scale) / 100}
                          onUpdate={({
                            width,
                            height,
                            top,
                            left,
                            data: _data,
                            page,
                          }) => {
                            const input = pageData[index].inputs[idx];
                            if (typeof width !== "undefined")
                              input.width = width;
                            if (typeof height !== "undefined")
                              input.height = height;
                            if (typeof top !== "undefined") input.top = top;
                            if (typeof left !== "undefined") input.left = left;
                            if (typeof pageData !== "undefined")
                              input.data = _.merge(input.data || {}, _data);
                            if (typeof page !== "undefined") {
                              if (index !== page) {
                                pageData[index].inputs = pageData[
                                  index
                                ].inputs.filter((f) => f.name !== input.name);
                                if (!pageData[page])
                                  pageData[page] = {
                                    inputs: [],
                                    page,
                                  };
                                else if (!pageData[page].inputs)
                                  pageData[page].inputs = [];
                                pageData[page].inputs.push(input);
                              }
                            }
                            setPageData({ ...pageData });
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.ctrlKey || e.shiftKey) {
                              if (selectedInputs.includes(input.name)) {
                                setSelectedInputs(
                                  selectedInputs.filter(
                                    (id) => id !== input.name
                                  )
                                );
                              } else {
                                setSelectedInputs([
                                  ...selectedInputs,
                                  input.name,
                                ]);
                              }
                            } else {
                              if (
                                selectedInputs.length === 0 &&
                                selectedInputs?.[0] === input.name
                              ) {
                                setSelectedInputs([]);
                              } else setSelectedInputs([input.name]);
                            }
                          }}
                          setSelectedInputs={setSelectedInputs}
                          contractUsers={contractUsers}
                        />
                      ))}
                    </FlexChild>
                  ))}
                </VerticalFlex>
              </FlexChild>
            </VerticalFlex>
          </FlexChild>
          <FlexChild width={"max-content"}>
            <VerticalFlex
              className={clsx(styles.rightSide, styles.scrollbar)}
              alignItems="flex-start"
              maxHeight={height}
              height={height}
              minHeight={height}
            >
              <FlexChild className={styles.title}>
                <P>
                  추가된 입력 항목{" "}
                  {Object.keys(pageData).reduce((acc, now) => {
                    return acc + pageData[Number(now)].inputs.length;
                  }, 0)}
                </P>
              </FlexChild>
              {images.map((_, page) => (
                <RightSlot key={page} title={`${Number(page) + 1} 페이지`}>
                  <VerticalFlex>
                    {pageData[Number(page)]?.inputs?.map((input, idx) => (
                      <FlexChild
                        key={input.name}
                        className={clsx(styles.slot, {
                          [styles.selected]: selectedInputs.some(
                            (id) => id === input.name
                          ),
                        })}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          document.getElementById(input.name)?.scrollIntoView();
                          NiceModal.show("contextMenu", {
                            x: e.clientX,
                            y: e.clientY,
                            rows: [
                              {
                                label: "삭제",
                                key: "Delete",
                                onClick: () => {
                                  setSelectedInputs((prev) =>
                                    prev.filter((f) => f !== input.name)
                                  );
                                  Object.keys(pageData).forEach((k) => {
                                    pageData[Number(k)].inputs = pageData[
                                      Number(k)
                                    ].inputs.filter(
                                      (f) => f.name !== input.name
                                    );
                                  });
                                  setPageData({ ...pageData });
                                },
                              },
                              {
                                label: "복사",
                                key: "Ctrl+C",
                                onClick: () => {
                                  sessionStorage.setItem(
                                    "copy",
                                    JSON.stringify([
                                      {
                                        key: input.input.getKey(),
                                        data: input,
                                        page: Number(page),
                                      },
                                    ])
                                  );
                                },
                              },
                              {
                                label: "이름변경",
                                onClick: () => {
                                  NiceModal.show("input", {
                                    message: `${input.name}을 변경하시겠습니까?`,
                                    input: [
                                      {
                                        label: "이름",
                                        value: input.name,
                                        placeHolder: input.name,
                                      },
                                    ],
                                    confirmText: "변경",
                                    cancelText: "취소",
                                    onConfirm: (value: string) => {
                                      value = value.trim();
                                      if (value === input.name) return;
                                      if (
                                        Object.keys(pageData).some((k) =>
                                          pageData[Number(k)].inputs.some(
                                            (input) => input.name === value
                                          )
                                        )
                                      ) {
                                        let number = 1;
                                        while (true) {
                                          if (
                                            !Object.keys(pageData).some((k) =>
                                              pageData[Number(k)].inputs.some(
                                                (input) =>
                                                  input.name ===
                                                  value + ` ${number}`
                                              )
                                            )
                                          ) {
                                            break;
                                          } else {
                                            number++;
                                          }
                                        }
                                        pageData[Number(page)].inputs[
                                          idx
                                        ].name = value + ` ${number}`;
                                      } else {
                                        pageData[Number(page)].inputs[
                                          idx
                                        ].name = value;
                                      }
                                      setPageData({ ...pageData });
                                      setSelectedInputs([]);
                                    },
                                  });
                                },
                              },
                            ],
                          });
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.shiftKey)
                            setSelectedInputs([...selectedInputs, input.name]);
                          else setSelectedInputs([input.name]);
                          document.getElementById(input.name)?.scrollIntoView();
                        }}
                      >
                        {input?.input?.getIcon(24)}
                        <P>{input.name}</P>
                        <Icon
                          src="contract/"
                          name="setting"
                          type="svg"
                          size={24}
                          marginLeft={"auto"}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            NiceModal.show("contract/setting", {
                              name: input.name,
                              input: input.input,
                              data: input.data,
                              users: contractUsers,
                              onConfirm: ({
                                data: _data,
                                name,
                              }: {
                                data: any;
                                name: string;
                              }) => {
                                input.data = {
                                  ...input.data,
                                  ..._data,
                                };
                                name = name.trim();
                                if (input.name !== name)
                                  if (
                                    Object.keys(pageData).some((k) =>
                                      pageData[Number(k)].inputs.some(
                                        (input) => input.name === name
                                      )
                                    )
                                  ) {
                                    let number = 1;
                                    while (true) {
                                      if (
                                        Object.keys(pageData).some((k) =>
                                          pageData[Number(k)].inputs.some(
                                            (input) =>
                                              input.name === `${name} ${number}`
                                          )
                                        )
                                      ) {
                                        number++;
                                      } else break;
                                    }
                                    input.name = `${name} ${number}`;
                                  } else input.name = name;

                                setPageData({ ...pageData });
                              },
                            });
                          }}
                        />
                      </FlexChild>
                    ))}
                  </VerticalFlex>
                </RightSlot>
              ))}
            </VerticalFlex>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
function LeftSlot({
  title,
  children,
}: {
  title: React.ReactNode | string;
  children: React.ReactNode;
}) {
  const [fold, setFold] = useState(false);
  return (
    <FlexChild>
      <VerticalFlex>
        <FlexChild className={styles.slot_title}>
          <HorizontalFlex>
            <FlexChild>
              {typeof title === "string" ? <P>{title}</P> : title}
            </FlexChild>
            <FlexChild
              width={"max-content"}
              cursor="pointer"
              onClick={() => setFold(!fold)}
            >
              <Image
                src={
                  fold
                    ? "/resources/icons/up_arrow.png"
                    : "/resources/icons/down_arrow.png"
                }
                width={10}
                height={"auto"}
              />
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild hidden={fold} className={styles.slot_children}>
          {children}
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
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

function RightSlot({
  title,
  children,
}: {
  title: React.ReactNode | string;
  children: React.ReactNode;
}) {
  const [fold, setFold] = useState(false);
  return (
    <FlexChild>
      <VerticalFlex>
        <FlexChild className={styles.slot_title}>
          <HorizontalFlex>
            <FlexChild>
              {typeof title === "string" ? <P>{title}</P> : title}
            </FlexChild>
            <FlexChild
              width={"max-content"}
              cursor="pointer"
              onClick={() => setFold(!fold)}
            >
              <Image
                src={
                  fold
                    ? "/resources/icons/up_arrow.png"
                    : "/resources/icons/down_arrow.png"
                }
                width={10}
                height={"auto"}
              />
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild hidden={fold} className={styles.slot_children}>
          {children}
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
}

function FloatInput({
  pageData,
  setPageData,
  page,
  maxPage,
  input,
  selected,
  top,
  left,
  width,
  height,
  onUpdate,
  onClick,
  setSelectedInputs,
  contractUsers,
}: {
  pageData: PageData;
  setPageData: React.Dispatch<React.SetStateAction<PageData>>;
  page: number;
  maxPage: number;
  input: Data;
  selected: boolean;
  top: CSSProperties["top"];
  left: CSSProperties["left"];
  width: number;
  height: number;
  onUpdate: ({
    top,
    left,
    height,
    width,
    data,
    page,
  }: {
    top?: CSSProperties["top"];
    left?: CSSProperties["left"];
    width?: number;
    height?: number;
    data?: any;
    page?: number;
  }) => void;
  onClick: (e: any) => void;
  setSelectedInputs: React.Dispatch<React.SetStateAction<string[]>>;
  contractUsers: ContractUserDataFrame[];
}) {
  const list: {
    top: CSSProperties["top"];
    left: CSSProperties["left"];
    curosr: CSSProperties["cursor"];
    transform: CSSProperties["transform"];
    onMouseMove?: (e: MouseEvent) => void;
  }[] = [
    {
      top: 0,
      left: 0,
      curosr: "nw-resize",
      transform: "translate(-50%,-50%)",
      onMouseMove: (e) => {
        const dx = posRef.current.x - e.clientX;
        const dy = posRef.current.y - e.clientY;
        setData({ dx, dy, dt: dy, dl: dx });
      },
    },
    {
      top: 0,
      left: "50%",
      curosr: "n-resize",
      transform: "translate(-50%,-50%)",
      onMouseMove: (e) => {
        const dy = posRef.current.y - e.clientY;
        setData({ dx: 0, dy, dt: dy, dl: 0 });
      },
    },
    {
      top: 0,
      left: "100%",
      curosr: "ne-resize",
      transform: "translate(-50%,-50%)",
      onMouseMove: (e) => {
        const dx = e.clientX - posRef.current.x;
        const dy = posRef.current.y - e.clientY;
        setData({ dx, dy, dt: dy, dl: 0 });
      },
    },
    {
      top: "50%",
      left: "100%",
      curosr: "e-resize",
      transform: "translate(-50%,-50%)",
      onMouseMove: (e) => {
        const dx = e.clientX - posRef.current.x;
        setData({ dx, dy: 0, dt: 0, dl: 0 });
      },
    },
    {
      top: "100%",
      left: "100%",
      curosr: "se-resize",
      transform: "translate(-50%,-50%)",
      onMouseMove: (e) => {
        const dx = e.clientX - posRef.current.x;
        const dy = e.clientY - posRef.current.y;
        setData({ dx, dy, dt: 0, dl: 0 });
      },
    },
    {
      top: "100%",
      left: "50%",
      curosr: "s-resize",
      transform: "translate(-50%,-50%)",
      onMouseMove: (e) => {
        const dy = e.clientY - posRef.current.y;
        setData({ dx: 0, dy, dt: 0, dl: 0 });
      },
    },
    {
      top: "100%",
      left: "0%",
      curosr: "sw-resize",
      transform: "translate(-50%,-50%)",
      onMouseMove: (e) => {
        const dx = posRef.current.x - e.clientX;
        const dy = e.clientY - posRef.current.y;
        setData({ dx, dy, dt: 0, dl: dx });
      },
    },
    {
      top: "50%",
      left: "0%",
      curosr: "w-resize",
      transform: "translate(-50%,-50%)",
      onMouseMove: (e) => {
        const dx = posRef.current.x - e.clientX;
        setData({ dx, dy: 0, dt: 0, dl: dx });
      },
    },
  ];
  const _ref = useRef<any>(null);
  const posRef = useRef<any>({});
  const [select, setSelect] = useState<any>(null);
  const [data, setData] = useState<any>({ dx: 0, dy: 0, dt: 0, dl: 0 });
  const [move, setMove] = useState(false);
  useEffect(() => {
    if (select) {
      window.addEventListener("mousemove", select.onMouseMove);
      const handleMouseUp = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        setSelect(null);
        posRef.current = {};
        const div = _ref.current as HTMLElement;
        const computed = div.computedStyleMap();
        onUpdate({
          top: computed.get("top")?.toString(),
          left: computed.get("left")?.toString(),
          width: width + data.dx,
          height: height + data.dy,
        });
        setData({ dx: 0, dy: 0, dt: 0, dl: 0 });
      };
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", select.onMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [select, data]);
  useEffect(() => {
    if (move) {
      const handleMouseUp = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMove(false);
        const div = _ref.current as HTMLElement;
        const computed = div.computedStyleMap();

        let top = computed.get("top") as any;
        // const bottom = top.value + div.getBoundingClientRect().height;

        if (top.value < 0) {
          if (page === 0) top.value = 0;
          else {
            page -= 1;
            top.value +=
              (div.parentNode as HTMLElement).getBoundingClientRect().height +
              12;
          }
        } else if (
          top.value >
          (div.parentNode as HTMLElement).getBoundingClientRect().height + 12
        ) {
          if (page + 1 === maxPage)
            top.value =
              (div.parentNode as HTMLElement).getBoundingClientRect().height -
              div.getBoundingClientRect().height;
          else {
            top.value -=
              (div.parentNode as HTMLElement).getBoundingClientRect().height +
              12;
            page += 1;
          }
        }
        let left = computed.get("left") as any;
        const maxWidth: number = (
          div.parentNode as HTMLElement
        ).getBoundingClientRect().width;
        const right = left.value + div.getBoundingClientRect().width;
        if (left.value < 0) left.value = 0;
        else if (right > maxWidth) {
          left.value = maxWidth - div.getBoundingClientRect().width;
        }
        onUpdate({
          top: top?.toString(),
          left: left?.toString(),
          width: width + data.dx,
          height: height + data.dy,
          page,
        });
        posRef.current = { x: 0, y: 0 };
        setData({ dx: 0, dy: 0, dt: 0, dl: 0 });
      };
      const handleMouseMove = (e: MouseEvent) => {
        const dx = posRef.current.x - e.clientX;
        const dy = posRef.current.y - e.clientY;
        setData({ dx: 0, dy: 0, dt: dy, dl: dx });
      };
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [move]);
  return (
    <FlexChild
      id={input.name}
      Ref={_ref}
      zIndex={1}
      position="absolute"
      top={`calc(${top} - ${data.dt}px)`}
      left={`calc(${left} - ${data.dl}px)`}
      width={width + data.dx}
      height={height + data.dy}
      border={"1px dotted red"}
      cursor={selected ? "move" : "pointer"}
      onClick={onClick}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!selected) return;
        setMove(true);
        posRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        NiceModal.show("contextMenu", {
          x: e.clientX,
          y: e.clientY,
          rows: [
            {
              label: "삭제",
              key: "Delete",
              onClick: () => {
                setSelectedInputs((prev) =>
                  prev.filter((f) => f !== input.name)
                );
                Object.keys(pageData).forEach((k) => {
                  pageData[Number(k)].inputs = pageData[
                    Number(k)
                  ].inputs.filter((f) => f.name !== input.name);
                });
                setPageData({ ...pageData });
              },
            },
            {
              label: "복사",
              key: "Ctrl+C",
              onClick: () => {
                sessionStorage.setItem(
                  "copy",
                  JSON.stringify([
                    {
                      key: input.input.getKey(),
                      data: input,
                      page: Number(page),
                    },
                  ])
                );
              },
            },
            {
              label: "이름변경",
              onClick: () => {
                NiceModal.show("input", {
                  message: `${input.name}을 변경하시겠습니까?`,
                  input: [
                    {
                      label: "이름",
                      value: input.name,
                      placeHolder: input.name,
                    },
                  ],
                  confirmText: "변경",
                  cancelText: "취소",
                  onConfirm: (value: string) => {
                    value = value.trim();
                    if (value === input.name) return;
                    if (
                      Object.keys(pageData).some((k) =>
                        pageData[Number(k)].inputs.some(
                          (input) => input.name === value
                        )
                      )
                    ) {
                      let number = 1;
                      while (true) {
                        if (
                          !Object.keys(pageData).some((k) =>
                            pageData[Number(k)].inputs.some(
                              (input) => input.name === value + ` ${number}`
                            )
                          )
                        ) {
                          break;
                        } else {
                          number++;
                        }
                      }
                      input.name = value + ` ${number}`;
                    } else {
                      input.name = value;
                    }
                    setPageData({ ...pageData });
                    setSelectedInputs([]);
                  },
                });
              },
            },
            {
              label: "설정",
              onClick: () => {
                NiceModal.show("contract/setting", {
                  name: input.name,
                  input: input.input,
                  data: input.data,
                  users: contractUsers,
                  onConfirm: ({
                    data: _data,
                    name,
                  }: {
                    data: any;
                    name: string;
                  }) => {
                    input.data = {
                      ...input.data,
                      ..._data,
                    };
                    name = name.trim();
                    if (input.name !== name)
                      if (
                        Object.keys(pageData).some((k) =>
                          pageData[Number(k)].inputs.some(
                            (input) => input.name === name
                          )
                        )
                      ) {
                        let number = 1;
                        while (true) {
                          if (
                            Object.keys(pageData).some((k) =>
                              pageData[Number(k)].inputs.some(
                                (input) => input.name === `${name} ${number}`
                              )
                            )
                          ) {
                            number++;
                          } else break;
                        }
                        input.name = `${name} ${number}`;
                      } else input.name = name;

                    setPageData({ ...pageData });
                  },
                });
              },
            },
          ],
        });
      }}
    >
      <FlexChild
        position="relative"
        height={"100%"}
        fontFamily={input.fontFamily}
        fontSize={input.fontSize}
        fontWeight={input.bold ? 700 : 500}
        textDecorationLine={input.underline ? "underline" : "none"}
        fontStyle={input.italic ? "italic" : "normal"}
        textAlign={input.align}
        color={input.color}
        alignItems={input.vertical}
        backgroundColor={input.backgroundColor}
        className={styles.input}
      >
        {input?.input?.Float && (
          <input.input.Float
            name={input.name}
            onChange={(data) => onUpdate({ data })}
            data={input.data}
          />
        )}
        <FlexChild
          hidden={!selected}
          position="absolute"
          width={width + data.dx}
          height={height + data.dy}
          border={"1px solid blue"}
        >
          <FlexChild position="relative" height={"100%"}>
            {list.map((l, index) => (
              <Div
                key={index}
                width={10}
                height={10}
                border={"1px solid blue"}
                backgroundColor="#fff"
                position="absolute"
                top={l.top}
                left={l.left}
                transform={l.transform}
                cursor={l.curosr}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelect(l);
                  posRef.current = {
                    x: e.clientX,
                    y: e.clientY,
                  };
                }}
              />
            ))}
          </FlexChild>
        </FlexChild>
      </FlexChild>
    </FlexChild>
  );
}
