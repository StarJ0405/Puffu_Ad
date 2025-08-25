import {
  Color,
  ColorList,
} from "@/app/admin/desktop/(main)/store/regist/regist";
import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputColor from "@/components/inputs/InputColor";
import InputImage from "@/components/inputs/InputImage";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./StoreModal.module.css";
const StoreModal = NiceModal.create(
  ({
    store,
    edit = false,
    max = 0,
    onSuccess,
  }: {
    store: any;
    edit?: boolean;
    onSuccess?: () => void;
    max: number;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "스토어 " + (edit ? "편집" : "상세정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [thumbnail] = useState(store.thumbnail ? [store.thumbnail] : []);
    const inputs = useRef<any[]>([]);
    const image = useRef<any>(null);
    const radios = useRef<any[]>([]);
    const [colors, setColors] = useState<Color[]>(
      store.metadata.colors || [...ColorList].map((color) => ({ ...color }))
    );
    const [adult, setAdult] = useState<boolean>(store.adult);
    const [currencyUnit, setCurrencyUnit] = useState<string>(
      store.currency_unit
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const handleSave = () => {
      setIsLoading(true);
      try {
        const name = inputs.current[0].getValue();
        if (!name) {
          return setError("스토어명이 입력되지 않았습니다.");
        }
        validateInputs([...inputs.current, image.current])
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return;
            const thumbnail = image.current.getValue();
            const description = inputs.current[1].getValue();
            const index = inputs.current[2].getValue();
            const _data: StoreDataFrame = {
              name,
              currency_unit: currencyUnit,
              adult,
              index,
            };
            _data.thumbnail = thumbnail;
            if (description) _data.description = description;
            _data.metadata = {
              colors: colors.map((color) => {
                let css;
                if (color.value.a === 1) {
                  css = `rgb(${color.value.r},${color.value.g},${color.value.b})`;
                } else {
                  css = `rgba(${color.value.r},${color.value.g},${color.value.b},${color.value.a})`;
                }
                return {
                  ...color,
                  css,
                };
              }),
            };
            adminRequester.updateStore(
              store.id,
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
      if (!store) {
        modal.current.close();
      }
    }, [store]);
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
        <VerticalFlex padding={"10px 20px"}>
          <FlexChild justifyContent="center">
            {edit ? (
              <Div width={300}>
                <InputImage
                  ref={image}
                  value={thumbnail}
                  placeHolder="1:1 비율의 이미지를 권장합니다."
                />
              </Div>
            ) : (
              <Image
                className={styles.image}
                src={store?.thumbnail || "/resources/images/no-img.png"}
                size={200}
              />
            )}
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>스토어명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={store.name}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[0] = el;
                    }}
                  />
                ) : (
                  <P>{store.name}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>간단설명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={store.description}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[1] = el;
                    }}
                  />
                ) : (
                  <P>{store.description || "없음"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>순서</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <InputNumber
                    value={store.index}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[2] = el;
                    }}
                    min={0}
                    max={max}
                  />
                ) : (
                  <P>{store.index || 0}번</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>화폐단위</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <RadioGroup
                    name="currency_unit"
                    value={currencyUnit}
                    onValueChange={(value: string) => setCurrencyUnit(value)}
                  >
                    <HorizontalFlex>
                      <FlexChild
                        gap={10}
                        cursor="pointer"
                        onClick={() => radios.current[0].click()}
                      >
                        <RadioChild
                          id="원"
                          ref={(el) => {
                            radios.current[0] = el;
                          }}
                        />
                        <P>원화</P>
                      </FlexChild>
                      <FlexChild
                        gap={10}
                        cursor="pointer"
                        onClick={() => radios.current[1].click()}
                      >
                        <RadioChild
                          id="P"
                          ref={(el) => {
                            radios.current[1] = el;
                          }}
                        />
                        <P>포인트</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </RadioGroup>
                ) : (
                  <P>{store.currency_unit}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>성인설정</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <CheckboxGroup
                    name="adult"
                    initialValues={adult ? ["adult"] : []}
                    onChange={(values) => setAdult(values.includes("adult"))}
                  >
                    <CheckboxChild id="adult" />
                  </CheckboxGroup>
                ) : (
                  <Image
                    src={
                      store.adult
                        ? "/resources/images/checkbox_on.png"
                        : "/resources/images/checkbox_off.png"
                    }
                  />
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>색상 설정</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <VerticalFlex
                  border={"1px solid #dadada"}
                  padding={20}
                  gap={10}
                >
                  {colors.map((color, index) => (
                    <FlexChild key={color.code}>
                      <P width={300}>{color.label}</P>
                      <InputColor
                        zIndex={20000}
                        type="rgb"
                        value={{ rgb: color.value }}
                        onChange={(value) =>
                          setColors((prev) => {
                            prev[index].value = value.rgb;
                            return prev;
                          })
                        }
                        disableAlpha={false}
                        readOnly={!edit}
                        displayType={edit ? "text" : "sphere"}
                        withText={!edit}
                      />
                    </FlexChild>
                  ))}
                </VerticalFlex>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {edit ? (
            <FlexChild justifyContent="center" gap={5}>
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
          )}
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default StoreModal;
