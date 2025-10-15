"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
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
import NiceModal from "@ebay/nice-modal-react";
import _ from "lodash";
import lunisolar from "lunisolar";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
const getCategoryName = (category: CategoryData | null): string | undefined => {
  if (category?.parent) {
    return getCategoryName(category.parent) + " > " + category?.name;
  }
  return category?.name;
};
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
export default function ({
  initStores,
  initGroups,
}: {
  initStores: Pageable;
  initGroups: Pageable;
}) {
  const { stores } = useData(
    "stores",
    { select: ["id", "name", "currency_unit"] },
    (condition) => adminRequester.getStores(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initStores,
    }
  );
  const { groups } = useData(
    "groups",
    { select: ["id", "name", "min"] },
    (condition) => adminRequester.getGroups(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initGroups,
    }
  );
  const [store, setStore] = useState<string>("");
  const { categories } = useData(
    "categories",
    { parent_id: null, store_id: store, tree: "descendants" },
    (condition) => adminRequester.getCategories(condition),
    { onReprocessing: (data) => data?.content || [] }
  );
  const [group, setGroup] = useState<string | null>(null);
  const [type, setType] = useState<CouponType>("order");
  const [calc, setCalc] = useState<CalcType>("fix");
  const [date, setDate] = useState<DateType>("fixed");
  const [dates, setDates] = useState<[Date, Date]>(getInitDate());
  const [unit, setUnit] = useState<DateUnit>("date");
  const [target, setTarget] = useState<Target>("manual");
  const [appearsAt, setAppearsAt] = useState<Date | null>(null);
  const [productType, setProductType] = useState<string>("all");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryData[]>(
    []
  );
  const [interval, setInterval] = useState<number>(1);
  const [limitCount, setLimitCount] = useState<boolean>(false);
  const [duplicate, setDuplicate] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [limitPrice, setLimitPrice] = useState<boolean>(false);
  const [condition, setCondition] = useState<Condition>("signup");
  const [issueDate, setIssueDate] = useState<Date>(
    new Date(new Date().toLocaleDateString())
  );
  const [issueLunar, setIssueLunar] = useState<boolean>(false);
  const [reviewImage, setReviewImage] = useState<boolean>(false);
  const [total, setTotal] = useState<string>("unlimit");
  const [limitOrder, setLimitOrder] = useState<boolean>(false);
  const [orderDates, setOrderDates] = useState<[Date, Date]>(getInitDate());
  const [purchaseType, setPurchaseType] = useState<string>("product");
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
          calc,
          value,
          target,
          date,
          type,
        };
        if (target === "manual") {
          if (appearsAt) _data.appears_at = appearsAt;
        } else if (target === "link") {
          if (group) _data.group_id = group;
          if (limitCount) _data.max_quantity = inputs.current[4].getValue();
          if (duplicate) _data.duplicate = inputs.current[5].getValue();
          _data.code = "code";
        } else if (target === "interval") {
          if (group) _data.group_id = group;
          _data.interval = interval;
        } else if (target === "condition") {
          if (condition) _data.condition = condition;
          if (condition === "date") {
            _data.issue_date = issueDate;
            _data.issue_lunar = issueLunar;
          } else if (condition === "review") {
            _data.review_min = inputs.current[6].getValue();
            _data.review_photo = reviewImage;
            if (group) _data.group_id = group;
            if (limitCount) _data.max_quantity = inputs.current[4].getValue();
            if (duplicate) _data.duplicate = inputs.current[5].getValue();
          } else if (condition === "delivery" || condition === "order") {
            if (total === "min") {
              _data.total_min = inputs.current[7].getValue();
            } else if (total === "range") {
              _data.total_min = inputs.current[7].getValue();
              _data.total_max = inputs.current[8].getValue();
            }
            if (limitOrder) {
              _data.order_starts_at = orderDates[0];
              _data.order_ends_at = orderDates[1];
            }
            if (group) _data.group_id = group;
            if (limitCount) _data.max_quantity = inputs.current[4].getValue();
            if (duplicate) _data.duplicate = inputs.current[5].getValue();
          } else if (condition === "first") {
            if (limitOrder) {
              _data.order_starts_at = orderDates[0];
              _data.order_ends_at = orderDates[1];
            }
          } else if (condition === "purchase") {
            _data.buy_type = purchaseType;
            _data.buy_min = inputs.current[9].getValue();
            if (limitOrder) {
              _data.order_starts_at = orderDates[0];
              _data.order_ends_at = orderDates[1];
            }
            if (group) _data.group_id = group;
            if (limitCount) _data.max_quantity = inputs.current[4].getValue();
            if (duplicate) _data.duplicate = inputs.current[5].getValue();
          }
        }

        if (date === "fixed") {
          _data.starts_at = dates[0];
          _data.ends_at = dates[1];
        } else if (date === "range") {
          _data.date_unit = unit;
          _data.range = range;
        }
        if (products.length > 0) _data.products = products;
        if (selectedCategories.length > 0)
          _data.categories = selectedCategories.map((category) => {
            delete category.parent;
            delete category.children;
            return category;
          });
        if (limitPrice) _data.min = inputs.current[3].getValue();

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
                      STEP 1. 발급 정보
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
                          width={"180px"}
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
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            쿠폰이름
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Input
                            scrollMarginTop={150}
                            id="name"
                            ref={(el) => {
                              inputs.current[0] = el;
                            }}
                            name={"쿠폰이름"}
                            placeHolder={"쿠폰이름을 입력하세요."}
                            regExp={[textFormat]}
                            width={250}
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
                          width={"180px"}
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
                          width={"180px"}
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
                        justifyContent={"flex-start"}
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            발급구분
                          </P>
                        </FlexChild>
                        <FlexChild width={500}>
                          <RadioGroup
                            name="target"
                            value={target}
                            onValueChange={(value) => {
                              setTarget(value as Target);
                              if (value !== "manual" && value !== "link")
                                setDate("range");
                              else setDate("fixed");
                              setLimitCount(value === "link");
                              setAppearsAt(null);
                              setDuplicate(false);
                              setGroup(null);
                            }}
                          >
                            <HorizontalFlex
                              justifyContent="flex-start"
                              gap={12}
                            >
                              {(
                                [
                                  {
                                    display: "수동발급",
                                    value: "manual",
                                  },
                                  {
                                    display: "조건부 발급",
                                    value: "condition",
                                  },
                                  {
                                    display: "고객 다운로드 발급",
                                    value: "link",
                                  },
                                  {
                                    display: "정규자동발급",
                                    value: "interval",
                                  },
                                ] as { display: string; value: Target }[]
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
                    <FlexChild hidden={target !== "condition"}>
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                        >
                          <HorizontalFlex
                            justifyContent="center"
                            gap={3}
                            height={16}
                          >
                            <P size={16} weight={600}>
                              조건 설정
                            </P>
                            <Tooltip
                              content={
                                <VerticalFlex
                                  flexStart
                                  backgroundColor="#fff"
                                  padding={10}
                                  border={"1px solid #d0d0d0"}
                                >
                                  <P>
                                    회원가입 : 회원가입 완료 후 즉시 자동 발급
                                  </P>
                                  <P>
                                    생일 : 회원 정보에 저장된 생일에 자동 발급
                                  </P>
                                  <P>
                                    특정 기념일 : 설정된 날짜(양/음력)에 매년
                                    자동 발급 (단발성인 경우 수동 발급 사용
                                    권장, 윤달 처리 X)
                                  </P>
                                  <P>
                                    리뷰 작성 : 상품 리뷰가 작성되었을때 조건을
                                    만족하면 발급(쿠폰 생성 이후 리뷰만을 측정)
                                  </P>
                                  <P>
                                    배송 완료 : 배송완료시 자동 지급(최종
                                    결제금액을 기준)
                                  </P>
                                  <P>
                                    주문 완료 : 상품이 배송중으로 넘어가면 자동
                                    지급(최종 결제금액을 기준)
                                  </P>
                                  <P>
                                    회원 가입 후 첫 구매 : 회원가입 후 첫 주문이
                                    배송완료시 자동 지급
                                  </P>
                                  <P>
                                    구매 수량 충족시 : 조건을 만족하는 주문이
                                    배송중으로 넘어가면 자동 발급
                                  </P>
                                </VerticalFlex>
                              }
                            >
                              <Image
                                src="/resources/images/question.png"
                                size={16}
                              />
                            </Tooltip>
                          </HorizontalFlex>
                        </FlexChild>
                        <FlexChild width={250}>
                          <Select
                            classNames={{ header: styles.select }}
                            value={condition}
                            onChange={(value) => {
                              setCondition(value as Condition);
                              setLimitCount(false);
                              setDuplicate(false);
                              setGroup(null);
                            }}
                            options={[
                              {
                                display: "회원 가입",
                                value: "signup",
                              },
                              {
                                display: "생일",
                                value: "birthday",
                              },
                              {
                                display: "특정 기념일",
                                value: "date",
                              },
                              {
                                display: "리뷰 작성",
                                value: "review",
                              },
                              {
                                display: "배송 완료",
                                value: "delivery",
                              },
                              {
                                display: "주문 완료",
                                value: "order",
                              },
                              {
                                display: "회원가입 후 첫 구매",
                                value: "first",
                              },
                              {
                                display: "구매 수량 충족시",
                                value: "purchase",
                              },
                            ]}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      hidden={
                        !(
                          target === "condition" &&
                          (condition === "delivery" || condition === "order")
                        )
                      }
                    >
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600} textAlign="center">
                            발급 가능 결제 금액
                          </P>
                        </FlexChild>
                        <FlexChild gap={10} padding={"10px 0"}>
                          <RadioGroup
                            name="min"
                            value={total}
                            onValueChange={(value) => setTotal(value)}
                          >
                            <VerticalFlex gap={10}>
                              <FlexChild>
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={12}
                                >
                                  <FlexChild width={"max-content"} gap={6}>
                                    <RadioChild id="unlimit" />
                                    <P>제한없음</P>
                                  </FlexChild>
                                  <FlexChild width={"max-content"} gap={6}>
                                    <RadioChild id="min" />
                                    <P>최소금액</P>
                                  </FlexChild>
                                  <FlexChild width={"max-content"} gap={6}>
                                    <RadioChild id="range" />
                                    <P>범위</P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </FlexChild>
                              <FlexChild hidden={total === "unlimit"}>
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={10}
                                >
                                  <FlexChild width={"max-content"}>
                                    <InputNumber
                                      ref={(el) => {
                                        inputs.current[7] = el;
                                      }}
                                      name={"최소결제금액"}
                                      min={total === "range" ? 0 : 1}
                                      max={99999999}
                                      width={250 - 80}
                                      hideArrow
                                    />
                                  </FlexChild>
                                  <FlexChild
                                    width={"max-content"}
                                    hidden={total !== "range"}
                                  >
                                    <P> ~ </P>
                                  </FlexChild>
                                  <FlexChild
                                    width={"max-content"}
                                    hidden={total !== "range"}
                                  >
                                    <InputNumber
                                      ref={(el) => {
                                        inputs.current[8] = el;
                                      }}
                                      name={"최대결제금액"}
                                      min={0}
                                      max={99999999}
                                      width={250 - 80}
                                      hideArrow
                                    />
                                  </FlexChild>
                                </HorizontalFlex>
                              </FlexChild>
                            </VerticalFlex>
                          </RadioGroup>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      hidden={
                        !(target === "condition" && condition === "purchase")
                      }
                    >
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                        >
                          <HorizontalFlex
                            height={16}
                            justifyContent={"center"}
                            gap={3}
                          >
                            <P size={16} weight={600} textAlign="center">
                              수량 판단 기준
                            </P>
                            <Tooltip
                              content={
                                <VerticalFlex
                                  flexStart
                                  backgroundColor="#fff"
                                  padding={10}
                                  border={"1px solid #d0d0d0"}
                                >
                                  <P>
                                    상품 수량 기준 : 한 주문서에서 같은 상품의
                                    개수가 최소 구매 수량을 만족시 발급
                                  </P>
                                  <P>
                                    주문서 수량 기준 : 주문서에서 전체 상품의
                                    개수의 합이 최소 구매 수량을 만족시 발급
                                  </P>
                                </VerticalFlex>
                              }
                            >
                              <Image
                                src="/resources/images/question.png"
                                size={16}
                              />
                            </Tooltip>
                          </HorizontalFlex>
                        </FlexChild>
                        <FlexChild gap={10} padding={"10px 0"}>
                          <RadioGroup
                            name="orderDates"
                            value={purchaseType}
                            onValueChange={(value) => setPurchaseType(value)}
                          >
                            <HorizontalFlex
                              justifyContent="flex-start"
                              gap={12}
                            >
                              <FlexChild width={"max-content"} gap={6}>
                                <RadioChild id="product" />
                                <P>상품 수량 기준</P>
                              </FlexChild>
                              <FlexChild width={"max-content"} gap={6}>
                                <RadioChild id="order" />
                                <P>주문 수량 기준</P>
                              </FlexChild>
                            </HorizontalFlex>
                          </RadioGroup>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      hidden={
                        !(target === "condition" && condition === "purchase")
                      }
                    >
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            최소 구매 수량
                          </P>
                        </FlexChild>
                        <FlexChild gap={5}>
                          <InputNumber
                            ref={(el) => {
                              inputs.current[9] = el;
                            }}
                            name={"최소구매수량"}
                            min={1}
                            max={99999999}
                            width={250 - 80}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      hidden={
                        !(
                          target === "condition" &&
                          (condition === "delivery" ||
                            condition === "order" ||
                            condition === "first" ||
                            condition === "purchase")
                        )
                      }
                    >
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600} textAlign="center">
                            주문기간 설정
                          </P>
                        </FlexChild>
                        <FlexChild gap={10} padding={"10px 0"}>
                          <RadioGroup
                            name="orderDates"
                            value={limitOrder ? "limit" : "unlimit"}
                            onValueChange={(value) =>
                              setLimitOrder(value === "limit")
                            }
                          >
                            <VerticalFlex gap={10}>
                              <FlexChild>
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={12}
                                >
                                  <FlexChild width={"max-content"} gap={6}>
                                    <RadioChild id="unlimit" />
                                    <P>설정안함</P>
                                  </FlexChild>
                                  <FlexChild width={"max-content"} gap={6}>
                                    <RadioChild id="limit" />
                                    <P>설정함</P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </FlexChild>
                              <FlexChild hidden={!limitOrder}>
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={10}
                                >
                                  <FlexChild width={500}>
                                    <DatePicker
                                      defaultSelectedRange={orderDates}
                                      onChange={(dates) =>
                                        setOrderDates(dates as any)
                                      }
                                      selectionMode="range"
                                      showTimePicker
                                    />
                                  </FlexChild>
                                </HorizontalFlex>
                              </FlexChild>
                            </VerticalFlex>
                          </RadioGroup>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      hidden={
                        !(target === "condition" && condition === "review")
                      }
                    >
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            리뷰작성 조건
                          </P>
                        </FlexChild>
                        <FlexChild gap={10}>
                          <P>리뷰</P>
                          <InputNumber
                            ref={(el) => {
                              inputs.current[6] = el;
                            }}
                            name={"리뷰제한수"}
                            min={1}
                            max={99999999}
                            width={250 - 80}
                            hideArrow
                          />
                          <P>개 이상 작성시</P>
                          <FlexChild width={"max-content"} gap={5}>
                            (
                            <CheckboxGroup
                              name="review_image"
                              onChange={(values) =>
                                setReviewImage(values.includes("image"))
                              }
                              initialValues={reviewImage ? ["image"] : []}
                              values={reviewImage ? ["image"] : []}
                            >
                              <FlexChild width={"max-content"} gap={5}>
                                <CheckboxChild id="image" />
                                <P>이미지 필수 등록</P>
                              </FlexChild>
                            </CheckboxGroup>
                          </FlexChild>
                          )
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      hidden={
                        target === "manual" ||
                        (target === "condition" &&
                          (condition === "signup" || condition === "first"))
                      }
                    >
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            대상 회원등급
                          </P>
                        </FlexChild>
                        <FlexChild width={500}>
                          <Select
                            classNames={{ header: styles.select }}
                            id="group"
                            scrollMarginTop={150}
                            options={[
                              { display: "모든 회원", value: null },
                              ...groups
                                .sort(
                                  (g1: GroupData, g2: GroupData) =>
                                    g1.min - g2.min
                                )
                                .map((group: GroupData) => ({
                                  display: group.name,
                                  value: group.id,
                                })),
                            ]}
                            value={group as any}
                            onChange={(value) => setGroup(value as string)}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      hidden={
                        target === "manual" ||
                        target === "interval" ||
                        (target === "condition" &&
                          (condition === "signup" ||
                            condition === "birthday" ||
                            condition === "date")) ||
                        condition === "first"
                      }
                    >
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            발급 수 제한
                          </P>
                        </FlexChild>
                        <FlexChild padding={"9px 0"}>
                          <VerticalFlex gap={10} flexStart>
                            <FlexChild>
                              <RadioGroup
                                name="limitCount"
                                value={limitCount ? "limit" : "unlimit"}
                                onValueChange={(value) => {
                                  setLimitCount(value === "limit");
                                }}
                              >
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={12}
                                >
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id={"unlimit"} />
                                    <P>제한 없음</P>
                                  </FlexChild>
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id={"limit"} />
                                    <P>제한</P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </RadioGroup>
                            </FlexChild>
                            <FlexChild
                              hidden={!limitCount}
                              width={500}
                              gap={10}
                            >
                              <P>선착순</P>
                              <InputNumber
                                ref={(el) => {
                                  inputs.current[4] = el;
                                }}
                                name={"제한수"}
                                min={1}
                                max={99999999}
                                width={250 - 80}
                                hideArrow
                              />
                              <P>매</P>
                            </FlexChild>
                          </VerticalFlex>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      hidden={
                        target === "manual" ||
                        target === "interval" ||
                        (target === "condition" &&
                          (condition === "signup" ||
                            condition === "birthday" ||
                            condition === "date" ||
                            condition === "first"))
                      }
                    >
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600} textAlign="center">
                            동일인 재발급 가능 여부
                          </P>
                        </FlexChild>
                        <FlexChild padding={"9px 0"}>
                          <VerticalFlex gap={10} flexStart>
                            <FlexChild>
                              <RadioGroup
                                name="duplicate"
                                value={duplicate ? "true" : "false"}
                                onValueChange={(value) => {
                                  setDuplicate(value === "true");
                                }}
                              >
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={12}
                                >
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id={"false"} />
                                    <P>불가능</P>
                                  </FlexChild>
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id={"true"} />
                                    <P>제한</P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </RadioGroup>
                            </FlexChild>
                            <FlexChild hidden={!duplicate} width={500} gap={10}>
                              <P>추가수량 최대</P>
                              <InputNumber
                                ref={(el) => {
                                  inputs.current[5] = el;
                                }}
                                name={"추가수량"}
                                min={1}
                                max={99999999}
                                width={250 - 80}
                                hideArrow
                              />
                              <P>매</P>
                            </FlexChild>
                          </VerticalFlex>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      hidden={!(target === "condition" && condition === "date")}
                    >
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            발급시점
                          </P>
                        </FlexChild>
                        <FlexChild padding={"9px 0"}>
                          <VerticalFlex gap={10} flexStart>
                            <FlexChild>
                              <RadioGroup
                                name="lunar"
                                value={issueLunar ? "lunar" : "sun"}
                                onValueChange={(value) => {
                                  const lunar = value === "lunar";
                                  setIssueLunar(lunar);
                                  if (lunar) {
                                    const lunarDate =
                                      lunisolar(issueDate).lunar;

                                    setIssueDate(
                                      new Date(
                                        `${lunarDate.year}.${lunarDate.month}.${lunarDate.day}`
                                      )
                                    );
                                  } else {
                                    const lunarDate = lunisolar.fromLunar({
                                      year: issueDate.getFullYear(),
                                      month: issueDate.getMonth() + 1,
                                      day: issueDate.getDate(),
                                    });
                                    setIssueDate(lunarDate._date);
                                  }
                                }}
                              >
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={12}
                                >
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id={"sun"} />
                                    <P>양력</P>
                                  </FlexChild>
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id={"lunar"} />
                                    <P>음력</P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </RadioGroup>
                            </FlexChild>
                            <FlexChild width={500} gap={10}>
                              <Select
                                classNames={{ header: styles.select }}
                                value={issueDate.getMonth()}
                                options={Array.from({ length: 12 }).map(
                                  (_, index) => ({
                                    display: `${index + 1}월`,
                                    value: index,
                                  })
                                )}
                                onChange={(value) => {
                                  const date = new Date(issueDate);
                                  date.setMonth(Number(value));
                                  date.setDate(1);
                                  setIssueDate(date);
                                }}
                              />
                              <Select
                                classNames={{ header: styles.select }}
                                key={issueDate.getTime()}
                                value={issueDate.getDate()}
                                options={Array.from({ length: 31 })
                                  .filter((_, index) => {
                                    const date = new Date(issueDate);
                                    date.setMonth(date.getMonth() + 1);
                                    date.setDate(0);
                                    return date.getDate() > index;
                                  })
                                  .map((_, index) => ({
                                    display: `${index + 1}일`,
                                    value: index + 1,
                                  }))}
                                onChange={(value) => {
                                  const date = new Date(issueDate);
                                  date.setDate(Number(value));
                                  setIssueDate(date);
                                }}
                              />
                            </FlexChild>
                          </VerticalFlex>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild hidden={target !== "manual"}>
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            노출시점
                          </P>
                        </FlexChild>
                        <FlexChild padding={"9px 0"}>
                          <VerticalFlex gap={10} flexStart>
                            <FlexChild>
                              <RadioGroup
                                name="appears_at"
                                value={appearsAt ? "some" : "now"}
                                onValueChange={(value) => {
                                  if (value === "some") {
                                    setAppearsAt(new Date());
                                  } else setAppearsAt(null);
                                }}
                              >
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={12}
                                >
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id={"now"} />
                                    <P>즉시 노출</P>
                                  </FlexChild>
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id={"some"} />
                                    <P>지정한 시점에 노출</P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </RadioGroup>
                            </FlexChild>
                            <FlexChild hidden={!appearsAt} width={500}>
                              <DatePicker
                                defaultSelectedDate={appearsAt || new Date()}
                                selectionMode="single"
                                showTimePicker
                                onChange={(date) => setAppearsAt(date as Date)}
                              />
                            </FlexChild>
                          </VerticalFlex>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild hidden={target !== "interval"}>
                      <HorizontalFlex
                        gap={20}
                        border={"1px solid #EFEFEF"}
                        borderRight={"none"}
                        borderLeft={"none"}
                        borderTop={"none"}
                        justifyContent={"flex-start"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600} textAlign="center">
                            정기 발급 시점
                          </P>
                        </FlexChild>
                        <FlexChild padding={"9px 0"}>
                          <HorizontalFlex gap={10}>
                            <FlexChild width={250}>
                              <Select
                                value={interval}
                                onChange={(value) => setInterval(Number(value))}
                                classNames={{ header: styles.select }}
                                maxWidth={250}
                                options={[
                                  { display: "1개월", value: 1 },
                                  { display: "3개월", value: 3 },
                                  { display: "6개월", value: 6 },
                                  { display: "12개월", value: 12 },
                                ]}
                              />
                            </FlexChild>
                            <FlexChild>
                              <P>단위로 1일 0시 0분에 쿠폰 자동 발급</P>
                            </FlexChild>
                          </HorizontalFlex>
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                  </VerticalFlex>
                </div>
              </FlexChild>
            </VerticalFlex>
          </div>
        </FlexChild>
        <FlexChild>
          <div className={styles.container}>
            <VerticalFlex>
              <FlexChild>
                <div className={styles.label}>
                  <Center width={"100%"} textAlign={"left"}>
                    <P size={25} weight={600}>
                      STEP 2. 사용 정보
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
                        borderTop={"none"}
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            사용기간
                          </P>
                        </FlexChild>
                        <FlexChild padding={"9px 0"}>
                          <VerticalFlex flexStart gap={10}>
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
                                        display: "특정범위",
                                        value: "fixed",
                                        description: `ex) ${new Date().toLocaleDateString()}부터 ${new Date(
                                          new Date().getTime() +
                                            1000 * 60 * 60 * 24 * 18
                                        ).toLocaleDateString()}일까지`,
                                      },
                                      {
                                        display: "발급일 기준 기간",
                                        value: "range",
                                        description: `ex) 1개월 => ${new Date(
                                          `${new Date().getFullYear()}.${
                                            new Date().getMonth() + 2
                                          }.${new Date().getDate()}`
                                        ).toLocaleDateString()}까지`,
                                      },
                                      {
                                        display: "발급 당일",
                                        value: "day",
                                        description: `ex) ${new Date().toLocaleDateString()} 23:59까지`,
                                      },
                                      {
                                        display: "발급 해당주",
                                        value: "week",
                                        description: `ex) ${new Date(
                                          `${new Date().getFullYear()}.${
                                            new Date().getMonth() + 1
                                          }.${
                                            new Date().getDate() -
                                            new Date().getDay() +
                                            1
                                          }`
                                        ).toLocaleDateString()}부터 ${new Date(
                                          `${new Date().getFullYear()}.${
                                            new Date().getMonth() + 1
                                          }.${
                                            new Date().getDate() -
                                            new Date().getDay() +
                                            7
                                          }`
                                        ).toLocaleDateString()}까지`,
                                      },
                                      {
                                        display: "발급 당월 말일까지",
                                        value: "month",
                                        description: `ex) ${new Date(
                                          new Date(
                                            `${new Date().getFullYear()}.${
                                              new Date().getMonth() + 2
                                            }.1`
                                          ).getTime() - 1
                                        ).toLocaleDateString()}까지`,
                                      },
                                      {
                                        display: "발급 년도",
                                        value: "year",
                                        description: `ex) ${new Date().getFullYear()}. 12. 31까지`,
                                      },
                                    ] as {
                                      display: string;
                                      value: DateType;
                                      description?: string | React.ReactNode;
                                    }[]
                                  )
                                    .slice(
                                      target !== "manual" && target !== "link"
                                        ? 1
                                        : 0
                                    )
                                    .map((date) => (
                                      <FlexChild
                                        key={date.value}
                                        gap={6}
                                        width={"max-content"}
                                      >
                                        <RadioChild id={date.value} />
                                        <P>{date.display}</P>
                                        {date.description && (
                                          <Tooltip content={date.description}>
                                            <Image
                                              src="/resources/images/question.png"
                                              size={16}
                                            />
                                          </Tooltip>
                                        )}
                                      </FlexChild>
                                    ))}
                                </HorizontalFlex>
                              </RadioGroup>
                            </FlexChild>
                            <FlexChild
                              width={500}
                              hidden={date !== "fixed" && date !== "range"}
                            >
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
                                      min={1}
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
                          </VerticalFlex>
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
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            적용 범위
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
                                    display: "배송비 할인",
                                    value: "shipping",
                                    description: "배송비에만 적용되는 쿠폰",
                                  },
                                  {
                                    display: "상품 할인",
                                    value: "item",
                                    description: "상품 한개에만 적용되는 쿠폰",
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
                    <FlexChild
                      border={"1px solid #EFEFEF"}
                      borderRight={"none"}
                      borderLeft={"none"}
                      hidden={type !== "item"}
                    >
                      <HorizontalFlex gap={20} alignItems="stretch">
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P
                            size={16}
                            weight={600}
                            wordBreak="break-word"
                            textAlign="center"
                          >
                            상품 선택
                            {products?.length ? ` (${products.length})` : ""}
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <VerticalFlex gap={10} padding={"9px  0"}>
                            <FlexChild>
                              <RadioGroup
                                name="product_type"
                                value={productType}
                                onValueChange={(value) => {
                                  setProductType(value);
                                  setProducts([]);
                                  setSelected([]);
                                  setSelectedCategories([]);
                                }}
                              >
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={12}
                                >
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id="all" />
                                    <P>전체상품</P>
                                  </FlexChild>
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id="certain" />
                                    <P>특정상품</P>
                                  </FlexChild>
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id="category" />
                                    <P>특정카테고리</P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </RadioGroup>
                            </FlexChild>
                            <FlexChild
                              hidden={productType !== "category"}
                              paddingRight={15}
                              id="category"
                              gap={"5px 10px"}
                              flexWrap="wrap"
                              padding={"5px 0"}
                            >
                              {selectedCategories?.length === 0 ? (
                                <Button
                                  scrollMarginTop={150}
                                  styleType="admin"
                                  onClick={() => {
                                    if (!store)
                                      return toast({
                                        message: "스토어를 먼저 선택해주세요",
                                      });
                                    if (categories?.length === 0)
                                      return toast({
                                        message: "등록된 카테고리가 없습니다.",
                                      });
                                    NiceModal.show("categorySelect", {
                                      categories,
                                      selected: selectedCategories,
                                      onSelect: (value: CategoryData[]) =>
                                        setSelectedCategories(value),
                                    });
                                  }}
                                >
                                  <P size={16} color="#fff">
                                    미설정
                                  </P>
                                </Button>
                              ) : (
                                selectedCategories.map((category) => (
                                  <Button
                                    key={category.id}
                                    scrollMarginTop={150}
                                    styleType="admin"
                                    onClick={() => {
                                      if (!store)
                                        return toast({
                                          message: "스토어를 먼저 선택해주세요",
                                        });
                                      if (categories?.length === 0)
                                        return toast({
                                          message:
                                            "등록된 카테고리가 없습니다.",
                                        });
                                      NiceModal.show("categorySelect", {
                                        categories,
                                        selected: selectedCategories,
                                        onSelect: (value: CategoryData[]) =>
                                          setSelectedCategories(value),
                                      });
                                    }}
                                  >
                                    <P size={16} color="#fff">
                                      {getCategoryName(category)}
                                    </P>
                                  </Button>
                                ))
                              )}
                            </FlexChild>
                            <FlexChild
                              gap={10}
                              hidden={productType !== "certain"}
                            >
                              <Button
                                className={styles.add}
                                onClick={() =>
                                  NiceModal.show("table", {
                                    indexing: false,
                                    slideUp: false,
                                    width: "60vw",
                                    height: "60vh",
                                    search: true,
                                    overflow: "scroll",
                                    columns: [
                                      {
                                        label: "썸네일",
                                        code: "thumbnail",
                                        Cell: ({ cell }: any) => (
                                          <Image src={cell} size={50} />
                                        ),
                                        styling: {
                                          common: {
                                            style: {
                                              width: 100,
                                              minWidth: 100,
                                            },
                                          },
                                        },
                                      },
                                      { label: "상품명", code: "title" },
                                      {
                                        label: "판매가",
                                        code: "price",
                                        styling: {
                                          common: {
                                            style: {
                                              width: 120,
                                              minWidth: 120,
                                            },
                                          },
                                        },
                                      },
                                    ],
                                    selectable: true,
                                    onMaxPage: (data: Pageable) =>
                                      data?.totalPages || 0,
                                    onReprocessing: (data: Pageable) =>
                                      data?.content || [],
                                    onSearch: (condition: any) =>
                                      adminRequester.getProducts(condition),
                                    onSelect: (data: any[]) =>
                                      setProducts(
                                        _.uniqBy(
                                          [...products, ...data],
                                          (product) => product?.id
                                        )
                                      ),
                                  })
                                }
                              >
                                추가
                              </Button>
                              <Button
                                disabled={selected?.length === 0}
                                className={styles.cancel}
                                onClick={() => {
                                  setProducts(
                                    products.filter(
                                      (f) => !selected.includes(f.id)
                                    )
                                  );
                                  setSelected([]);
                                }}
                              >
                                삭제
                              </Button>
                            </FlexChild>
                            <FlexChild hidden={productType !== "certain"}>
                              <CheckboxGroup
                                name="selected"
                                values={selected}
                                onChange={(values) => setSelected(values)}
                              >
                                <VerticalFlex
                                  maxHeight={300}
                                  minHeight={300}
                                  overflow="scroll"
                                  overflowY="scroll"
                                  border={"1px solid #d0d0d0"}
                                >
                                  <FlexChild
                                    padding={"0 10px"}
                                    borderBottom={"1px solid #d0d0d0"}
                                    position="sticky"
                                    top={0}
                                    backgroundColor="#fff"
                                    zIndex={1}
                                  >
                                    <HorizontalFlex
                                      gap={10}
                                      alignItems="stretch"
                                    >
                                      <FlexChild
                                        width={"max-content"}
                                        padding={"10px 10px 10px 0"}
                                        borderRight={"1px solid #d0d0d0"}
                                      >
                                        <CheckboxAll />
                                      </FlexChild>
                                      <FlexChild width={50} padding={"10px 0"}>
                                        <P>썸네일</P>
                                      </FlexChild>
                                      <FlexChild
                                        borderLeft={"1px solid #d0d0d0"}
                                        borderRight={"1px solid #d0d0d0"}
                                        padding={"10px 5px"}
                                      >
                                        <P>상품명</P>
                                      </FlexChild>
                                      <FlexChild width={120} padding={"10px 0"}>
                                        <P>판매가</P>
                                      </FlexChild>
                                    </HorizontalFlex>
                                  </FlexChild>
                                  {products.map((product) => (
                                    <FlexChild
                                      key={product.id}
                                      padding={"0 10px"}
                                      borderBottom={"1px solid #d0d0d0"}
                                    >
                                      <HorizontalFlex
                                        gap={10}
                                        alignItems="stretch"
                                      >
                                        <FlexChild
                                          width={"max-content"}
                                          padding={"10px 10px 10px 0"}
                                          borderRight={"1px solid #d0d0d0"}
                                          zIndex={0}
                                        >
                                          <CheckboxChild id={product.id} />
                                        </FlexChild>
                                        <FlexChild
                                          width={50}
                                          padding={"10px 0"}
                                        >
                                          <Image
                                            src={product.thumbnail}
                                            size={50}
                                            border={"1px solid #d0d0d0"}
                                          />
                                        </FlexChild>
                                        <FlexChild
                                          borderLeft={"1px solid #d0d0d0"}
                                          borderRight={"1px solid #d0d0d0"}
                                          padding={"10px 5px"}
                                        >
                                          <P>{product.title}</P>
                                        </FlexChild>
                                        <FlexChild
                                          width={120}
                                          padding={"10px 0"}
                                        >
                                          <P>{product.price}</P>
                                        </FlexChild>
                                      </HorizontalFlex>
                                    </FlexChild>
                                  ))}
                                </VerticalFlex>
                              </CheckboxGroup>
                            </FlexChild>
                          </VerticalFlex>
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
                        alignItems="stretch"
                      >
                        <FlexChild
                          width={"180px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                        >
                          <HorizontalFlex
                            justifyContent={"center"}
                            height={16}
                            gap={3}
                          >
                            <P size={16} weight={600}>
                              최소 금액
                            </P>
                            <Tooltip content="상품 금액의 합(상품 기본 프로모션 적용)">
                              <Image
                                src="/resources/images/question.png"
                                size={16}
                              />
                            </Tooltip>
                          </HorizontalFlex>
                        </FlexChild>
                        <FlexChild width={500} padding={"10px 0"}>
                          <VerticalFlex gap={10}>
                            <FlexChild>
                              <RadioGroup
                                name="limitPrice"
                                value={limitPrice ? "limit" : "unlimit"}
                                onValueChange={(value) =>
                                  setLimitPrice(value === "limit")
                                }
                              >
                                <HorizontalFlex
                                  justifyContent="flex-start"
                                  gap={12}
                                >
                                  <FlexChild width={"max-content"} gap={6}>
                                    <RadioChild id={"unlimit"} />
                                    <P>제한 없음</P>
                                  </FlexChild>
                                  <FlexChild width={"max-content"} gap={6}>
                                    <RadioChild id={"limit"} />
                                    <P>금액 제한</P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </RadioGroup>
                            </FlexChild>
                            <FlexChild hidden={!limitPrice}>
                              <InputNumber
                                ref={(el) => {
                                  inputs.current[3] = el;
                                }}
                                name={"최소금액"}
                                min={0}
                                max={99999999}
                                width={250 - 80}
                                step={1000}
                              />
                            </FlexChild>
                          </VerticalFlex>
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
