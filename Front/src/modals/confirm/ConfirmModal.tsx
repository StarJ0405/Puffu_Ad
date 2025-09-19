"use client";

import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useRef, useState } from "react";
import ModalBase from "../ModalBase";
import styles from "./ConfirmModal.module.css";
import Image from "@/components/Image/Image";

const ConfirmModal = NiceModal.create(
  ({
    title = "",
    onConfirm,
    onCancel,
    message,
    cancelText,
    confirmText,
    withCloseButton = false,
    admin = false,
    width = "min(80%, 400px)",
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

    const onConfirmClick = async () => {
      if (isBlocked) return;
      setIsBlocked(true);
      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          const result = await onConfirm();
          if (!preventable || result) modal.current.close();
        } else {
          const result = onConfirm();
          if (!preventable || result) modal.current.close();
        }
      } else {
        modal.current.close();
      }
      setIsBlocked(false);
    };

    const onCancelClick = () => {
      if (onCancel) {
        onCancel();
        // modalClose();
      }
      modal.current.close();
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
        title={title}
        buttonText={buttonText}
        borderRadius={6}
        slideUp={slideUp}
      >
        {(title || withCloseButton) && (
          <FlexChild
            position="absolute"
            top={15}
            left={15}
            width={"calc(100% - 30px)"}
          >
            <HorizontalFlex>
              <FlexChild className={classNames?.title}>
                {typeof title === "string" ? <P>{title}</P> : <>{title}</>}
              </FlexChild>
              {withCloseButton && (
                <FlexChild width={"max-content"}>
                  <Button
                    width={"max-content"}
                    className={styles.closeButton}
                    onClick={onCancelClick}
                  >
                    <Image src="/resources/icons/closeBtn.png" size={12} />
                  </Button>
                </FlexChild>
              )}
            </HorizontalFlex>
          </FlexChild>
        )}

        <FlexChild
          padding={!isMobile ? "50px 15px 15px 24px" : "30px 10px 20px"}
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
            >
              {typeof message === "string" ? (
                <P
                  width="100%"
                  textAlign="center"
                  size={isMobile ? 16 : 18}
                  color={"#494949"}
                  weight={600}
                >
                  {message}
                </P>
              ) : (
                <>{message}</>
              )}
            </FlexChild>
            <FlexChild position="sticky" bottom={0}>
              <HorizontalFlex justifyContent={"center"}>
                {cancelText && (
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
                        {cancelText}
                      </P>
                    </div>
                  </FlexChild>
                )}
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
                      {confirmText}
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

export default ConfirmModal;
