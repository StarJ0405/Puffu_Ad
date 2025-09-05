"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Container from "@/components/container/Container";
import DatePicker from "@/components/date-picker/DatePicker";
import Div from "@/components/div/Div";
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
import useNavigate from "@/shared/hooks/useNavigate";
import { textFormat } from "@/shared/regExp";
import { scrollTo, toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useRef, useState } from "react";
import styles from "./page.module.css";
interface Rule {
  id: string;
  name: string;
  type: "discount" | "bundle";
  N: number;
  M: number;
  value: number;
  variants: VariantData[];
  products: ProductData[];
}
export default function ({ stores }: { stores: StoreData[] }) {
  const [store, setStore] = useState<string>("");
  const inputs = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dates, setDates] = useState<Date[]>();
  const [rules, setRules] = useState<Rule[]>([]);
  const [rule, setRule] = useState<string>();
  const navigate = useNavigate();
  const handleSave = async () => {
    if (!store) return scrollTo("store", "스토어를 설정해주세요.");

    const title = inputs.current[0].getValue();
    if (!title) return scrollTo("title", "프로모션명을 입력해주세요.");
    if (!dates) return scrollTo("dates", "기간을 선택해주세요");
    if (rules.length === 0) return scrollTo("rules", "규칙을 추가해주세요");
    if (
      rules.some(
        (rule) => rule.products.length === 0 && rule.variants.length === 0
      )
    ) {
      const index = rules.findIndex(
        (f) => f.products.length === 0 && f.variants.length === 0
      );
      setRule(rules[index].id);
      return scrollTo("items", "적용대상이 없는 규칙이 있습니다.");
    }
    setIsLoading(true);
    validateInputs(inputs.current)
      .then(({ isValid }: { isValid: boolean }) => {
        if (!isValid) return setIsLoading(false);
        const discounts: DiscountDataFrame[] =
          rules
            .filter((f) => f.type === "discount")
            .map((r) => ({
              name: r.name,
              value: r.value,
              products: r.products.map((p) => ({ id: p.id })) || [],
              variants: r.variants.map((v) => ({ id: v.id })) || [],
            })) || [];
        const bundles: BundleDataFrame[] =
          rules
            .filter((f) => f.type === "bundle")
            .map((r) => ({
              name: r.name,
              N: r.N,
              M: r.M,
              products: r.products.map((p) => ({ id: p.id })) || [],
              variants: r.variants.map((v) => ({ id: v.id })) || [],
            })) || [];
        const _data: EventDataFrame = {
          store_id: store,
          title,
          starts_at: dates[0],
          ends_at: dates[1],
          discounts,
          bundles,
        };

        adminRequester.createPromotion(
          _data,
          ({ message, error }: { message?: string; error?: string }) => {
            setIsLoading(false);
            if (message) navigate("/product/promotion/management");
            else if (error) toast({ message: error });
          }
        );
        setIsLoading(false);
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
                      STEP 1. 기본 설정
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
                              if (rules.length > 0) {
                                NiceModal.show("confirm", {
                                  message:
                                    "스토어 변경시 모든 설정된 내용이 삭제됩니다. 진행하시겠습니까?",
                                  confirmText: "변경",
                                  cancelText: "취소",
                                  onConfirm: () => {
                                    setStore(value as string);
                                    setRules([]);
                                    setRule("");
                                  },
                                });
                              } else {
                                setStore(value as string);
                              }
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
                            프로모션명
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Input
                            scrollMarginTop={150}
                            id="title"
                            ref={(el) => {
                              inputs.current[0] = el;
                            }}
                            name={"프로모션명"}
                            placeHolder={"프로모션명을 입력하세요."}
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
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            기간설정
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <FlexChild width={300} id="dates">
                            <DatePicker
                              selectionMode="range"
                              defaultSelectedRange={dates as any}
                              onChange={(dates) => setDates(dates as Date[])}
                            />
                          </FlexChild>
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
                      STEP 2. 상세 설정
                    </P>
                  </Center>
                </div>
              </FlexChild>
              <FlexChild>
                <div className={styles.contentWrap}>
                  <VerticalFlex>
                    <FlexChild>
                      <HorizontalFlex
                        overflow="scroll"
                        hideScrollbar
                        justifyContent="flex-start"
                        gap={10}
                      >
                        <P
                          className={styles.add}
                          onClick={() => {
                            if (!store)
                              return toast({
                                message: "스토어를 먼저 설정해주세요.",
                              });
                            NiceModal.show("input", {
                              message: "추가할 규칙 이름을 입력해주세요",
                              input: [
                                {
                                  type: "text",
                                  placeHolder: "예) 할인 10%.. / 2+1 행사",
                                },
                              ],
                              confirmText: "추가",
                              cancelText: "취소",
                              onConfirm: (value: string) => {
                                if (value.trim()) {
                                  const newRule: Rule = {
                                    id: String(new Date().getTime()),
                                    name: value,
                                    type: "discount",
                                    value: 1,
                                    N: 1,
                                    M: 1,
                                    products: [],
                                    variants: [],
                                  };
                                  setRules([...rules, newRule]);
                                  setRule(newRule.id);
                                } else {
                                  toast({
                                    message:
                                      "공백을 이름으로 입력할 수 없습니다.",
                                  });
                                }
                              },
                            });
                          }}
                        >
                          추가
                        </P>

                        {rules.map((_rule, index) => (
                          <FlexChild
                            key={`${_rule.name}_${index}`}
                            width={"max-content"}
                            position="relative"
                          >
                            <FlexChild
                              position="absolute"
                              top={0}
                              right={0}
                              padding={2}
                              backgroundColor={"#333"}
                              width={"max-content"}
                              cursor="pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                NiceModal.show("confirm", {
                                  message: `${_rule.name}을 삭제하시겠습니까?`,
                                  confirmText: "삭제",
                                  cancelText: "취소",
                                  onConfirm: () => {
                                    const index = rules.findIndex(
                                      (f) => f.id === _rule.id
                                    );
                                    const newRules = [
                                      ...rules.slice(0, index),
                                      ...rules.slice(index + 1),
                                    ];
                                    setRules(newRules);
                                    if (rule === _rule.id)
                                      setRule(
                                        newRules?.[
                                          Math.min(index, newRules.length - 1)
                                        ]?.id
                                      );
                                  },
                                });
                              }}
                            >
                              <Image
                                src="/resources/icons/closeBtn_white.png"
                                size={10}
                              />
                            </FlexChild>
                            <P
                              className={clsx(styles.rule, {
                                [styles.selected]: _rule?.id === rule,
                              })}
                              onClick={() => setRule(_rule.id)}
                            >
                              {_rule.name}
                            </P>
                          </FlexChild>
                        ))}
                      </HorizontalFlex>
                    </FlexChild>
                    <Rule
                      rule={rules.find((f) => f.id === rule)}
                      setRule={(_rule) => {
                        const index = rules.findIndex((f) => f.id === rule);
                        if (index >= 0) {
                          rules[index] = _rule;
                          setRules([...rules]);
                        }
                      }}
                      store_id={store}
                    />
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

