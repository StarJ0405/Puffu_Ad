import P from "@/components/P/P";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputHashTag from "@/components/inputs/InputHashTag";
import InputImage from "@/components/inputs/InputImage";
import InputTextArea from "@/components/inputs/InputTextArea";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../ModalBase";
import style from "./InputModal.module.css";

interface InputProps {
  value: any;
  type?: HTMLInputElement["type"] | "text-area" | "hash" | "image";
  label: React.ReactNode;
  placeHolder?: HTMLInputElement["placeholder"];
  regExp?: { exp: { test: (value: any) => boolean } }[];
}
const InputModal = NiceModal.create(
  ({
    onConfirm,
    onCancel,
    message,
    input = [],
    cancelText,
    confirmText,
  }: {
    onConfirm: (value: any | any[]) => void;
    onCancel: () => void;
    message: string;
    input: InputProps | InputProps[];
    cancelText: string;
    confirmText: string;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const [width, height] = ["min(80%, 400px)", "auto"];
    const withCloseButton = false;
    const clickOutsideToClose = true;
    const title = "";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const { isMobile } = useBrowserEvent();
    const inputs = useRef<any[]>([]);

    const onConfirmClick = async () => {
      const { isValid, index } = await validateInputs(inputs.current);
      if (!isValid) return toast({ message: `${index}값이 잘못되었습니다.` });
      if (isBlocked) return;
      setIsBlocked(true);
      const value = inputs.current.map((input) => input.getValue());

      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          await onConfirm(value.length === 1 ? value[0] : value);
          modal.current.close();
        } else {
          onConfirm(value.length === 1 ? value[0] : value);
          modal.current.close();
        }
      } else {
        modal.current.close();
      }
      setIsBlocked(false);
    };

    const onCancelClick = () => {
      if (onCancel) {
        onCancel();
      }
      modal.current.close();
    };
    useEffect(() => {
      inputs?.current[0]?.focus?.();
    }, []);
    return (
      <ModalBase
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
        borderRadius={6}
      >
        <FlexChild padding={"50px 24px 24px 24px"} height="100%">
          <VerticalFlex gap={20} height={"100%"}>
            <FlexChild>
              <P
                width="100%"
                textAlign="center"
                size={isMobile ? 16 : 18}
                color={"#111"}
                weight={600}
              >
                {message}
              </P>
            </FlexChild>
            {(Array.isArray(input) ? input : [input]).map((value, index) => (
              <FlexChild key={`inputs_${index}_${value.label}`}>
                <VerticalFlex gap={4}>
                  <FlexChild>
                    <P size={isMobile ? 14 : 16} color={"#494949"}>
                      {value.label}
                    </P>
                  </FlexChild>
                  <FlexChild>
                    {value.type === "image" ? (
                      <InputImage
                        ref={(el) => {
                          inputs.current[index] = el;
                        }}
                        value={value.value}
                        placeHolder={value.placeHolder}
                      />
                    ) : value.type === "hash" ? (
                      <InputHashTag
                        width={"100%"}
                        ref={(el) => {
                          inputs.current[index] = el;
                        }}
                        value={value.value}
                        placeHolder={value.placeHolder}
                      />
                    ) : value.type === "text-area" ? (
                      <InputTextArea
                        width={"100%"}
                        ref={(el) => {
                          inputs.current[index] = el;
                        }}
                        value={value.value}
                        placeHolder={value.placeHolder}
                      />
                    ) : (
                      <Input
                        width={"100%"}
                        ref={(el) => {
                          inputs.current[index] = el;
                        }}
                        value={value.value}
                        type={value?.type}
                        placeHolder={value.placeHolder}
                        regExp={value.regExp || []}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const max = (Array.isArray(input) ? input : [input])
                              .length;
                            if (max - 1 === index) onConfirmClick();
                            else inputs.current[index + 1].focus();
                          }
                        }}
                      />
                    )}
                  </FlexChild>
                </VerticalFlex>
              </FlexChild>
            ))}
            <FlexChild>
              <HorizontalFlex justifyContent={"center"}>
                {cancelText && (
                  <FlexChild height={48} padding={3}>
                    <div
                      className={`${style.confirmButton} ${style.white}`}
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
                    className={`${style.confirmButton} ${style.red}`}
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

export default InputModal;
