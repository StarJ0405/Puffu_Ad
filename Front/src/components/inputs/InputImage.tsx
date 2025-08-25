"use client";
import { fileRequester } from "@/shared/FileRequester";
import { toast } from "@/shared/utils/Functions";
import clsx from "clsx";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ImageCompnent from "../Image/Image";
import P from "../P/P";
import Button from "../buttons/Button";
import FlexChild from "../flex/FlexChild";
import FlexGrid from "../flex/FlexGrid";
import VerticalFlex from "../flex/VerticalFlex";
import styles from "./InputImage.module.css";
interface InputImageProps {
  name?: string;
  path?: string;
  value?: string[] | string;
  multiple?: boolean;
  disabled?: boolean;
  placeHolder?: string;
  maxFiles?: number;
  minFiles?: number;
  frame?: boolean; // 디자인 부분 제거
}

const InputImage = forwardRef(
  (
    {
      name,
      path,
      value,
      multiple,
      disabled,
      placeHolder,
      maxFiles,
      minFiles,
      frame = true,
    }: InputImageProps,
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<any[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [target, setTarget] = useState(-1);

    const processFileToImage = useCallback(async (file: File) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            source: file,
            url: reader.result as string, // Base64 preview
            name: file.name,
            type: file.type,
            size: file.size,
          });
        };
        reader.onerror = () => {
          toast({
            message: `이미지 미리보기를 생성할 수 없습니다. (${file.name})`,
          });
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    }, []);
    const handleImageChange = useCallback(
      async (files: File[]) => {
        if (multiple) {
          if (maxFiles) {
            const length = images.length + files.length;
            if (length > maxFiles) {
              return toast({
                message: `최대 ${maxFiles}개의 이미지만 선택할 수 있습니다.`,
              });
            }
          }
        } else if (files.length > 1) {
          return toast({
            message: `최대 1개의 이미지만 선택할 수 있습니다.`,
          });
        }

        const newFiles = (
          await Promise.all(files.map(processFileToImage))
        ).filter(Boolean);
        if (multiple) setImages((prev) => [...prev, ...newFiles]);
        else setImages(newFiles);
      },
      [images]
    );
    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (
          disabled ||
          isUploading ||
          !e.target.files ||
          e.target.files.length === 0
        ) {
          e.target.value = "";
          return setTarget(-1);
        }
        handleImageChange(Array.from(e.target.files));
        e.target.value = "";
      },
      [isUploading, disabled, images]
    );
    const handleFileReplace = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (target < 0 || !e.target.files || e.target.files.length !== 1)
          return (e.target.value = "");
        const file = Array.from(e.target.files)[0];
        const newFile = await processFileToImage(file);
        setImages((prev) => {
          prev[target] = newFile;
          return [...prev];
        });
        e.target.value = "";
      },
      [target]
    );
    useImperativeHandle(ref, () => ({
      getName() {
        return name;
      },
      getValue() {
        const urls = resultRef?.current?.map((image) => image.url);
        return multiple ? urls : urls?.[0] || "";
      },
      async isValid() {
        if (disabled) return true;
        if (minFiles && minFiles < images.length) {
          toast({ message: `최소 ${minFiles}개의 이미지를 선택해야 합니다.` });
          return false;
        }

        if (multiple) {
          if (maxFiles && maxFiles > images.length) {
            toast({
              message: `최대 ${maxFiles}개의 이미지만 선택할 수 있습니다.`,
            });
            return false;
          }
        } else if (images.length > 1) {
          toast({
            message: `최대 1개의 이미지만 선택할 수 있습니다.`,
          });
          return false;
        }
        const preFiles = images.filter((f) => !f.source);
        const uploadFiles = images.filter((f) => !!f.source);
        if (uploadFiles.length === 0) {
          return true;
        }
        setIsUploading(true);
        const formData = new FormData();
        uploadFiles.forEach((image) =>
          formData.append("files", image.source as File)
        );
        const response: any = await fileRequester.upload(formData, path);
        const uploadedUrls = (response?.urls || []) as string[];
        resultRef.current = [
          ...preFiles,
          ...uploadedUrls.map((url) => {
            const split = url?.split("/");
            const name = split?.[split?.length - 1] || "";
            return {
              url: url,
              name: name.slice(Math.max(Math.min(30, name.length - 5), 0)),
            };
          }),
        ];
        setImages(resultRef.current);
        setIsUploading(false);
        return true;
      },
      empty() {
        setImages([]);
        setTarget(-1);
      },
    }));
    useEffect(() => {
      const values = value ? (Array.isArray(value) ? value : [value]) : [];
      setImages(
        values
          .map((url) => {
            const split = url?.split("/");
            const name = split?.[split?.length - 1] || "";
            return {
              url: url,
              name: name.slice(Math.max(Math.min(30, name.length - 5), 0)),
            };
          })
          .filter(Boolean)
      );
    }, [value]);
    useEffect(() => {
      resultRef.current = images;
    }, [images]);
    return (
      <div className={styles.container}>
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          className={styles.fileInput}
          multiple={multiple}
          disabled={disabled || isUploading}
          onChange={handleFileChange}
        />
        <input
          ref={replaceRef}
          type="file"
          onChange={handleFileReplace}
          disabled={disabled || isUploading}
          className={styles.fileInput}
        />
        {frame && (
          <DropZone
            disabled={disabled || isUploading}
            classNames={{
              dropzone: styles.dropzone,
              dragOver: styles.dragOver,
              disabled: styles.disabled,
            }}
            onClick={() => {
              fileInputRef.current?.click();
            }}
            onChange={handleImageChange}
          >
            {images?.length === 0 ? (
              <VerticalFlex justifyContent="center" gap={10}>
                <FlexChild justifyContent="center" gap={10}>
                  <ImageCompnent src="/resources/icons/photo 1.svg" size={45} />
                  <ImageCompnent
                    src="/resources/icons/add-folder 1.svg"
                    size={45}
                  />
                </FlexChild>
                <FlexChild justifyContent="center">
                  <P>이미지 파일을 드래그 앤 드롭해주세요</P>
                </FlexChild>
                <FlexChild justifyContent="center">
                  {placeHolder && (
                    <P className={styles.placeHolder}>({placeHolder})</P>
                  )}
                </FlexChild>
                <FlexChild justifyContent="center">
                  <Button styleType="admin" fontSize={16} padding={"8px 16px"}>
                    업로드
                  </Button>
                </FlexChild>
              </VerticalFlex>
            ) : (
              <FlexGrid
                columns={`min(6,${images.length})`}
                rows={`max(${images.length / 6},1)`}
              >
                {images.map((image, index) => (
                  <FlexChild
                    key={`${image.url.slice(image.url.length - 5)}_${index}`}
                  >
                    <VerticalFlex justifyContent="center" gap={10}>
                      <ImageCompnent src={image.url} size={100} />
                      <P fontSize={"small"}>{image?.name}</P>
                      <FlexChild justifyContent="center" gap={5}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (disabled || isUploading) return;
                            setTarget(index);
                            replaceRef.current?.click();
                          }}
                          className={styles.button1}
                          styleType="admin2"
                        >
                          변경
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (disabled || isUploading) return;
                            setImages((prev) =>
                              prev.filter((_, idx) => idx !== index)
                            );
                          }}
                          styleType="white"
                        >
                          삭제
                        </Button>
                      </FlexChild>
                    </VerticalFlex>
                  </FlexChild>
                ))}
              </FlexGrid>
            )}
          </DropZone>
        )}
      </div>
    );
  }
);

export function DropZone({
  children,
  disabled,
  classNames,
  onChange,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  classNames?: {
    dropzone?: React.HTMLAttributes<HTMLDivElement>["className"];
    dragOver?: React.HTMLAttributes<HTMLDivElement>["className"];
    disabled?: React.HTMLAttributes<HTMLDivElement>["className"];
  };
  onChange?: (files: File[]) => void;
  onClick?: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      onClick?.();
    },
    [disabled]
  );
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) setIsDragOver(false);
      else setIsDragOver(true);
    },
    [disabled]
  );
  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onChange?.(Array.from(e.dataTransfer.files));
      }
    },
    [disabled]
  );

  return (
    <div
      className={clsx(classNames?.dropzone, {
        [`${classNames?.dragOver}`]: isDragOver,
        [`${classNames?.disabled}`]: disabled,
      })}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}
InputImage.displayName = "InputImage";

export default InputImage;
