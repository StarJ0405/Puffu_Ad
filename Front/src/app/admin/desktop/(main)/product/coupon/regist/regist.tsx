"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Container from "@/components/container/Container";
import DatePicker from "@/components/date-picker/DatePicker";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Tooltip from "@/components/tooltip/Tooltip";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { textFormat } from "@/shared/regExp";
import { scrollTo, toast, validateInputs } from "@/shared/utils/Functions";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const getInitDate = (): [Date, Date] => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return [start, end];
};
const options: { display: string; value: DateUnit; suffix: string }[] = [
  { display: "년", value: "year", suffix: "년" },
  { display: "개월", value: "month", suffix: "개월" },
  { display: "일", value: "date", suffix: "일" },
  { display: "시간", value: "hours", suffix: "시간" },
];
export default function ({ initStores }: { initStores: StoreData[] }) {
  const { stores } = useData(
    "stores",
    { select: ["id", "name", "currency_unit"] },
    (condition) => adminRequester.getStores(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initStores,
    }
  );
  const [store, setStore] = useState<string>("");
  const [type, setType] = useState<CouponType>("order");
  const [calc, setCalc] = useState<CalcType>("fix");
  const [date, setDate] = useState<DateType>("fixed");
  const [dates, setDates] = useState<[Date, Date]>(getInitDate());
  const [unit, setUnit] = useState<DateUnit>();
  const inputs = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSave = async () => {
    if (!store) return scrollTo("store", "스토어를 설정해주세요.");

    const name = inputs.current[0].getValue();
    if (!name) return scrollTo("name", "쿠폰명을 입력해주세요.");
    const value = inputs.current[1].getValue();
    if (!value) return scrollTo("value", "할인가는 0이 될 수 없습니다.");
    let range = inputs.current?.[2]?.getValue?.();
    if (date === "range" && range === 0)
      return scrollTo("unit", "기간을 설정해주세요.");
    setIsLoading(true);
    validateInputs(inputs.current.filter(Boolean))
      .then(({ isValid }: { isValid: boolean }) => {
        if (!isValid) return setIsLoading(false);
        const _data: CouponDataFrame = {
          store_id: store,
          name,
          type,
          calc,
          date,
          value,
        };
        if (date === "fixed") {
          _data.starts_at = dates[0];
          _data.ends_at = dates[1];
        } else if (date === "range") {
          _data.date_unit = unit;
          _data.range = range;
        }

        adminRequester.createCoupon(
          _data,
          ({ message, error }: { message?: string; error?: string }) => {
            setIsLoading(false);
            if (message) navigate("/product/coupon/management");
            else if (error) toast({ message: error });
          }
        );
      })
      .catch(() => {
        toast({ message: "오류가 발생했습니다." });
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (stores?.length === 1) setStore(stores?.[0]?.id);
  }, [stores]);

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
                      쿠폰정보입력
                    </P>
                  </Center>
                </div>
              </FlexChild>
              <FlexChild>
                <div className={styles.contentWrap}>
                  <VerticalFlex>
                    <FlexChild hidden={stores?.length === 1}>
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
                            options={stores.map((store: StoreData) => ({
                              display: store.name,
                              value: store.id,
                            }))}
                            value={store}
                            onChange={(value) => setStore(value as string)}
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
                            쿠폰명
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Input
                            scrollMarginTop={150}
                            id="name"
                            ref={(el) => {
                              inputs.current[0] = el;
                            }}
                            name={"쿠폰명"}
                            placeHolder={"쿠폰명을 입력하세요."}
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
                      hidden
                    >
                      <HorizontalFlex gap={20}>
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            쿠폰 종류
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <RadioGroup
                            name="type"
                            value={type}
                            onValueChange={(value) =>
                              setType(value as CouponType)
                            }
                          >
                            <HorizontalFlex
                              justifyContent="flex-start"
                              gap={12}
                            >
                              {(
                                [
                                  {
                                    display: "주문서 할인",
                                    value: "order",
                                    description: "주문서 자체에 적용되는 쿠폰",
                                  },
                                  {
                                    display: "상품 할인",
                                    value: "item",
                                    description: "상품 한개에만 적용되는 쿠폰",
                                  },
                                  {
                                    display: "배송비 할인",
                                    value: "shipping",
                                    description: "배송비에만 적용되는 쿠폰",
                                  },
                                ] as {
                                  display: string;
                                  value: CouponType;
                                  description: string;
                                }[]
                              ).map((type) => (
                                <FlexChild
                                  key={type.value}
                                  gap={6}
                                  width={"max-content"}
                                >
                                  <RadioChild id={type.value} />
                                  <P>{type.display}</P>
                                  <Tooltip content={type.description}>
                                    <Image
                                      src="/resources/images/question.png"
                                      size={14}
                                    />
                                  </Tooltip>
                                </FlexChild>
                              ))}
                            </HorizontalFlex>
                          </RadioGroup>
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
                            할인방식
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <RadioGroup
                            name="calc"
                            value={calc}
                            onValueChange={(value) =>
                              setCalc(value as CalcType)
                            }
                          >
                            <HorizontalFlex
                              justifyContent="flex-start"
                              gap={12}
                            >
                              {(
                                [
                                  {
                                    display: "고정값",
                                    value: "fix",
                                  },
                                  {
                                    display: "퍼센트",
                                    value: "percent",
                                  },
                                ] as { display: string; value: CalcType }[]
                              ).map((calc) => (
                                <FlexChild
                                  key={calc.value}
                                  gap={6}
                                  width={"max-content"}
                                >
                                  <RadioChild id={calc.value} />
                                  <P>{calc.display}</P>
                                </FlexChild>
                              ))}
                            </HorizontalFlex>
                          </RadioGroup>
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
                        justifyContent={"flex-start"}
                      >
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            할인가
                          </P>
                        </FlexChild>
                        <FlexChild width={200}>
                          <InputNumber
                            ref={(el) => {
                              inputs.current[1] = el;
                            }}
                            name={"할인가"}
                            min={0}
                            max={calc === "percent" ? 100 : 99999999}
                            width={250 - 80}
                            suffix={calc === "percent" ? "%" : ""}
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
                            날짜적용방식
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <RadioGroup
                            name="date"
                            value={date}
                            onValueChange={(value) =>
                              setDate(value as DateType)
                            }
                          >
                            <HorizontalFlex
                              justifyContent="flex-start"
                              gap={12}
                            >
                              {(
                                [
                                  {
                                    display: "지정일",
                                    value: "fixed",
                                  },
                                  {
                                    display: "기간",
                                    value: "range",
                                  },
                                  {
                                    display: "당일",
                                    value: "day",
                                  },
                                  {
                                    display: "해당주",
                                    value: "week",
                                  },
                                  {
                                    display: "해당월",
                                    value: "month",
                                  },
                                  {
                                    display: "해당년도",
                                    value: "year",
                                  },
                                ] as { display: string; value: DateType }[]
                              ).map((date) => (
                                <FlexChild
                                  key={date.value}
                                  gap={6}
                                  width={"max-content"}
                                >
                                  <RadioChild id={date.value} />
                                  <P>{date.display}</P>
                                </FlexChild>
                              ))}
                            </HorizontalFlex>
                          </RadioGroup>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild hidden={date !== "fixed" && date !== "range"}>
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                      >
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            적용기간
                          </P>
                        </FlexChild>
                        <FlexChild width={500}>
                          {date === "fixed" ? (
                            <DatePicker
                              showTimePicker
                              selectionMode="range"
                              defaultSelectedRange={dates}
                              onChange={(dates) =>
                                setDates(dates as [Date, Date])
                              }
                            />
                          ) : (
                            date === "range" && (
                              <FlexChild
                                gap={6}
                                width={"max-content"}
                                color="#111"
                              >
                                <Select
                                  classNames={{
                                    header: styles.select,
                                  }}
                                  value={unit}
                                  width={100}
                                  maxWidth={100}
                                  options={options}
                                  onChange={(value) =>
                                    setUnit(value as DateUnit)
                                  }
                                />
                                <InputNumber
                                  hideArrow
                                  ref={(el) => {
                                    inputs.current[2] = el;
                                  }}
                                  min={0}
                                  max={999999}
                                  width={100}
                                  suffix={
                                    options.find((f) => f.value === unit)
                                      ?.suffix
                                  }
                                />
                              </FlexChild>
                            )
                          )}
                        </FlexChild>
                      </HorizontalFlex>
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
