"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputColor from "@/components/inputs/InputColor";
import InputImage from "@/components/inputs/InputImage";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import { toast, validateInputs } from "@/shared/utils/Functions";
import { useRef, useState } from "react";
import styles from "./regist.module.css";

export interface Color {
  label: string;
  code: string;
  value: { r: number; g: number; b: number; a: number };
  css?: string;
}
export const ColorList: Color[] = [
  {
    label: "메인 컬러",
    code: "--main-color",
    value: { r: 0, g: 0, b: 0, a: 1 },
  },
  {
    label: "메인 텍스트 컬러",
    code: "--main-text-color",
    value: { r: 0, g: 0, b: 0, a: 1 },
  },
];

export default function ({ initStores }: { initStores: Pageable }) {
  const { stores } = useData(
    "stores",
    { select: ["id", "name"] },
    (condtion) => adminRequester.getStores(condtion),
    { fallbackData: initStores, onReprocessing: (data) => data.content }
  );
  const inputs = useRef<any[]>([]);
  const image = useRef<any>(null);
  const radios = useRef<any[]>([]);
  const [colors, setColors] = useState<Color[]>(
    [...ColorList].map((color) => ({ ...color }))
  );
  const [adult, setAdult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currencyUnit, setCurrencyUnit] = useState<string>("원");
  const [error, setError] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const navigate = useNavigate();
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const name = inputs.current[0].getValue();
      if (!name) {
        return setError("스토어명이 입력되지 않았습니다.");
      }

      if (
        (await adminRequester.getStores({ subdomain: domain ? domain : null }))
          .content.length > 0
      ) {
        return setError("이미 사용중인 도메인입니다.");
      }
      if (true) return true;
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
          adminRequester.createStore(
            _data,
            ({ message, error }: { message?: string; error?: string }) => {
              setIsLoading(false);
              if (message) navigate("/store/management");
              else if (error) setError(error);
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
  useClientEffect(() => {
    if (error) {
      setIsLoading(false);
      toast({ message: error });
    }
  }, [error]);
  return (
    <div className={styles.container}>
      <VerticalFlex>
        <FlexChild>
          <div className={styles.label}>
            <Center width={"100%"} textAlign={"left"}>
              <P size={25} weight={600}>
                스토어 등록
              </P>
            </Center>
          </div>
        </FlexChild>
        <FlexChild>
          <div className={styles.contentWrap}>
            <VerticalFlex>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      스토어명
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <Input
                      width={"100%"}
                      ref={(el) => {
                        inputs.current[0] = el;
                      }}
                    />
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                  borderTop={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      대표 이미지
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <InputImage
                      ref={image}
                      placeHolder="1:1 비율의 이미지를 권장합니다."
                    />
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                  borderTop={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      간단 설명
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <Input
                      width={"100%"}
                      ref={(el) => {
                        inputs.current[1] = el;
                      }}
                    />
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                  borderTop={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      도메인
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <Input
                      width={"100%"}
                      value={domain}
                      onChange={(value) => setDomain(value as string)}
                      placeHolder="서브도메인을 입력해주세요! 예시) www, 미입력시 메인 도메인"
                      onFilter={(value) => {
                        return String(value)
                          .replace(/[^a-z]/g, "")
                          .toLowerCase();
                      }}
                    />
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                  borderTop={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      화폐 단위
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
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
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                  borderTop={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      성인 설정
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <CheckboxGroup
                      name="adult"
                      onChange={(values) => setAdult(values.includes("adult"))}
                    >
                      <CheckboxChild id="adult" />
                    </CheckboxGroup>
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                  borderTop={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      순서 설정
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <InputNumber
                      ref={(el) => {
                        inputs.current[2] = el;
                      }}
                      min={0}
                      max={stores.length}
                    />
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  alignItems="stretch"
                  border={"1px solid #EFEFEF"}
                  borderRight={"none"}
                  borderLeft={"none"}
                  borderTop={"none"}
                >
                  <FlexChild
                    width={"220px"}
                    padding={"18px 15px"}
                    backgroundColor={"#3c4b64"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600} color={"#ffffff"}>
                      색상 설정
                    </P>
                  </FlexChild>
                  <FlexChild padding={"15px 15px 15px 0"}>
                    <VerticalFlex
                      border={"1px solid #dadada"}
                      padding={20}
                      gap={10}
                    >
                      {colors.map((color, index) => (
                        <FlexChild key={color.code}>
                          <P width={300}>{color.label}</P>
                          <InputColor
                            type="rgb"
                            value={{ rgb: color.value }}
                            onChange={(value) =>
                              setColors((prev) => {
                                prev[index].value = value.rgb;
                                return prev;
                              })
                            }
                            disableAlpha={false}
                          />
                        </FlexChild>
                      ))}
                    </VerticalFlex>
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild justifyContent={"center"} marginTop={30}>
                <Button
                  styleType="admin"
                  isLoading={isLoading}
                  onClick={handleSave}
                  fontSize={18}
                  fontWeight={700}
                  borderRadius={5}
                  padding={"15px 74px"}
                >
                  등록
                </Button>
              </FlexChild>
            </VerticalFlex>
          </div>
        </FlexChild>
      </VerticalFlex>
    </div>
  );
}
