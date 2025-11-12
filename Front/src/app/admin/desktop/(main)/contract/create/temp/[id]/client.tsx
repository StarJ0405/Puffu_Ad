"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import useNavigate from "@/shared/hooks/useNavigate";
import { exportAsPdf } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ContractInput from "../../../template/regist/class";
import styles from "./page.module.css";

export default function ({ contract }: { contract: ContractData }) {
  const navigate = useNavigate();
  const contentRef = useRef<any>(null);
  const inputs = useRef<any[]>([]);
  const [name, setName] = useState(contract.name);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [scale, setScale] = useState(100);

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
            <Button
              className={styles.button}
              onClick={async () => {
                const _data = { ...contract };
                _data.pages = _data.pages.map((page) => {
                  page.input_fields = page.input_fields.map((input) => {
                    input.value =
                      inputs.current[page.page][
                        input.metadata.name
                      ]?.getValue?.();
                    return input;
                  });
                  return page;
                });
                _data.name = name;
                console.log(_data);
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
                  onClick={() => {
                    const content = document.getElementById("print-content");
                    const printWindow = window.open(
                      "",
                      "",
                      "height=600,width=800"
                    );

                    // 1. 인쇄 CSS를 포함하여 새 창에 내용을 복사
                    printWindow?.document.write(
                      "<html><head><title>다중 페이지 인쇄</title>"
                    );

                    // 인쇄 전용 스타일 태그 추가 (여기서 page-break 속성 정의)
                    printWindow?.document.write(
                      "<style>@media print { .page-break { page-break-after: always; } }</style>"
                    );

                    printWindow?.document.write("</head><body>");
                    printWindow?.document.write(content?.innerHTML || "");
                    printWindow?.document.write("</body></html>");
                    printWindow?.document.close();
                    setTimeout(() => {
                      printWindow?.print();
                    }, 500);
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
              {contract.pages.map((page, index) => (
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
const FloatInput = forwardRef(({ input }: { input: InputFieldData }, ref) => {
  const [ci, setCi] = useState<ContractInput>();
  const [data, setData] = useState<any>();
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
    getValue() {
      return data || {};
    },
  }));

  return (
    <FlexChild
      position={"absolute"}
      top={input.metadata.top}
      left={input.metadata.left}
      minWidth={input.metadata.width}
      width={input.metadata.width}
      height={input.metadata.height}
      minHeight={input.metadata.height}
      className={clsx(styles.float, { [styles.has]: data })}
      transition={"0.5s all"}
    >
      {ci?.getWrite({
        onChange: (data) => setData(data),
        ...data,
        ...input,
        width: input.metadata.width,
        height: input.metadata.height,
      })}
    </FlexChild>
  );
});
