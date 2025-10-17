import Button from "@/components/buttons/Button";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Div from "@/components/div/Div";
import Editor from "@/components/editor/edtior";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputHashTag from "@/components/inputs/InputHashTag";
import InputImage from "@/components/inputs/InputImage";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./SubscribeModal.module.css";
const SubscribeModal = NiceModal.create(
  ({
    subscribe,
    edit = false,
    onSuccess,
  }: {
    subscribe: SubscribeData;
    edit?: boolean;
    onSuccess?: () => void;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 600px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "구독 " + (edit ? "편집" : "상세정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const inputs = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const handleSave = () => {
      setIsLoading(true);
      try {
        const name = inputs.current[0].getValue();
        if (!name) return setError("구독 상품명이 입력되지 않았습니다.");

        const price = inputs.current[1].getValue();
        if (!price) return setError("판매가가 입력되지 않았습니다.");
        validateInputs([...inputs.current])
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return;

            const _data: SubscribeDataFrame = {
              store_id: subscribe.store_id,
              name,
              price,
              percent: inputs.current[2].getValue(),
              value: inputs.current[3].getValue(),
            };

            adminRequester.updateSubscribe(
              subscribe.id,
              _data,
              ({ message, error }: { message?: string; error?: string }) => {
                setIsLoading(false);
                if (message) {
                  onSuccess?.();
                  modal.current.close();
                } else if (error) setError(error);
              }
            );
          })
          .catch(() => {
            toast({ message: "오류가 발생했습니다." });
            setIsLoading(false);
          });
      } catch (error) {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      if (!subscribe) {
        modal.current.close();
      }
    }, [subscribe]);
    useClientEffect(() => {
      if (error) {
        setIsLoading(false);
        toast({ message: error });
      }
    }, [error]);
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
        <VerticalFlex
          padding={"10px 20px"}
          maxHeight={"80vh"}
          overflow="scroll"
          overflowY="scroll"
          position="relative"
          hideScrollbar
        >
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>스토어</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{subscribe?.store?.name}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>구독 상품명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={subscribe.name}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[0] = el;
                    }}
                  />
                ) : (
                  <P>{subscribe?.name}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>판매가</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <InputNumber
                    value={subscribe.price}
                    max={9999999999}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[1] = el;
                    }}
                    step={1000}
                  />
                ) : (
                  <P>
                    <Span>{subscribe.price || 0}</Span>
                    <Span>원</Span>
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>할인율</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <InputNumber
                    value={subscribe.percent}
                    max={9999999999}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[2] = el;
                    }}
                    suffix="%"
                  />
                ) : (
                  <P>
                    <Span>{subscribe.percent || 0}</Span>
                    <Span>%</Span>
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>월간 쿠폰 금액</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <InputNumber
                    value={subscribe.value}
                    max={9999999999}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[3] = el;
                    }}
                    step={1000}
                  />
                ) : (
                  <P>
                    <Span>{subscribe.value || 0}</Span>
                    <Span>원</Span>
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {edit ? (
            <FlexChild
              justifyContent="center"
              gap={5}
              position="sticky"
              bottom={0}
            >
              <Button
                styleType="admin"
                padding={"12px 20px"}
                fontSize={18}
                isLoading={isLoading}
                onClick={handleSave}
              >
                등록
              </Button>
              <Button
                styleType="white"
                padding={"12px 20px"}
                fontSize={18}
                onClick={() => modal.current.close()}
              >
                취소
              </Button>
            </FlexChild>
          ) : (
            <FlexChild
              justifyContent="center"
              gap={5}
              position="sticky"
              bottom={0}
            >
              <Button
                styleType="white"
                padding={"12px 20px"}
                fontSize={18}
                onClick={() => modal.current.close()}
              >
                닫기
              </Button>
            </FlexChild>
          )}
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default SubscribeModal;
