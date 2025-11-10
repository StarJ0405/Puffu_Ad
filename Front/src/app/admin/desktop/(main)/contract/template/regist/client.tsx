"use client";

import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { dataURLtoFile, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ContractInput from "./class";
import styles from "./page.module.css";
import { fileRequester } from "@/shared/FileRequester";

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
export function TemplateRegistClient() {
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const onCancel = () => {
    setImages([]);
    setName("");
  };

  if (!images || images?.length === 0)
    return <Upload setImages={setImages} setName={setName} />;
  else return <Setting name={name} images={images} onCancel={onCancel} />;
}

function Upload({
  setImages,
  setName,
}: {
  setImages: Dispatch<SetStateAction<string[]>>;
  setName: Dispatch<SetStateAction<string>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onUploaded = async (files: FileList | null) => {
    setIsLoading(true);
    if (!files || files?.length === 0) {
      setIsLoading(false);
      toast({ message: "파일이 없습니다." });
      return;
    }

    const file = files[0];
    if (!checkFiles(file.name, file.type)) {
      setIsLoading(false);
      toast({ message: "허용되지않는 파일 형식입니다." });
      return;
    }
    if (file.size > 1024 * 1024 * 9) {
      setIsLoading(false);
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
      setImages(result);
    }
    setIsLoading(false);
  };
  const checkFiles = (name: string, type: string) => {
    return (
      includes.some((inc) => name.endsWith(inc)) ||
      mtypes.some((m) => m.check(type))
    );
  };
  return (
    <VerticalFlex className={styles.upload}>
      <input
        type="file"
        ref={inputRef}
        hidden
        accept={[...includes, ...mtypes.map((m) => m.name)].join(",")}
        onChange={(e) => {
          onUploaded(e.target.files);
          e.target.value = "";
        }}
      />
      <FlexChild className={styles.title}>
        <P>파일 업로드</P>
      </FlexChild>
      <FlexChild>
        <VerticalFlex
          className={styles.dropzone}
          hidden={!isLoading}
          minHeight={464}
          justifyContent="center"
        >
          <LoadingSpinner paddingBottom={0} width={100} height={100} />
        </VerticalFlex>
        <VerticalFlex
          hidden={isLoading}
          className={styles.dropzone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            (e.target as HTMLElement).classList.remove(styles.hover);
            onUploaded(e.dataTransfer.files);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            (e.target as HTMLElement).classList.add(styles.hover);
          }}
          onDragLeave={(e) => {
            (e.target as HTMLElement).classList.remove(styles.hover);
          }}
        >
          <Image src="/resources/icons/drop.png" size={60} />
          <P className={styles.dragText}>여기에 파일을 드래그 하세요.</P>
          <P className={styles.or}>또는</P>
          <Button
            className={styles.button}
            onClick={() => inputRef.current?.click()}
          >
            <P>내 컴퓨터에서 파일 선택</P>
          </Button>
          <P className={styles.format}>
            {
              "파일 형식 : PDF, 이미지\n파일 크기 : 최대 9MB"
              // "파일 형식 : PDF, 한글, 워드, 엑셀, 파워포인트, 이미지\n파일 크기 : 최대 9MB"
            }
          </P>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

interface Data {
  input: ContractInput;
  id: string;
  top: React.CSSProperties["top"];
  left: React.CSSProperties["left"];
  width: number;
  height: number;
}
interface PageData {
  [key: number]: {
    page: number;
    inputs: Data[];
  };
}
function Setting({
  name: origin_name,
  images,
  onCancel,
}: {
  name: string;
  images: string[];
  onCancel: () => void;
}) {
  const contentRef = useRef<any>(null);
  const inputs = useRef<any>({});
  const mouseRef = useRef<any>(null);
  const [name, setName] = useState(origin_name);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [scale, setScale] = useState(100);
  const [contractUsers, setContractUser] = useState<ContractUserDataFrame[]>([
    {
      name: "발송인",
    },
    {
      name: "참여자 1",
    },
  ]);
  const [selectedUser, setSelectedUser] = useState<string>("발송인");
  const [selectedInput, setSelectedInput] = useState<ContractInput>();
  const [selectFontFamilly, setFontFamilly] = useState<string>("");
  const [extra, setExtra] = useState(false);
  const [fold, setFold] = useState(true);
  const [data, setData] = useState<PageData>({});
  const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
  const exportAsPdf = async (input: HTMLElement) => {
    if (!input) {
      console.error("PDF로 변환할 요소를 찾을 수 없습니다.");
      return;
    }

    try {
      // 1. 📸 html2canvas로 DOM 요소를 캡처하여 Canvas 생성
      const canvas = await html2canvas(input, {
        scale: 2, // 해상도 높이기 위해 스케일 팩터 사용
        useCORS: true, // 외부 이미지를 포함할 경우 필수
      });

      // 2. 🖼️ Canvas를 이미지 데이터(PNG)로 변환
      const imgData = canvas.toDataURL("image/png");

      // 3. 📄 jsPDF 인스턴스 생성 및 크기 계산
      const pdf = new jsPDF("p", "mm", "a4"); // 'p': 세로, 'mm': 단위, 'a4': 용지 크기
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width; // 이미지 비율 유지

      // 4. 🖼️ 이미지 데이터를 PDF에 추가 (X, Y 좌표, 너비, 높이)
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);

      // 5. 💾 파일 저장
      pdf.save("component_export.pdf");
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
    }
  };
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
                  onConfirm: onCancel,
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
                  name,
                  pages: images.map((_, key) => ({
                    page: Number(key),
                    image: images[Number(key)],
                    inputs:
                      data[Number(key)]?.inputs?.map((input) => ({
                        type: input.input.getKey(),
                        metadata: {
                          id: input.id,
                          top: input.top,
                          left: input.left,
                          width: input.width,
                          height: input.height,
                        },
                      })) || [],
                  })),
                };
                const formData = new FormData();
                _data.pages.forEach((page) => {
                  const file = dataURLtoFile(
                    page.image,
                    `${_data.name}_${page.page}.png`
                  );
                  formData.append("files", file);
                });
                const { urls } = await fileRequester.upload(
                  formData,
                  "/contract"
                );
                _data.pages = _data.pages.map((page, index) => {
                  page.image = urls[index];
                  return page;
                });
                console.log(_data);
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
                  {ContractInput.getList().map((input) => (
                    <input.Input
                      key={input.key}
                      selected={selectedInput?.key === input.key}
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
                          disabled
                          zIndex={1}
                          width={150}
                          maxWidth={150}
                          classNames={{ header: styles.selectHeader }}
                          options={[
                            { value: "Pretendard", display: "Pretendard" },
                            { value: "NotoSans", display: "구글 본고딕" },
                            {
                              value: "NanumBarunGothic",
                              display: "나눔 바른 고딕",
                            },
                            { value: "BrushFont", display: "나눔 붓글씨" },
                            { value: "NanumGothic", display: "sksnarhelr" },
                            { value: "NanumHuman", display: "나눔휴먼" },
                            { value: "NanumMyeongjo", display: "나눔명조" },
                            { value: "NanumPen", display: "나눔펜" },
                            {
                              value: "NanumSqaureNeo",
                              display: "나눔스퀘어네오",
                            },
                            { value: "Sacheon", display: "사천항공체" },
                          ]}
                          value={selectFontFamilly}
                          onChange={(value) => setFontFamilly(value as string)}
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
                          disabled
                          ref={(el) => {
                            inputs.current["fontsize"] = el;
                          }}
                          value={16}
                          min={1}
                          max={150}
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
                        color={true ? "#d0d0d0" : undefined}
                      >
                        <Icon
                          src="contract/"
                          name="bold"
                          type="svg"
                          cursor="pointer"
                          size={15}
                        />
                      </FlexChild>
                      <FlexChild
                        className={styles.slot}
                        color={true ? "#d0d0d0" : undefined}
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
                        className={styles.slot}
                        color={true ? "#d0d0d0" : undefined}
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
                        color={true ? "#d0d0d0" : undefined}
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
                            color={true ? "#d0d0d0" : undefined}
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
                            color={true ? "#d0d0d0" : undefined}
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
                            color={true ? "#d0d0d0" : undefined}
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
                            color={true ? "#d0d0d0" : undefined}
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
                            color={true ? "#d0d0d0" : undefined}
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
                            color={true ? "#d0d0d0" : undefined}
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
                            color={true ? "#d0d0d0" : undefined}
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
                      onMouseUp={(e) => {
                        if (!selectedInput || !mouseRef.current) return;

                        if (!data[index])
                          data[index] = { page: index, inputs: [] };

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
                            !Object.keys(data).some((key) => {
                              return data[Number(key)].inputs.some(
                                (f) => f.id === `${id} ${number}`
                              );
                            })
                          ) {
                            break;
                          } else {
                            number++;
                          }
                        }
                        data[index].inputs.push({
                          top,
                          left,
                          input: selectedInput,
                          id: `${id} ${number}`,
                          height: selectedInput.getHeight(),
                          width: selectedInput.getWidth(),
                        });
                        setSelectedInputs([`${id} ${number}`]);
                        setData({ ...data });
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
                      {data[index]?.inputs?.map((input, idx) => (
                        <FloatInput
                          key={input.id}
                          input={input}
                          top={`calc(${input.top} * ${scale / 100})`}
                          left={`calc(${input.left} * ${scale / 100})`}
                          selected={selectedInputs.some(
                            (id) => id === input.id
                          )}
                          width={(input.width * scale) / 100}
                          height={(input.height * scale) / 100}
                          onUpdate={({ width, height, top, left }) => {
                            const input = data[index].inputs[idx];
                            input.width = width;
                            input.height = height;
                            input.top = top;
                            input.left = left;
                            setData({ ...data });
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.ctrlKey || e.shiftKey) {
                              if (selectedInputs.includes(input.id)) {
                                setSelectedInputs(
                                  selectedInputs.filter((id) => id !== input.id)
                                );
                              } else {
                                setSelectedInputs([
                                  ...selectedInputs,
                                  input.id,
                                ]);
                              }
                            } else {
                              if (
                                selectedInputs.length === 0 &&
                                selectedInputs?.[0] === input.id
                              ) {
                                setSelectedInputs([]);
                              } else setSelectedInputs([input.id]);
                            }
                          }}
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
                  {Object.keys(data).reduce((acc, now) => {
                    return acc + data[Number(now)].inputs.length;
                  }, 0)}
                </P>
              </FlexChild>
              {images.map((_, page) => (
                <RightSlot key={page} title={`${Number(page) + 1} 페이지`}>
                  <VerticalFlex>
                    {data[Number(page)]?.inputs?.map((input) => (
                      <FlexChild
                        key={input.id}
                        className={clsx(styles.slot, {
                          [styles.selected]: selectedInputs.some(
                            (id) => id === input.id
                          ),
                        })}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.shiftKey)
                            setSelectedInputs([...selectedInputs, input.id]);
                          else setSelectedInputs([input.id]);
                          document.getElementById(input.id)?.scrollIntoView();
                        }}
                      >
                        {input.input.getIcon(24)}
                        <P>{input.id}</P>
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
  input,
  selected,
  top,
  left,
  width,
  height,
  onUpdate,
  onClick,
}: {
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
  }: {
    top: CSSProperties["top"];
    left: CSSProperties["left"];
    width: number;
    height: number;
  }) => void;
  onClick: (e: any) => void;
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
        onUpdate({
          top: computed.get("top")?.toString(),
          left: computed.get("left")?.toString(),
          width: width + data.dx,
          height: height + data.dy,
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
      id={input.id}
      Ref={_ref}
      position="absolute"
      top={`calc(${top} - ${data.dt}px)`}
      left={`calc(${left} - ${data.dl}px)`}
      width={width + data.dx}
      height={height + data.dy}
      border={"1px dotted red"}
      cursor="move"
      onClick={onClick}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setMove(true);
        posRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }}
    >
      <FlexChild position="relative" height={"100%"}>
        {input.input.getInput()}
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
