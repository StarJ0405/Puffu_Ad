"use client";
import ModalBase from "@/modals/ModalBase";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import Button from "@/components/buttons/Button";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Image from "@/components/Image/Image";
import styles from "./AgreeContentModal.module.css";
import { useRef, useState, Dispatch, SetStateAction, } from "react";
import clsx from "clsx";
import TermContent from "@/components/agreeContent/TermContent";
import PrivacyContent from "@/components/agreeContent/privacyContent";
import Span from "@/components/span/Span";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";

type AgreeType = 'term_check' | 'privacy_check';

const AgreeContentModal = NiceModal.create(({
  onConfirm,
  onCancel,
  width = "100vw",
  height = "100dvh",
  clickOutsideToClose = true,
  withCloseButton = true,
  overflow,
  classNames,
  type,
  onlyView = false,
  setAgrees,
}: {
  onConfirm: any;
  onCancel: any
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  clickOutsideToClose: any;
  withCloseButton: any;
  overflow: any;
  classNames: any;
  type: AgreeType;
  onlyView?: boolean;
  setAgrees: Dispatch<SetStateAction<string[]>>;
}) => {
  const modal = useRef<any>(null);
  const title = "[필수] 구매조건 확인 및 결제진행 동의"
  const [withHeader, withFooter] = [false, false];
  const isMobile = useBrowserEvent();

  const onConfirmClick = () => {
    setAgrees((prev) => {
      if (!prev.includes(type)) {
        return [...prev, type];
      }
      return prev;
    });
    modal.current.close();
  };

  const onCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
    modal.current.close();
  };

  const agreeContents = {
    term_check: {
      title: "구매조건 확인 및 결제진행 동의",
      content: <TermContent size={!isMobile ? 8 : 7} />,
    },
    privacy_check: {
      title: "개인정보 수집 및 이용 동의",
      content: <PrivacyContent size={!isMobile ? 8 : 7} />, 
    }
  }


  return (
    <ModalBase
      ref={modal}
      withHeader={withHeader}
      withFooter={withFooter}
      width={width}
      height={height}
      title={title}
      withCloseButton={false}
      clickOutsideToClose={true}
      overflow={overflow}
      backgroundColor={"var(--mainBg)"}
      borderRadius={!isMobile ? 0 : 10}
    >
      <VerticalFlex className={styles.modal_body}>
        {(title || withCloseButton) && (
          <FlexChild className={styles.header_box}>
            <HorizontalFlex className={styles.header}>
              <FlexChild className={classNames?.title} justifyContent="center">
                <P>
                  <Span verticalAlign={'baseline'} hidden={onlyView}>[필수]</Span>
                  {agreeContents[type].title}
                </P>
              </FlexChild>
              {withCloseButton && (
                <FlexChild width={"max-content"}>
                  <Button
                    width={"max-content"}
                    className={styles.closeButton}
                    onClick={onCancelClick}
                  >
                    <Image src="/resources/images/closeBtnWhite2x.png" size={18} />
                  </Button>
                </FlexChild>
              )}
            </HorizontalFlex>
          </FlexChild>
        )}
        <VerticalFlex className={styles.content_wrap}>
          <FlexChild>
            {agreeContents[type].content}
          </FlexChild>
          {
            onlyView === false && (
              <FlexChild className={styles.btn_wrap}>
                <Button
                  className={clsx(
                    styles.confirmButton,
                    classNames?.confirm
                  )}
                  onClick={onConfirmClick}
                >
                  동의하기
                </Button>
              </FlexChild>
            )
          }
        </VerticalFlex>
      </VerticalFlex>
    </ModalBase>
  );
})

export default AgreeContentModal;