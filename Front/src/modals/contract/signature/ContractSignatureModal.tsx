"use client";

import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import FlexGrid from "@/components/flex/FlexGrid";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import Select from "@/components/select/Select";
import SignaturePad from "@/components/sign/SignaturePad";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import styles from "./ContractSignatureModal.module.css";
const fonts = [
  "--font-barun-gothic",
  "--font-gothic",
  "--font-human",
  "--font-myeongjo",
  "--font-pen",
  "--font-square-neo",
  "--font-pretendard",
  "--font-notosans",
  "--font-sacheon",
];
const ContractSignatureModal = NiceModal.create(
  ({
    url,
    onConfirm,
    width = "min(80%, 800px)",
    height = "auto",
    slideUp = false,
    clickOutsideToClose = true,
    classNames,
    preventable = false, // true시 onConfirm false면 캔슬됨
    name: pre_name = "",
    tabs = ["그리기", "텍스트"],
    penSize = 1,
    penColor = "#000000",
  }: any) => {
    const [withHeader, withFooter] = [false, false];
    const buttonText = "close";
    const [tab, setTab] = useState<string>("그리기");
    const [lang, setLang] = useState<string>("ko");
    const modal = useRef<any>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const { isMobile } = useBrowserEvent();
    const padRef = useRef<any>(null);
    const [fontImages, setFontImages] = useState<
      { name: string; url: string }[]
    >([]);
    const [select, setSelect] = useState<string>(fonts[0]);
    const onConfirmClick = async () => {
      if (isBlocked) return;
      setIsBlocked(true);

      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          const result = await onConfirm({ url: padRef.current.toDataURL() });
          if (!preventable || result) modal.current.close();
        } else {
          const result = onConfirm({ url: padRef.current.toDataURL() });
          if (!preventable || result) modal.current.close();
        }
      } else {
        modal.current.close();
      }
      setIsBlocked(false);
    };
    const onConfirmClick2 = async () => {
      if (isBlocked) return;
      setIsBlocked(true);
      const url = fontImages.find((f) => f.name === select)?.url;

      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          const result = await onConfirm({ url });
          if (!preventable || result) modal.current.close();
        } else {
          const result = onConfirm({ url });
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
            padRef.current.fromDataURL(result);
          });
      }
    }, [url]);

    useEffect(() => {
      if (pre_name) createSignal();
    }, [pre_name]);
    const onCancelClick = () => {
      padRef.current.clear();
    };

    const createSignal = async () => {
      let value = (document.getElementById("name") as HTMLInputElement).value;
      value = value.trim();

      setFontImages(fonts.map((font) => ({ name: font, url: "" })));

      fonts.forEach(async (font, index) => {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.height = "93.5px";
        div.style.width = "auto";
        div.style.zIndex = "100000";
        div.style.backgroundColor = "transparent";
        const p = document.createElement("p");
        div.style.padding = "5px";
        p.style.fontFamily = `var(${font})`;
        p.style.textAlign = "center";
        p.style.margin = "0";
        p.style.lineHeight = "1.1";
        p.style.fontSize = "85px";
        p.innerHTML = value;
        document.body.appendChild(div);
        div.appendChild(p);

        const canvas = await html2canvas(div, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        });
        const imgData = canvas.toDataURL("image/png");
        div.remove();
        setFontImages((prev) => {
          prev[index] = { name: font, url: imgData };
          return [...prev];
        });
      });
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
        title={"서명"}
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
          <P>서명</P>
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
            <FlexChild>
              {tabs.map((text: string) => (
                <P
                  className={clsx(styles.tab, {
                    [styles.selected]: tab === text,
                  })}
                  onClick={() => setTab(text as any)}
                  key={text}
                >
                  {text}
                </P>
              ))}
            </FlexChild>
            {tab === "그리기" ? (
              <>
                <FlexChild
                  height={"100%"}
                  alignItems="flex-start"
                  className={classNames?.message}
                  backgroundColor={"#fff"}
                  minHeight={500}
                >
                  <SignaturePad
                    ref={padRef}
                    velocityFilterWeight={0}
                    minWidth={penSize * 0.5}
                    maxWidth={penSize * 0.5}
                    penColor={penColor}
                    canvasProps={{
                      style: { width: "100%", height: "100%", minHeight: 500 },
                    }}
                  />
                </FlexChild>
                <FlexChild position="sticky" bottom={0}>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild height={48} padding={3} width={"max-content"}>
                        <div
                          className={clsx(
                            styles.confirmButton,
                            styles.white,
                            classNames?.cancel
                          )}
                          onClick={onCancelClick}
                        >
                          <P
                            size={16}
                            textAlign="center"
                            color={"var(--admin-text-color)"}
                            minWidth={100}
                          >
                            초기화
                          </P>
                        </div>
                      </FlexChild>
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
              </>
            ) : (
              <>
                <FlexChild>
                  <VerticalFlex>
                    <FlexChild>
                      <HorizontalFlex gap={10}>
                        <FlexChild width={150}>
                          <Select
                            width={150}
                            maxWidth={150}
                            zIndex={10830}
                            classNames={{ header: styles.selectHeader }}
                            value={lang}
                            onChange={(value) => setLang(value as string)}
                            options={[
                              {
                                display: "한국어",
                                value: "ko",
                              },
                              {
                                display: "영어",
                                value: "en",
                              },
                            ]}
                          />
                        </FlexChild>
                        <FlexChild>
                          <Input
                            id="name"
                            value={pre_name}
                            className={styles.input}
                            width={"100%"}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") createSignal();
                            }}
                          />
                        </FlexChild>
                        <FlexChild width={"max-content"}>
                          <Button
                            className={styles.button}
                            onClick={createSignal}
                          >
                            <P>생성</P>
                          </Button>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild flexWrap="wrap" padding={"10px 0"}>
                      <FlexGrid columns={3} gap={10}>
                        {fontImages.map((font) => (
                          <FlexChild
                            key={font.name}
                            className={clsx(styles.fontTextWrapper, {
                              [styles.selected]: select === font.name,
                            })}
                            onClick={() => setSelect(font.name)}
                          >
                            <FlexChild
                              id={font.name}
                              className={styles.fontText}
                            >
                              {font.url ? (
                                <Image
                                  src={font.url}
                                  width={"auto"}
                                  maxWidth={"100%"}
                                  minHeight={"93.5px"}
                                  maxHeight={"93.5px"}
                                />
                              ) : (
                                <Div height={"93.5px"} width={"100%"} />
                              )}
                            </FlexChild>
                          </FlexChild>
                        ))}
                      </FlexGrid>
                    </FlexChild>
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
                              onClick={onConfirmClick2}
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
                                확인
                              </P>
                            </div>
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                </FlexChild>
              </>
            )}
          </VerticalFlex>
        </FlexChild>
      </ModalBase>
    );
  }
);

export default ContractSignatureModal;
