"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Container from "@/components/container/Container";
import DatePicker from "@/components/date-picker/DatePicker";
import Editor from "@/components/editor/edtior";
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

const types = ["일반", "이벤트"].map((type) => ({
  display: type,
  value: type,
}));
export default function ({ stores }: { stores: StoreData[] }) {
  const [store, setStore] = useState<string>("");
  const inputs = useRef<any[]>([]);
  const [visible, setVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [unlimit, setUnlimit] = useState(true);
  const [dates, setDates] = useState<Date[]>([new Date(), new Date()]);
  const [actives, setActives] = useState<Date[]>([new Date(), new Date()]);
  const [detail, setDetail] = useState<string>("");
  const [type, setType] = useState(types[0]);
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

    const title = inputs.current[0].getValue();
    if (!title) return scrollTo("title", "제목을 입력해주세요.");
    setIsLoading(true);
    validateInputs(inputs.current)
      .then(({ isValid }: { isValid: boolean }) => {
        if (!isValid) return setIsLoading(false);
        const _data: NoticeDataFrame = {
          store_id: store,
          title,
          detail,
          visible,
          type: type.value,
        };
        if (type.value === "이벤트") {
          _data.thumbnail = inputs.current[1].getValue();
          _data.actives_at = actives[0];
          _data.deactives_at = actives[1];
        }
        if (!unlimit) {
          _data.starts_at = dates[0];
          _data.ends_at = dates[1];
        }

        adminRequester.createNotices(
          _data,
          ({ message, error }: { message?: string; error?: string }) => {
            setIsLoading(false);
            if (message) navigate("/store/notices/management");
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
                      공지사항정보입력
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
                            제목
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Input
                            scrollMarginTop={150}
                            id="title"
                            ref={(el) => {
                              inputs.current[0] = el;
                            }}
                            name={"제목"}
                            placeHolder={"제목을 입력하세요."}
                            regExp={[textFormat]}
                            width={500}
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
                            타입
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <Select
                            options={types}
                            value={type.value}
                            onChange={(value) =>
                              setType(
                                types.find((f) => f.value === value) || types[0]
                              )
                            }
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild hidden={type.value !== "이벤트"}>
                      <HorizontalFlex
                        alignItems="stretch"
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
                            썸네일
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <InputImage
                            ref={(el) => {
                              inputs.current[1] = el;
                            }}
                            path="/notice"
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild hidden={type.value !== "이벤트"}>
                      <HorizontalFlex
                        alignItems="stretch"
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
                            이벤트 기간
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <DatePicker
                            selectionMode="range"
                            defaultSelectedRange={dates as any}
                            onChange={(dates) => setActives(dates as Date[])}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
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
                        상세페이지
                      </P>
                    </FlexChild>
                    <FlexChild>
                      <Editor
                        onChange={(detail) => setDetail(detail)}
                        path="/notice"
                      />
                    </FlexChild>
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
