"use client";

import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import SignaturePad from "@/components/sign/SignaturePad";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../ModalBase";
import styles from "./SignatureModal.module.css";

const SignatureModal = NiceModal.create(
  ({
    title = "",
    url,
    canvasStyle,
    onConfirm,
    withCloseButton = false,
    admin = false,
    width = "min(80%, 400px)",
    height = "auto",
    slideUp = false,
    clickOutsideToClose = true,
    classNames,
    backgroundColor,
    preventable = false, // true시 onConfirm false면 캔슬됨
  }: any) => {
    const [withHeader, withFooter] = [false, false];
    const buttonText = "close";

    const modal = useRef<any>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const { isMobile } = useBrowserEvent();
    const padRef = useRef<any>(null);
    const onConfirmClick = async () => {
      if (isBlocked) return;
      setIsBlocked(true);

      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          const result = await onConfirm(padRef.current.toDataURL());
          if (!preventable || result) modal.current.close();
        } else {
          const result = onConfirm(padRef.current.toDataURL());
          if (!preventable || result) modal.current.close();
        }
      } else {
        modal.current.close();
      }
      setIsBlocked(false);
    };
    useEffect(() => {
      if (url) {
        fetch(url)
          .then((res) => res.blob())
          .then(async (blob) => {
            const result = await new Promise((resolve, reject) => {
              const reader = new FileReader();

              // 읽기 성공 시 Data URL 반환
              reader.onloadend = () => {
                // reader.result는 'data:image/png;base64,...' 형식의 문자열
                resolve(reader.result);
              };

              // 읽기 실패 시 에러 처리
              reader.onerror = reject;

              // Data URL 형식으로 읽기 시작
              reader.readAsDataURL(blob);
            });
            console.log(result);
            padRef.current.fromDataURL(result);
          });
      }
    }, [url]);

    const onCancelClick = () => {
      padRef.current.clear();
    };

    const classCheck = classNames?.title
      ? classNames?.title
      : styles.normal_title;

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
        title={title}
        buttonText={buttonText}
        borderRadius={6}
        slideUp={slideUp}
        backgroundColor={"var(--confirmModal-bg)"}
        className={styles.confirmModal}
      >
        {(title || withCloseButton) && (
          <FlexChild
            position="absolute"
            top={15}
            left={15}
            width={"calc(100% - 30px)"}
          >
            <FlexChild justifyContent="center" position="relative">
              <FlexChild
                className={title ? classCheck : ""}
                justifyContent="center"
                padding={"0 15px 10px"}
              >
                {typeof title === "string" ? <P>{title}</P> : <>{title}</>}
              </FlexChild>
              {withCloseButton && (
                <FlexChild width={"max-content"} className={styles.close_box}>
                  <Button
                    width={"max-content"}
                    className={styles.closeButton}
                    onClick={onCancelClick}
                  >
                    <Image src="/resources/icons/closeBtn.png" size={12} />
                  </Button>
                </FlexChild>
              )}
            </FlexChild>
          </FlexChild>
        )}

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
            <FlexChild
              height={"100%"}
              alignItems="flex-start"
              className={classNames?.message}
              backgroundColor={backgroundColor}
            >
              <SignaturePad
                ref={padRef}
                canvasProps={{
                  style: canvasStyle,
                }}
              />
            </FlexChild>
            <FlexChild position="sticky" bottom={0}>
              <HorizontalFlex justifyContent={"center"}>
                <FlexChild height={48} padding={3}>
                  <div
                    className={clsx(
                      styles.confirmButton,
                      admin ? styles.admin : styles.main,
                      styles.white,
                      classNames?.cancel
                    )}
                    onClick={onCancelClick}
                  >
                    <P
                      size={16}
                      textAlign="center"
                      color={"var(--admin-text-color)"}
                    >
                      지우기
                    </P>
                  </div>
                </FlexChild>
                <FlexChild height={48} padding={3}>
                  <div
                    className={clsx(
                      styles.confirmButton,
                      admin ? styles.admin : styles.main,
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
                    <P size={16} textAlign="center" color={"#ffffff"}>
                      저장
                    </P>
                  </div>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      </ModalBase>
    );
  }
);

export default SignatureModal;
