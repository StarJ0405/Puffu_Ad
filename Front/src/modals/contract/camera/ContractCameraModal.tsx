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
import styles from "./ContractCameraModal.module.css";

const ContractCameraModal = NiceModal.create(
  ({
    list,
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
    const [image, setImage] = useState<string>("");
    const onConfirmClick = async () => {
      if (isBlocked) return;
      setIsBlocked(true);

      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          const result = await onConfirm({ url: image });
          if (!preventable || result) modal.current.close();
        } else {
          const result = onConfirm({ url: image });
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
        title={"이미지"}
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
          <P>이미지</P>
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
            <FlexChild height={"100%"} alignItems="flex-start" minHeight={500}>
              <Upload image={image} setImage={setImage} />
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
  image,
  setImage,
}: {
  image: string;
  setImage: Dispatch<SetStateAction<string>>;
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
    if (!file.type.startsWith("image/")) {
      setIsLoading(false);
      toast({ message: "허용되지않는 파일 형식입니다." });
      return;
    }
    if (file.size > 1024 * 1024 * 9) {
      setIsLoading(false);
      toast({ message: "파일의 용량이 제한된 크기를 넘겼습니다." });
      return;
    }
    const reader = new FileReader();
    // 3. 파일 읽기가 완료되었을 때 실행될 이벤트 핸들러 정의
    reader.onload = function (e) {
      // e.target.result에 Base64 문자열이 담겨 있습니다.
      const base64String = e.target?.result;
      setImage(base64String as string);
    };
    reader.readAsDataURL(file);

    setIsLoading(false);
  };

  return (
    <VerticalFlex className={styles.upload}>
      <input
        type="file"
        ref={inputRef}
        hidden
        accept={"image/*"}
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
          className={clsx(styles.dropzone, { [styles.url]: image })}
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
          {image ? (
            <Image src={image} width={"100%"} />
          ) : (
            <>
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
                {"파일 형식 : 이미지\n파일 크기 : 최대 9MB"}
              </P>
            </>
          )}
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
export default ContractCameraModal;
