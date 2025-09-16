"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Container from "@/components/container/Container";
import DatePicker from "@/components/date-picker/DatePicker";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputImage from "@/components/inputs/InputImage";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { adminRequester } from "@/shared/AdminRequester";
import useNavigate from "@/shared/hooks/useNavigate";
import { textFormat } from "@/shared/regExp";
import { scrollTo, toast, validateInputs } from "@/shared/utils/Functions";
import { useRef, useState } from "react";
import styles from "./page.module.css";

export default function ({ stores }: { stores: StoreData[] }) {
  const [store, setStore] = useState<string>("");
  const inputs = useRef<any[]>([]);
  const [adult, setAdult] = useState(false);
  const [visible, setVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [unlimit, setUnlimit] = useState(true);
  const [dates, setDates] = useState<Date[]>([new Date(), new Date()]);
  const navigate = useNavigate();
  const getCategoryName = (
    category: CategoryData | null
  ): string | undefined => {
    if (category?.parent) {
      return getCategoryName(category.parent) + " > " + category?.name;
    }
    return category?.name;
  };

  const handleSave = async () => {
    if (!store) return scrollTo("store", "스토어를 설정해주세요.");

    const name = inputs.current[0].getValue();
    if (!name) return scrollTo("title", "배너명을 입력해주세요.");
    setIsLoading(true);
    validateInputs(inputs.current)
      .then(({ isValid }: { isValid: boolean }) => {
        if (!isValid) return setIsLoading(false);
        const _data: BannerDataFrame = {
          store_id: store,
          name,
          thumbnail: {
            pc: inputs.current[2].getValue(),
            mobile: inputs.current[3].getValue(),
          },
          adult,
          visible,
        };
        const to = inputs.current[1].getValue();
        if (to) _data.to = to;
        if (!unlimit) {
          _data.starts_at = dates[0];
          _data.ends_at = dates[1];
        }
        adminRequester.createBanners(
          _data,
          ({ message, error }: { message?: string; error?: string }) => {
            setIsLoading(false);
            if (message) navigate("/store/banners/management");
            else if (error) toast({ message: error });
          }
        );
      })
      .catch(() => {
        toast({ message: "오류가 발생했습니다." });
        setIsLoading(false);
      });
  };
  return (
    <Container padding={"20px 20px 60px 20px"}>
      <div className={styles.queryWrap}>
        <FlexChild>
          <div className={styles.container}>
            <VerticalFlex>
              <FlexChild>
                <div className={styles.label}>
                  <Center width={"100%"} textAlign={"left"}>
                    <P size={25} weight={600}>
                      배너정보입력
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
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                      >
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            스토어 설정
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Select
                            id="store"
                            scrollMarginTop={150}
                            options={stores.map((store) => ({
                              display: store.name,
                              value: store.id,
                            }))}
                            onChange={(value) => {
                              setStore(value as string);
                            }}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      border={"1px solid #EFEFEF"}
                      borderRight={"none"}
                      borderLeft={"none"}
                    >
                      <HorizontalFlex gap={20}>
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            배너명
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Input
                            scrollMarginTop={150}
                            id="title"
                            ref={(el) => {
                              inputs.current[0] = el;
                            }}
                            name={"배너명"}
                            placeHolder={"배너명을 입력하세요."}
                            regExp={[textFormat]}
                            width={250}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      border={"1px solid #EFEFEF"}
                      borderRight={"none"}
                      borderLeft={"none"}
                    >
                      <HorizontalFlex gap={20} alignItems={"stretch"}>
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            썸네일(PC)
                          </P>
                        </FlexChild>
                        <FlexChild padding={"15px 20px 15px 0"}>
                          <InputImage
                            ref={(el) => {
                              inputs.current[2] = el;
                            }}
                            name={"배너_썸네일"}
                            path={`/banners/${store}`}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      border={"1px solid #EFEFEF"}
                      borderRight={"none"}
                      borderLeft={"none"}
                    >
                      <HorizontalFlex gap={20} alignItems={"stretch"}>
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            썸네일(모바일)
                          </P>
                        </FlexChild>
                        <FlexChild padding={"15px 20px 15px 0"}>
                          <InputImage
                            ref={(el) => {
                              inputs.current[3] = el;
                            }}
                            name={"배너_썸네일"}
                            path={`/banners/${store}`}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild>
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                      >
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            URL 링크
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <Input
                            ref={(el) => {
                              inputs.current[1] = el;
                            }}
                            validable={false}
                            placeHolder={"이동할 URL링크를 입력하세요"}
                            name={"URL 링크"}
                            width={250}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <HorizontalFlex marginTop={20}>
                      <FlexChild
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                      >
                        <CheckboxGroup
                          name="adult"
                          values={adult ? ["adult"] : []}
                          onChange={(values) =>
                            setAdult(values.includes("adult"))
                          }
                        >
                          <HorizontalFlex
                            gap={20}
                            justifyContent={"flex-start"}
                          >
                            <FlexChild
                              width={"130px"}
                              padding={15}
                              justifyContent={"center"}
                              backgroundColor={"#3C4B64"}
                            >
                              <P size={16} weight={600} color={"#ffffff"}>
                                성인설정
                              </P>
                            </FlexChild>
                            <FlexChild>
                              <CheckboxChild id="adult" />
                            </FlexChild>
                          </HorizontalFlex>
                        </CheckboxGroup>
                      </FlexChild>
                    </HorizontalFlex>
                    <VerticalFlex
                      marginTop={20}
                      borderBottom={"1px solid #EFEFEF"}
                    >
                      <FlexChild
                        padding={15}
                        justifyContent={"center"}
                        backgroundColor={"#3C4B64"}
                      >
                        <P size={18} weight={600} color={"#ffffff"}>
                          표시설정
                        </P>
                      </FlexChild>
                      <FlexChild>
                        <HorizontalFlex>
                          <FlexChild gap={20}>
                            <FlexChild
                              width={"20%"}
                              padding={15}
                              backgroundColor={"#F5F6FB"}
                              justifyContent={"center"}
                            >
                              <P size={16} weight={600}>
                                공개상태
                              </P>
                            </FlexChild>
                            <RadioGroup
                              name="visible"
                              value={visible ? "visible" : "invisible"}
                              onValueChange={(value) =>
                                setVisible(value === "visible")
                              }
                            >
                              <HorizontalFlex gap={30}>
                                <FlexChild gap={12} width={"max-content"}>
                                  <RadioChild id="visible" />
                                  <P size={16} color={"#333"} weight={500}>
                                    공개
                                  </P>
                                </FlexChild>
                                <FlexChild gap={12}>
                                  <RadioChild id="invisible" />
                                  <P size={16} color={"#333"} weight={500}>
                                    비공개
                                  </P>
                                </FlexChild>
                              </HorizontalFlex>
                            </RadioGroup>
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                      <FlexChild>
                        <HorizontalFlex>
                          <FlexChild gap={20}>
                            <FlexChild
                              width={"20%"}
                              padding={15}
                              backgroundColor={"#F5F6FB"}
                              justifyContent={"center"}
                            >
                              <P size={16} weight={600}>
                                기간설정
                              </P>
                            </FlexChild>
                            <FlexChild>
                              <CheckboxGroup
                                name="limit"
                                initialValues={["unlimit"]}
                                onChange={(values) =>
                                  setUnlimit(values.includes("unlimit"))
                                }
                              >
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={10}
                                >
                                  <FlexChild width={"max-content"} gap={12}>
                                    <CheckboxChild id="unlimit" />
                                    <P>무제한</P>
                                  </FlexChild>
                                  <FlexChild width={300}>
                                    <DatePicker
                                      selectionMode="range"
                                      disabled={unlimit}
                                      defaultSelectedRange={dates as any}
                                      onChange={(dates) =>
                                        setDates(dates as Date[])
                                      }
                                    />
                                  </FlexChild>
                                </HorizontalFlex>
                              </CheckboxGroup>
                            </FlexChild>
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                    </VerticalFlex>
                  </VerticalFlex>
                </div>
              </FlexChild>
            </VerticalFlex>
          </div>
        </FlexChild>
        <FlexChild position="fixed" bottom={10} left={0} right={0}>
          <HorizontalFlex gap={40} height={50}>
            <HorizontalFlex justifyContent={"center"} gap={10}>
              <FlexChild width={"max-content"}>
                <Button
                  styleType="admin"
                  padding={"15px 74px"}
                  borderRadius={5}
                  fontSize={18}
                  fontWeight={700}
                  isLoading={isLoading}
                  onClick={handleSave}
                >
                  등록하기
                </Button>
              </FlexChild>
            </HorizontalFlex>
          </HorizontalFlex>
        </FlexChild>
      </div>
    </Container>
  );
}
