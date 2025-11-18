"use client";

import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import styles from "./ContractUploadModal.module.css";
interface FileType {
  name: string;
  index: number;
  images: string[];
}
const ContractUploadModal = NiceModal.create(
  ({
    files: preFiles = [],
    min,
    max,
    fileSize,
    onConfirm,
    width = "min(80%, 800px)",
    height = "auto",
    slideUp = false,
    clickOutsideToClose = true,
    classNames,
    preventable = false, // true시 onConfirm false면 캔슬됨
  }: any) => {
    const [withHeader, withFooter] = [false, false];
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const { isMobile } = useBrowserEvent();
    const [files, setFiles] = useState<FileType[]>(preFiles);
    const onConfirmClick = async () => {
      if (isBlocked) return;
      setIsBlocked(true);

      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          const result = await onConfirm({
            value: { files },
          });
          if (!preventable || result) modal.current.close();
        } else {
          const result = onConfirm({ value: { files } });
          if (!preventable || result) modal.current.close();
        }
      } else {
        modal.current.close();
      }
      setIsBlocked(false);
    };

    return (
      <ModalBase
        zIndex={10055}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={false}
        clickOutsideToClose={clickOutsideToClose}
        title={"첨부"}
        buttonText={buttonText}
        borderRadius={6}
        slideUp={slideUp}
        backgroundColor={"var(--confirmModal-bg)"}
        className={styles.confirmModal}
      >
        <FlexChild
          position="absolute"
          top={15}
          left={15}
          className={styles.title}
        >
          <P>첨부</P>
        </FlexChild>

        <FlexChild
          padding={!isMobile ? "50px 15px 24px" : "40px 10px 20px"}
          height={"100%"}
          position="relative"
        >
          <VerticalFlex
            gap={20}
            // height="calc(min(100%,100dvh) - 48px)"
            maxHeight="calc(min(100%,100dvh) - 48px)"
            overflowY="scroll"
            hideScrollbar
          >
            <FlexChild height={"100%"} alignItems="flex-start">
              <Upload
                setFiles={setFiles}
                files={files}
                fileSize={fileSize}
                max={max}
                min={min}
              />
            </FlexChild>
            <FlexChild>
              <VerticalFlex margin={20} backgroundColor="#fff" padding={10}>
                {files.length === 0 && <P>첨부된 파일이 없습니다.</P>}
                {files.map((file) => (
                  <FlexChild key={`${file.index}_${file.name}`}>
                    <HorizontalFlex gap={5}>
                      <FlexChild width={"max-content"}>
                        <P>({file.index + 1})</P>
                      </FlexChild>
                      <FlexChild>
                        <P>{file.name}</P>
                      </FlexChild>
                      <FlexChild width={"max-content"}>
                        <Image
                          src="/resources/images/closeBtn2x_2.png"
                          size={16}
                          cursor="pointer"
                          onClick={() => {
                            setFiles(
                              files
                                .sort((f1, f2) => f1.index - f2.index)
                                .filter((f) => f.index !== file.index)
                                .map((file, index) => ({
                                  name: file.name,
                                  images: file.images,
                                  index,
                                }))
                            );
                          }}
                        />
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                ))}
              </VerticalFlex>
            </FlexChild>
            <FlexChild position="sticky" bottom={0}>
              <FlexChild>
                <HorizontalFlex>
                  <FlexChild
                    height={48}
                    padding={3}
                    width={"max-content"}
                  ></FlexChild>
                  <FlexChild width={"max-content"}>
                    <HorizontalFlex justifyContent={"center"}>
                      <FlexChild height={48} padding={3}>
                        <div
                          className={clsx(
                            styles.confirmButton,
                            styles.white,
                            classNames?.cancel
                          )}
                          onClick={() => modal.current.close()}
                        >
                          <P
                            size={16}
                            textAlign="center"
                            color={"var(--admin-text-color)"}
                            minWidth={100}
                          >
                            취소
                          </P>
                        </div>
                      </FlexChild>
                      <FlexChild height={48} padding={3}>
                        <div
                          className={clsx(
                            styles.confirmButton,
                            classNames?.confirm
                          )}
                          onClick={onConfirmClick}
                        >
                          {isBlocked && (
                            <FlexChild
                              position={"absolute"}
                              justifyContent={"center"}
                              hidden={!isBlocked}
                            >
                              <LoadingSpinner />
                            </FlexChild>
                          )}
                          <P
                            size={16}
                            textAlign="center"
                            color={"#ffffff"}
                            minWidth={100}
                          >
                            저장
                          </P>
                        </div>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      </ModalBase>
    );
  }
);

function Upload({
  setFiles,
  files,
  fileSize,
  min,
  max,
}: {
  setFiles: Dispatch<SetStateAction<FileType[]>>;
  files: FileType[];
  fileSize: number;
  min: number;
  max: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onUploaded = async (_files: FileList | null) => {
    if (!_files || _files?.length === 0) {
      toast({ message: "파일이 없습니다." });
      return;
    }
    if (files.length >= max) {
      toast({ message: "최대 파일 개수를 초과했습니다." });
      return;
    }

    const file = _files[0];
    if (!checkFiles(file.name, file.type)) {
      toast({ message: "허용되지않는 파일 형식입니다." });
      return;
    }
    if (file.size > 1024 * 1024 * fileSize) {
      toast({ message: "파일의 용량이 제한된 크기를 넘겼습니다." });
      return;
    }
    const index = file.name.lastIndexOf(".");
    let name = file.name.slice(0, index);
    let number = 1;
    if (files.some((file) => file.name === name))
      while (true) {
        if (files.some((file) => file.name === `${name} (${number})`)) {
          number++;
          continue;
        } else {
          name = `${name} (${number})`;
          break;
        }
      }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      // 3. 파일 읽기가 완료되었을 때 실행될 이벤트 핸들러 정의
      reader.onload = function (e) {
        // e.target.result에 Base64 문자열이 담겨 있습니다.
        const base64String = e.target?.result;

        setFiles([
          ...files,
          {
            name,
            index: files.length,
            images: [base64String as string],
          },
        ]);
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
      setFiles([
        ...files,
        {
          name,
          index: files.length,
          images: result,
        },
      ]);
    }
  };

  return (
    <VerticalFlex className={styles.upload}>
      <input
        type="file"
        ref={inputRef}
        hidden
        accept={"image/*,.pdf"}
        onChange={(e) => {
          onUploaded(e.target.files);
          e.target.value = "";
        }}
      />
      {/* <FlexChild className={styles.title}>
        <P>파일 업로드</P>
      </FlexChild> */}
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
          className={clsx(styles.dropzone)}
          padding={20}
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
            {"파일 형식 : 이미지, PDF\n파일 크기 : 최대 9MB"}
          </P>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

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
    const pageIndex = pageNum - 1; // index 확정

    const pageObj = await pdf.getPage(pageNum);
    const originalViewport = pageObj.getViewport({ scale: 1 });
    const scale = A4_WIDTH_PX / originalViewport.width;
    const viewport = pageObj.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = A4_WIDTH_PX;
    canvas.height = A4_HEIGHT_PX;

    // 렌더링 완료 순서 무관하게 index 에 직접 넣기
    await new Promise<void>((resolve) => {
      const task = pageObj.render({
        canvas: canvas,
        canvasContext: ctx,
        viewport,
      });
      task.promise.then(() => {
        base64Pages[pageIndex] = canvas.toDataURL("image/png");
        resolve();
      });
    });
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
export default ContractUploadModal;
