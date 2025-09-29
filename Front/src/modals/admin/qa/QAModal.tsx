import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { getQAType } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./QAModal.module.css";
import { adminRequester } from "@/shared/AdminRequester";
const QAModal = NiceModal.create(
  ({ qa, onSuccess }: { qa: any; onSuccess?: () => void }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "문의 상세정보";
    const buttonText = "close";
    const modal = useRef<any>(null);

    useEffect(() => {
      if (!qa) {
        modal.current.close();
      }
    }, [qa]);
    const [answer, setAnswer] = useState(qa.answer);
    return (
      <ModalBase
        borderRadius={10}
        zIndex={10055}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={withCloseButton}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
      >
        <VerticalFlex padding={"10px 20px"}>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>제목</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{qa.title}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>작성자</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{qa.user.name}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>타입</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{getQAType(qa)}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>비밀글</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <Image
                  src={
                    qa.hidden
                      ? "/resources/images/checkbox_on.png"
                      : "/resources/images/checkbox_off.png"
                  }
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex alignItems="stretch">
              <FlexChild className={styles.head}>
                <P>내용</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <VerticalFlex
                  border={"1px solid #dadada"}
                  padding={20}
                  gap={10}
                >
                  <FlexChild>
                    <P whiteSpace="pre-wrap">{qa.content}</P>
                  </FlexChild>
                  {qa.images.map((src: string) => (
                    <Image key={src} src={src} />
                  ))}
                </VerticalFlex>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex alignItems="stretch">
              <FlexChild className={styles.head}>
                <P>답변</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {answer ? (
                  <P
                    cursor="pointer"
                    whiteSpace="pre-wrap"
                    onClick={() =>
                      NiceModal.show("input", {
                        input: [
                          {
                            type: "text-area",
                            label: "답변수정",
                            value: answer,
                            placeHolder: "내용작성...",
                          },
                        ],
                        confirmText: "답변수정",
                        cancelText: "취소",
                        onConfirm: (answer: string) => {
                          setAnswer(answer);
                          adminRequester.answerQA(
                            qa.id,
                            {
                              answer,
                            },
                            () => onSuccess?.()
                          );
                        },
                      })
                    }
                  >
                    {answer}
                  </P>
                ) : (
                  <Button
                    styleType="admin"
                    onClick={() =>
                      NiceModal.show("input", {
                        input: [
                          {
                            type: "text-area",
                            label: "답변내용",
                            placeHolder: "내용작성...",
                          },
                        ],
                        confirmText: "답변등록",
                        cancelText: "취소",
                        onConfirm: (answer: string) => {
                          setAnswer(answer);
                          adminRequester.answerQA(
                            qa.id,
                            {
                              answer,
                            },
                            () => onSuccess?.()
                          );
                        },
                      })
                    }
                  >
                    답변하기
                  </Button>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild justifyContent="center" gap={5}>
            <Button
              styleType="white"
              padding={"12px 20px"}
              fontSize={18}
              onClick={() => modal.current.close()}
            >
              닫기
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default QAModal;
