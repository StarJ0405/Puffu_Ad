import Button from "@/components/buttons/Button";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputImage from "@/components/inputs/InputImage";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./VariantModal.module.css";
const VariantModal = NiceModal.create(
  ({
    variant,
    options,
    edit = false,
    type,
    onSuccess,
  }: {
    variant?: VariantData;
    options?: OptionData[];
    edit?: boolean;
    onSuccess?: () => void;
    type: "single" | "simple" | "multiple";
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "옵션 " + (edit ? "편집" : "상세정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const inputs = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [radio, setRadio] = useState<boolean[]>([
      variant?.visible ?? true,
      variant?.buyable ?? true,
    ]);
    const optionRef = useRef<any[]>([]);
    const handleSave = () => {
      setIsLoading(true);
      try {
        validateInputs(
          [...inputs.current, ...optionRef.current].filter(Boolean)
        )
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return setIsLoading(false);

            const _data: VariantDataFrame = {
              thumbnail: inputs.current[0].getValue(),
              title: inputs.current[1].getValue(),
              extra_price: inputs.current[2].getValue(),
              stack: inputs.current[3].getValue(),
              visible: radio[0],
              buyable: radio[1],
            };
            if (options && options?.length > 0) {
              const values = options
                .sort((o1, o2) => o1.title.localeCompare(o2.title))
                .map((option, index) => {
                  const value = variant?.values?.find(
                    (f) => f.option_id === option.id
                  );
                  if (value)
                    return {
                      ...value,
                      value: optionRef.current[index].getValue(),
                    };
                  else
                    return {
                      option_id: option.id,
                      value: optionRef.current[index].getValue(),
                    };
                });
              _data.values = values;
            }
            if (variant?.id) {
              adminRequester.updateVaraint(
                variant?.id,
                _data,
                ({ message, error }: { message?: string; error?: string }) => {
                  setIsLoading(false);

                  if (message) {
                    onSuccess?.();
                    modal.current.close();
                  } else if (error) setError(error);
                }
              );
            } else {
              adminRequester.createVaraint(
                { ..._data, product_id: variant?.product_id },
                ({ message, error }: { message?: string; error?: string }) => {
                  setIsLoading(false);

                  if (message) {
                    onSuccess?.();
                    modal.current.close();
                  } else if (error) setError(error);
                }
              );
            }
          })
          .catch((error) => {
            toast({ message: error || "오류가 발생했습니다." });
            setIsLoading(false);
          });
      } catch (error) {
        setIsLoading(false);
      }
    };

    useClientEffect(() => {
      if (error) {
        setIsLoading(false);
        toast({ message: error });
      }
    }, [error]);

    return (
      <ModalBase
        borderRadius={10}
        headerStyle
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
          <FlexChild justifyContent="center" hidden={type === "single"}>
            {edit ? (
              <Div width={300}>
                <InputImage
                  ref={(el) => {
                    inputs.current[0] = el;
                  }}
                  value={variant?.thumbnail}
                  placeHolder="1:1 비율의 이미지를 권장합니다."
                />
              </Div>
            ) : (
              <Image
                className={styles.image}
                src={variant?.thumbnail || "/resources/images/no-img.png"}
                size={200}
              />
            )}
          </FlexChild>
          <FlexChild hidden={type === "single"}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>옵션명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={variant?.title}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[1] = el;
                    }}
                  />
                ) : (
                  <P>{variant?.title}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild hidden={type === "single"}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>증감액</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <InputNumber
                    value={variant?.extra_price}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[2] = el;
                    }}
                  />
                ) : (
                  <P>
                    <Span>{variant?.extra_price}</Span>
                    <Span>{variant?.product?.store?.currency_unit}</Span>
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>재고량</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <InputNumber
                    value={variant?.stack || 0}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[3] = el;
                    }}
                  />
                ) : (
                  <P>{variant?.stack || 0}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild hidden={type === "single"}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>진열상태</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <RadioGroup
                    name="visible"
                    onValueChange={(value) =>
                      setRadio((prev) => [value === "visible", prev[1]])
                    }
                    value={radio[0] ? "visible" : "invisible"}
                  >
                    <HorizontalFlex gap={20} justifyContent="flex-start">
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="visible" />
                        <P>진열</P>
                      </FlexChild>
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="invisible" />
                        <P>미진열</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </RadioGroup>
                ) : (
                  <P>{variant?.visible ? "진열중" : "미진열"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild hidden={type === "single"}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>판매상태</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <RadioGroup
                    name="buyable"
                    onValueChange={(value) =>
                      setRadio((prev) => [prev[0], value === "sale"])
                    }
                    value={radio[1] ? "sale" : "nosale"}
                  >
                    <HorizontalFlex gap={20} justifyContent="flex-start">
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="sale" />
                        <P>판매</P>
                      </FlexChild>
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="nosale" />
                        <P>미판매</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </RadioGroup>
                ) : (
                  <P>{variant?.visible ? "판매중" : "판매중단"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {options
            ?.sort((o1, o2) => o1.title.localeCompare(o2.title))
            ?.map((option, index) => (
              <FlexChild key={option.id}>
                <HorizontalFlex>
                  <FlexChild className={styles.head}>
                    <P>{option.title}</P>
                  </FlexChild>
                  <FlexChild className={styles.content}>
                    {edit ? (
                      <Input
                        value={
                          variant?.values?.find(
                            (f) => f.option_id === option.id
                          )?.value || "default"
                        }
                        width={"100%"}
                        ref={(el) => {
                          optionRef.current[index] = el;
                        }}
                      />
                    ) : (
                      <P>
                        {variant?.values?.find((f) => f.option_id === option.id)
                          ?.value || "default"}
                      </P>
                    )}
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
            ))}
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

export default VariantModal;
