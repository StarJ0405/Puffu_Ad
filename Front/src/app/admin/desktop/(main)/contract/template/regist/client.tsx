"use client";

import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { toast } from "@/shared/utils/Functions";
import { Dispatch, SetStateAction, useRef, useState } from "react";
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
  ".hwp",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
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

  if (!images || images?.length === 0) return <Upload setImages={setImages} />;

  return (
    <VerticalFlex>
      {images.map((image, index) => (
        <Image src={image} key={index} />
      ))}
    </VerticalFlex>
  );
}

function Upload({
  setImages,
}: {
  setImages: Dispatch<SetStateAction<string[]>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onUploaded = async (files: FileList | null) => {
    if (!files || files?.length === 0) {
      toast({ message: "파일이 없습니다." });
      return;
    }

    const file = files[0];
    if (!checkFiles(file.name, file.type)) {
      toast({ message: "허용되지않는 파일 형식입니다." });
      return;
    }
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
              "파일 형식 : PDF, 한글, 워드, 엑셀, 파워포인트, 이미지\n파일 크기 : 최대 9MB"
            }
          </P>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
