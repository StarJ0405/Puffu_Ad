"use client";

import P from "@/components/P/P";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useRef, useState } from "react";
import styles from "./ContractRecordModal.module.css";
const ContractRecordModal = NiceModal.create(
  ({
    audio: preAudio,
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
    const streamRef = useRef<any>(null);
    const mediaRecorderRef = useRef<any>(null);
    const audioChunksRef = useRef<any>(null);
    const timerIntervalRef = useRef<any>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingTime, setRecordingTime] = useState<number>(0);
    const { isMobile } = useBrowserEvent();
    const [audio, setAudio] = useState(preAudio);
    const onConfirmClick = async () => {
      if (isBlocked) return;
      setIsBlocked(true);

      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          const result = await onConfirm({
            value: { audio },
          });
          if (!preventable || result) modal.current.close();
        } else {
          const result = onConfirm({ value: { audio } });
          if (!preventable || result) modal.current.close();
        }
      } else {
        modal.current.close();
      }
      setIsBlocked(false);
    };
    const formatTime = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
      return `${minutes}:${seconds}`;
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
          <P>녹음</P>
        </FlexChild>

        <FlexChild
          padding={!isMobile ? "50px 15px 24px" : "40px 10px 20px"}
          height={"100%"}
          position="relative"
        >
          <VerticalFlex
            // height="calc(min(100%,100dvh) - 48px)"
            maxHeight="calc(min(100%,100dvh) - 48px)"
            overflowY="scroll"
            hideScrollbar
          >
            <FlexChild height={"100%"} alignItems="flex-start">
              <VerticalFlex>
                <FlexChild
                  hidden={isRecording}
                  width={128 + 10 * 2}
                  height={128 + 10 * 2}
                  padding={10}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="#fff"
                  borderRadius={"100%"}
                  cursor="pointer"
                  onClick={async () => {
                    if (isRecording) return;
                    const stream = await navigator.mediaDevices.getUserMedia({
                      audio: true,
                    });
                    streamRef.current = stream;

                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;
                    audioChunksRef.current = []; // 청크 초기화

                    mediaRecorder.ondataavailable = (event) => {
                      if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                      }
                    };
                    mediaRecorder.start();
                    setIsRecording(true);
                    setRecordingTime(0);
                    timerIntervalRef.current = setInterval(() => {
                      setRecordingTime((prevTime) => prevTime + 1);
                    }, 1000);
                  }}
                >
                  <Icon src="contract/" type="svg" name="play" size={128} />
                </FlexChild>
                <FlexChild
                  hidden={!isRecording}
                  width={128 + 10 * 2}
                  height={128 + 10 * 2}
                  padding={10}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="#fff"
                  borderRadius={"100%"}
                  cursor="pointer"
                  onClick={async () => {
                    if (!isRecording) return;
                    mediaRecorderRef.current?.stop();
                    setIsRecording(false);
                    clearInterval(timerIntervalRef.current);
                    streamRef.current
                      ?.getTracks()
                      .forEach((track: any) => track.stop());
                    mediaRecorderRef.current!.onstop = () => {
                      // Blob 데이터 생성 및 서버 업로드 로직 호출
                      const audioBlob = new Blob(audioChunksRef.current, {
                        type: "audio/webm",
                      });
                      setAudio(audioBlob);
                      setRecordingTime(0); // 시간 초기화
                    };
                  }}
                >
                  <Icon src="contract/" type="svg" name="stop" size={128} />
                </FlexChild>
                <FlexChild
                  justifyContent="center"
                  color="#fff"
                  padding={"20px 0 10px"}
                >
                  <P notranslate>{formatTime(recordingTime)}</P>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>

            <FlexChild position="sticky" bottom={0}>
              <FlexChild>
                <HorizontalFlex>
                  <FlexChild height={48} padding={3} width={"max-content"} />
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

export default ContractRecordModal;