const Rule = ({
  rule,
  setRule,
  store_id,
}: {
  rule?: Rule;
  setRule: (Rule: Rule) => void;
  store_id: string;
}) => {
  if (!rule) return <></>;
  return (
    <>
      <FlexChild marginTop={10}>
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
              타입
            </P>
          </FlexChild>
          <FlexChild paddingRight={15}>
            <RadioGroup
              name="type"
              value={rule.type}
              onValueChange={(value) => {
                rule.type = value as any;
                setRule(rule);
              }}
            >
              <HorizontalFlex justifyContent="flex-start" gap={20}>
                <FlexChild gap={12} width={"max-content"}>
                  <RadioChild id="discount" />
                  <P>할인</P>
                </FlexChild>
                <FlexChild gap={12} width={"max-content"}>
                  <RadioChild id="bundle" />
                  <P>N+M</P>
                </FlexChild>
              </HorizontalFlex>
            </RadioGroup>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      {rule.type === "discount" ? (
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
              <P size={16} weight={600} min={1}>
                할인율
              </P>
            </FlexChild>
            <FlexChild paddingRight={15}>
              <InputNumber
                value={rule.value}
                onChange={(value) => {
                  rule.value = value;
                  setRule(rule);
                }}
                suffix="%"
                min={1}
                max={100}
              />
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      ) : (
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
                증정 기준
              </P>
            </FlexChild>
            <FlexChild paddingRight={15}>
              <HorizontalFlex justifyContent="flex-start" gap={20}>
                <FlexChild gap={12} width={"max-content"}>
                  <InputNumber
                    value={rule.N}
                    onChange={(N) => {
                      rule.N = N;
                      setRule(rule);
                    }}
                    min={1}
                  />
                </FlexChild>
                <P>+</P>
                <FlexChild gap={12} width={"max-content"}>
                  <InputNumber
                    value={rule.M}
                    onChange={(M) => {
                      rule.M = M;
                      setRule(rule);
                    }}
                    min={1}
                  />
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      )}
      <FlexChild marginTop={10}>
        <HorizontalFlex
          gap={20}
          border={"1px solid #EFEFEF"}
          borderRight={"none"}
          borderLeft={"none"}
          justifyContent="stretch"
          alignItems="stretch"
        >
          <FlexChild
            width={"130px"}
            padding={"18px 15px"}
            backgroundColor={"#F5F6FB"}
            justifyContent={"center"}
          >
            <VerticalFlex gap={10} height={"100%"} justifyContent="center">
              <FlexChild
                justifyContent="center"
                gap={4}
                alignItems="flex-start"
              >
                <P size={16} weight={600}>
                  적용상품
                </P>
                <Tooltip
                  content={
                    rule.type === "discount"
                      ? "해당 상품의 모든 옵션에 적용됩니다."
                      : "해당 상품은 교차 선택으로 N + M이 적용됩니다."
                  }
                >
                  <Image src="/resources/images/question.png" size={14} />
                </Tooltip>
              </FlexChild>

              <Button
                styleType="admin"
                onClick={() =>
                  NiceModal.show("table", {
                    columns: [
                      {
                        label: "썸네일",
                        code: "thumbnail",
                        Cell: ({ cell }: { cell: string }) => (
                          <Tooltip
                            zIndex={10080}
                            disable={!cell}
                            content={
                              <Div
                                backgroundColor="white"
                                border={"0.5px solid #c0c0c0"}
                              >
                                <Image src={cell} size={"min(30vw,30vh)"} />
                              </Div>
                            }
                          >
                            <Image src={cell} size={50} />
                          </Tooltip>
                        ),
                        styling: {
                          common: {
                            style: {
                              width: 50,
                            },
                          },
                        },
                      },
                      {
                        label: "상품명",
                        code: "title",
                        Cell: ({ cell }: { cell: string }) => (
                          <FlexChild width={300}>
                            <P
                              width={300}
                              whiteSpace="break-spaces"
                              textOverflow="clip"
                              overflow="visible"
                            >
                              {cell}
                            </P>
                          </FlexChild>
                        ),
                        styling: {
                          common: {
                            style: {
                              width: 300,
                              minWidth: 300,
                            },
                          },
                        },
                      },
                    ],
                    limit: 10,
                    initCondition: {
                      store_id,
                      relations: ["variants", "brand"],
                    },
                    onMaxPage: (data: Pageable) => data?.totalPages || 0,
                    onSearch: (condition: any) =>
                      adminRequester.getProducts(condition),
                    onReprocessing: (data: any) => data?.content || [],
                    selectable: true,
                    width: "80vw",
                    search: true,
                    withCloseButton: true,
                    clickOutsideToClose: false,
                    onSelect: (data: ProductData[]) => {
                      rule.products = [...rule.products, ...data];
                      setRule(rule);
                    },
                  })
                }
              >
                추가
              </Button>
            </VerticalFlex>
          </FlexChild>
          <FlexChild
            paddingRight={15}
            flexWrap="wrap"
            gap={20}
            alignItems="flex-start"
          >
            {rule.products.map((product, index) => (
              <FlexChild
                key={`${product.id}_${index}`}
                className={styles.closeWrapper}
              >
                <FlexChild
                  position="absolute"
                  className={styles.close}
                  onClick={() => {
                    const products = rule.products;
                    const index = products.findIndex(
                      (f) => f.id === product.id
                    );
                    rule.products = [
                      ...products.slice(0, index),
                      ...products.slice(index + 1),
                    ];
                    setRule(rule);
                  }}
                >
                  <Image
                    src="/resources/images/closeBtnWhite2x.png"
                    size={11}
                  />
                </FlexChild>
                <VerticalFlex>
                  <Image src={product.thumbnail} size={200} />
                  <P>{product.title}</P>
                </VerticalFlex>
              </FlexChild>
            ))}
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <HorizontalFlex
          gap={20}
          border={"1px solid #EFEFEF"}
          borderRight={"none"}
          borderLeft={"none"}
          justifyContent="stretch"
          alignItems="stretch"
        >
          <FlexChild
            width={"130px"}
            padding={"18px 15px"}
            backgroundColor={"#F5F6FB"}
            justifyContent={"center"}
          >
            <VerticalFlex gap={10} height={"100%"} justifyContent="center">
              <FlexChild
                justifyContent="center"
                gap={4}
                alignItems="flex-start"
              >
                <P size={16} weight={600}>
                  적용옵션
                </P>
                <Tooltip
                  content={
                    rule.type === "discount"
                      ? "해당 옵션에'만' 적용됩니다."
                      : "해당 옵션은 비교차 선택으로 N + M이 적용됩니다."
                  }
                >
                  <Image src="/resources/images/question.png" size={14} />
                </Tooltip>
              </FlexChild>

              <Button
                styleType="admin"
                onClick={() =>
                  NiceModal.show("table", {
                    columns: [
                      {
                        label: "썸네일",
                        Cell: ({ row }: { row: VariantData }) => (
                          <Tooltip
                            zIndex={10080}
                            disable={!row.thumbnail && !row.product.thumbnail}
                            content={
                              <Div
                                backgroundColor="white"
                                border={"0.5px solid #c0c0c0"}
                              >
                                <Image
                                  src={row.thumbnail || row.product.thumbnail}
                                  size={"min(30vw,30vh)"}
                                />
                              </Div>
                            }
                          >
                            <Image
                              src={row.thumbnail || row.product.thumbnail}
                              size={50}
                            />
                          </Tooltip>
                        ),
                        styling: {
                          common: {
                            style: {
                              width: 50,
                            },
                          },
                        },
                      },
                      {
                        label: "상품명",

                        Cell: ({ row }: { row: VariantData }) => (
                          <FlexChild width={300}>
                            <P
                              width={300}
                              whiteSpace="break-spaces"
                              textOverflow="clip"
                              overflow="visible"
                            >
                              {row.title
                                ? `${row.product.title} / ${row.title}`
                                : `${row.product.title}`}
                            </P>
                          </FlexChild>
                        ),
                        styling: {
                          common: {
                            style: {
                              width: 300,
                              minWidth: 300,
                            },
                          },
                        },
                      },
                    ],
                    limit: 10,
                    initCondition: {
                      product: { store_id },
                      relations: ["product", "product.brand"],
                    },
                    onMaxPage: (data: Pageable) => data?.totalPages || 0,
                    onSearch: (condition: any) =>
                      adminRequester.getVariants(condition),
                    onReprocessing: (data: any) => data?.content || [],
                    selectable: true,
                    width: "80vw",
                    search: true,
                    withCloseButton: true,
                    clickOutsideToClose: false,
                    onSelect: (data: VariantData[]) => {
                      rule.variants = [...rule.variants, ...data];
                      setRule(rule);
                    },
                  })
                }
              >
                추가
              </Button>
            </VerticalFlex>
          </FlexChild>
          <FlexChild
            paddingRight={15}
            flexWrap="wrap"
            gap={20}
            alignItems="flex-start"
          >
            {rule.variants.map((variant, index) => (
              <FlexChild
                key={`${variant.id}_${index}`}
                className={styles.closeWrapper}
              >
                <FlexChild
                  position="absolute"
                  className={styles.close}
                  onClick={() => {
                    const variants = rule.variants;
                    const index = variants.findIndex(
                      (f) => f.id === variant.id
                    );
                    rule.variants = [
                      ...variants.slice(0, index),
                      ...variants.slice(index + 1),
                    ];
                    setRule(rule);
                  }}
                >
                  <Image
                    src="/resources/images/closeBtnWhite2x.png"
                    size={11}
                  />
                </FlexChild>
                <VerticalFlex>
                  <Image
                    src={variant.thumbnail || variant.product.thumbnail}
                    size={200}
                  />
                  <P>
                    {variant.title
                      ? `${variant.product.title} / ${variant.title}`
                      : `${variant.product.title}`}
                  </P>
                </VerticalFlex>
              </FlexChild>
            ))}
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    </>
  );
};
