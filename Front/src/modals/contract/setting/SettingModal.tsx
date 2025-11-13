"use client";

import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import styles from "./SettingModal.module.css";
const SettingModal = NiceModal.create(
  ({
    name,
    input,
    data,
    onConfirm,
    width = "auto",
    height = "auto",
    slideUp = false,
    clickOutsideToClose = true,
    users,
  }: any) => {
    const [withHeader, withFooter] = [false, false];
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const inputRef = useRef<any>(null);
    const { isMobile } = useBrowserEvent();

    const onConfirmClick = async () => {
      if (isBlocked) return;
      if (!inputRef.current?.isValid?.()) return;
      setIsBlocked(true);
      const _data = inputRef.current?.getValue?.();
      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          await onConfirm(_data);
          modal.current.close();
        } else {
          onConfirm(_data);
          modal.current.close();
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
        title={"설정"}
        buttonText={buttonText}
        borderRadius={6}
        slideUp={slideUp}
        backgroundColor={"#fff"}
        className={styles.confirmModal}
      >
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
            <input.Setting
              ref={inputRef}
              users={users}
              data={data}
              name={name}
            />
            <FlexChild
              position="sticky"
              bottom={0}
              gap={10}
              justifyContent="center"
            >
              <Button
                className={styles.button}
                onClick={() => modal.current.close()}
              >
                <P>취소</P>
              </Button>
              <Button className={styles.button2} onClick={onConfirmClick}>
                <P>저장</P>
              </Button>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      </ModalBase>
    );
  }
);

export default SettingModal;
