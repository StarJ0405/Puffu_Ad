import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { adminRequester } from "@/shared/AdminRequester";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";

const ShippingMethodDetailModal = NiceModal.create(
  ({
    method,
    edit = true,
    onSuccess,
  }: {
    method?: ShippingMethodData;
    onSuccess?: () => void;
    edit: boolean;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title =
      "배송방법 " + (edit ? (method?.id ? "편집" : "추가") : "조회");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const inputs = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unlimit, setUnlimit] = useState(
      typeof method?.max === "undefined" || method?.max === -1
    );
    const [type, setType] = useState<string>(method?.type || "default");
    useEffect(() => {
      if (!method) {
        modal.current.close();
      }
    }, [method]);
    const handleSave = () => {
      const name = inputs.current[0].getValue();
      if (!name) return toast({ message: "배송명을 입력해주세요." });
      setIsLoading(true);
      validateInputs(inputs.current)
        .then(({ isValid }) => {
          if (isValid) {
            const data: ShippingMethodDataFrame = {
              ...method,
              type: type as any,
              name,
              amount: inputs.current[1].getValue(),
              min: inputs.current[2].getValue(),
              max: unlimit ? -1 : inputs.current[3].getValue(),
              description: inputs.current[4].getValue(),
            };
            if (method?.id) {
              adminRequester.updateShippingMethod(method?.id, data, () => {
                onSuccess?.();
                modal.current.close();
              });
            } else {
              adminRequester.createShippingMethod(data, () => {
                onSuccess?.();
                modal.current.close();
              });
            }
          } else {
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    };
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
          maxHeight={"60dvh"}
          overflow="scroll"
          gap={10}
        >
          <FlexChild>
            <HorizontalFlex>
              <FlexChild width={"10%"}>
                <P>타입</P>
              </FlexChild>
              <FlexChild>
                <Select
                  value={type}
                  zIndex={10080}
                  options={[
                    {
                      display: "기본 배송",
                      value: "default",
                    },
                    {
                      display: "환불 배송",
                      value: "refund",
                    },
                    {
                      display: "교환 배송",
                      value: "exchange",
                    },
                  ]}
                  onChange={(type) => setType(String(type))}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild width={"10%"}>
                <P>이름</P>
              </FlexChild>
              <FlexChild>
                <Input
                  width={"100%"}
                  ref={(el) => {
                    inputs.current[0] = el;
                  }}
                  value={method?.name}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild width={"10%"}>
                <P>배송비</P>
              </FlexChild>
              <FlexChild>
                <Input
                  type="number"
                  ref={(el) => {
                    inputs.current[1] = el;
                  }}
                  value={method?.amount || 0}
                  min={0}
                  max={999999999999}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild width={"10%"}>
                <P>최소금액</P>
              </FlexChild>
              <FlexChild>
                <Input
                  type="number"
                  ref={(el) => {
                    inputs.current[2] = el;
                  }}
                  value={method?.min || 0}
                  min={0}
                  max={999999999999}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <CheckboxGroup
              name="max"
              values={unlimit ? ["unlimit"] : []}
              initialValues={unlimit ? ["unlimit"] : []}
              onChange={(values) => setUnlimit(values.includes("unlimit"))}
            >
              <HorizontalFlex>
                <FlexChild width={"10%"}>
                  <P>최대금액</P>
                </FlexChild>
                <FlexChild gap={5}>
                  <CheckboxChild id="unlimit" />
                  <P paddingRight={10}>제한없음</P>
                  <Input
                    type="number"
                    readOnly={unlimit}
                    ref={(el) => {
                      inputs.current[3] = el;
                    }}
                    value={Math.max(0, method?.max || 0)}
                    min={0}
                    max={999999999999}
                  />
                </FlexChild>
              </HorizontalFlex>
            </CheckboxGroup>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild width={"10%"}>
                <P>설명</P>
              </FlexChild>
              <FlexChild>
                <InputTextArea
                  width={"100%"}
                  ref={(el) => {
                    inputs.current[4] = el;
                  }}
                  value={method?.description}
                  placeHolder="예) 오후 4시 이전 결제, 주문건 당일출고"
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild justifyContent="center" gap={5}>
            <Button
              isLoading={isLoading}
              styleType="admin"
              padding={"12px 20px"}
              fontSize={18}
              onClick={handleSave}
            >
              {method?.id ? "편집" : "추가"}
            </Button>
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

export default ShippingMethodDetailModal;
