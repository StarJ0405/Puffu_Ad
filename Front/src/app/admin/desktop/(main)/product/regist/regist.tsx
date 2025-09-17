"use client";
import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Container from "@/components/container/Container";
import Editor from "@/components/editor/edtior";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputHashTag from "@/components/inputs/InputHashTag";
import InputImage from "@/components/inputs/InputImage";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { textFormat } from "@/shared/regExp";
import { scrollTo, toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import Option from "./option";
import styles from "./page.module.css";

export default function ({
  initStores,
  initBrands,
}: {
  initStores: StoreData[];
  initBrands: BrandData[];
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
  const { brands } = useData(
    "brands",
    { select: ["id", "name"] },
    (condition) => adminRequester.getBrands(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initBrands,
    }
  );
  const [store, setStore] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const { categories } = useData(
    "categories",
    { parent_id: null, store_id: store, tree: "descendants" },
    (condition) => adminRequester.getCategories(condition),
    { onReprocessing: (data) => data?.content || [] }
  );
  const inputs = useRef<any[]>([]);
  const optionRef = useRef<any>(null);
  const optionRadios = useRef<any[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  // const [adult, setAdult] = useState(false);
  const [radio, setRadio] = useState<boolean[]>([true, true, true]);
  const [optionType, setOptionType] = useState<string>("single");
  const [detail, setDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const getCategoryName = (
    category: CategoryData | null
  ): string | undefined => {
    if (category?.parent) {
      return getCategoryName(category.parent) + " > " + category?.name;
    }
    return category?.name;
  };
  // useClientEffect(() => {
  //   const _store = stores.find((_store) => _store.id === store);
  //   if (_store?.currency_unit === "P") {
  //     setRadio((prev) => [prev[0], prev[1], true]);
  //   } else {
  //     setRadio((prev) => [prev[0], prev[1], false]);
  //   }
  // }, [store]);
  const handleSave = async () => {
    if (!store) return scrollTo("store", "스토어를 설정해주세요.");
    if (!brand) return scrollTo("brand", "입점사를 설정해주세요.");
    if (!category) return scrollTo("category", "카테고리를 설정해주세요.");
    const title = inputs.current[0].getValue();
    if (!title) return scrollTo("title", "상품명을 입력해주세요.");
    setIsLoading(true);
    if (!(await optionRef?.current?.isValid?.())) return setIsLoading(false);
    const {
      variants,
      options,
    }: { variants: VariantDataFrame[]; options?: OptionDataFrame[] } =
      optionRef.current.getValue();
    validateInputs(inputs.current)
      .then(({ isValid }: { isValid: boolean }) => {
        if (!isValid) return setIsLoading(false);
        const _data: ProductDataFrame = {
          store_id: store,
          brand_id: brand,
          category_id: category.id,
          // adult,
          visible: radio[0],
          buyable: radio[1],
          title: title,
          description: inputs.current[1].getValue(),
          price: inputs.current[2].getValue(),
          thumbnail: inputs.current[3].getValue(),
          tags: inputs.current[4].getValue(),
          detail,
          variants,
          options,
          // tax_rate: !radio[2] ? inputs.current[3].getValue() : 0,
          tax_rate: 0,
        };

        adminRequester.createProduct(
          _data,
          ({ message, error }: { message?: string; error?: string }) => {
            setIsLoading(false);
            if (message) navigate("/product/management");
            else if (error) toast({ message: error });
          }
        );
      })
      .catch(() => {
        toast({ message: "오류가 발생했습니다." });
        setIsLoading(false);
      });
  };
  const handlePreview = () => {
    toast({ message: "구현 예정" });
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
                      STEP 1. 상품정보입력{" "}
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
                            options={stores.map((store: StoreData) => ({
                              display: store.name,
                              value: store.id,
                            }))}
                            onChange={(value) => {
                              setCategory(null);
                              setStore(value as string);
                            }}
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
                            입점사 설정
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Select
                            id="brand"
                            scrollMarginTop={150}
                            searchable={true}
                            options={brands.map((brand: BrandData) => ({
                              display: brand.name,
                              value: brand.id,
                            }))}
                            onChange={(value) => setBrand(value as string)}
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
                            카테고리 등록
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Button
                            id="category"
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
                              NiceModal.show("categoryList", {
                                categories,
                                disable: false,
                                onSelect: (
                                  value: CategoryData,
                                  parents: CategoryData[]
                                ) => {
                                  value.parent = parents.reduce(
                                    (
                                      acc: CategoryData | undefined,
                                      now: CategoryData
                                    ) => {
                                      if (acc) {
                                        now.parent = acc;
                                        return now;
                                      }
                                      return now;
                                    },
                                    undefined
                                  );
                                  setCategory(value);
                                },
                              });
                            }}
                          >
                            <P size={16}>
                              {getCategoryName(category) || "미설정"}
                            </P>
                          </Button>
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
                            상품명
                          </P>
                        </FlexChild>
                        <FlexChild paddingRight={15}>
                          <Input
                            scrollMarginTop={150}
                            id="title"
                            ref={(el) => {
                              inputs.current[0] = el;
                            }}
                            name={"상품명"}
                            placeHolder={"상품명을 입력하세요."}
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
                            요약설명
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <Input
                            ref={(el) => {
                              inputs.current[1] = el;
                            }}
                            validable={false}
                            placeHolder={"상품명 밑에 보여지는 문구 입니다."}
                            name={"요약설명"}
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
                        justifyContent={"flex-start"}
                      >
                        <FlexChild
                          width={"130px"}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            판매가
                          </P>
                        </FlexChild>
                        <FlexChild width={200}>
                          <InputNumber
                            ref={(el) => {
                              inputs.current[2] = el;
                            }}
                            name={"판매가"}
                            min={0}
                            max={999999}
                            width={250 - 80}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    {/* <HorizontalFlex marginTop={20}>
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
                    </HorizontalFlex> */}
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
                          표시상태
                        </P>
                      </FlexChild>
                      <FlexChild>
                        <HorizontalFlex>
                          <FlexChild gap={20}>
                            <FlexChild
                              width={"40%"}
                              padding={15}
                              backgroundColor={"#F5F6FB"}
                              justifyContent={"center"}
                            >
                              <P size={16} weight={600}>
                                진열상태
                              </P>
                            </FlexChild>
                            <RadioGroup
                              name="display"
                              value={radio[0] ? "display" : "undisplay"}
                              onValueChange={(value) =>
                                setRadio((prev) => {
                                  prev[0] = value === "display";
                                  return [...prev];
                                })
                              }
                            >
                              <HorizontalFlex gap={15}>
                                <FlexChild gap={6} width={"max-content"}>
                                  <RadioChild id="display" />
                                  <P size={16} color={"#333"} weight={500}>
                                    진열
                                  </P>
                                </FlexChild>
                                <FlexChild gap={6}>
                                  <RadioChild id="undisplay" />
                                  <P size={16} color={"#333"} weight={500}>
                                    미진열
                                  </P>
                                </FlexChild>
                              </HorizontalFlex>
                            </RadioGroup>
                          </FlexChild>
                          <FlexChild gap={20}>
                            <FlexChild
                              width={"40%"}
                              padding={15}
                              backgroundColor={"#F5F6FB"}
                              justifyContent={"center"}
                            >
                              <P size={16} weight={600}>
                                판매상태
                              </P>
                            </FlexChild>
                            <RadioGroup
                              name="sales"
                              value={radio[1] ? "sale" : "unsale"}
                              onValueChange={(value) =>
                                setRadio((prev) => {
                                  prev[1] = value === "sale";
                                  return [...prev];
                                })
                              }
                            >
                              <HorizontalFlex gap={15}>
                                <FlexChild gap={6} width={"max-content"}>
                                  <RadioChild id={"sale"} />
                                  <P size={16} color={"#333"} weight={500}>
                                    판매
                                  </P>
                                </FlexChild>
                                <FlexChild gap={6}>
                                  <RadioChild id="unsale" />
                                  <P size={16} color={"#333"} weight={500}>
                                    미판매
                                  </P>
                                </FlexChild>
                              </HorizontalFlex>
                            </RadioGroup>
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                    </VerticalFlex>
                    {/* <FlexChild
                      marginTop={20}
                      hidden={
                        stores.find((_store) => _store.id === store)
                          ?.currency_unit === "P"
                      }
                    >
                      <VerticalFlex borderBottom={"1px solid #EFEFEF"}>
                        <FlexChild
                          padding={15}
                          justifyContent={"center"}
                          backgroundColor={"#3C4B64"}
                        >
                          <P size={18} weight={600} color={"#ffffff"}>
                            세금설정
                          </P>
                        </FlexChild>
                        <FlexChild padding={"10px 0 0 0"}>
                          <RadioGroup
                            name="tax"
                            value={radio[2] ? "in" : "out"}
                            onValueChange={(value) =>
                              setRadio((prev) => {
                                prev[2] = value === "in";
                                return [...prev];
                              })
                            }
                          >
                            <HorizontalFlex
                              gap={15}
                              justifyContent={"flex-start"}
                            >
                              <FlexChild
                                width={"15%"}
                                padding={15}
                                backgroundColor={"#F5F6FB"}
                                justifyContent={"center"}
                              >
                                <P size={16} weight={600}>
                                  세금상태
                                </P>
                              </FlexChild>
                              <FlexChild width={"max-content"}>
                                <HorizontalFlex
                                  gap={15}
                                  justifyContent={"flex-start"}
                                >
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id="in" />
                                    <P size={16} color={"#333"} weight={500}>
                                      가격에포함
                                    </P>
                                  </FlexChild>
                                  <FlexChild gap={6} width={"max-content"}>
                                    <RadioChild id="out" />
                                    <P size={16} color={"#333"} weight={500}>
                                      개별설정
                                    </P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </FlexChild>
                              <FlexChild width={200}>
                                <InputNumber
                                  ref={(el) => {
                                    inputs.current[3] = el;
                                  }}
                                  name={"세금"}
                                  disabled={radio[2]}
                                  min={0.0}
                                  max={100.0}
                                  value={10}
                                  width={100}
                                />
                              </FlexChild>
                            </HorizontalFlex>
                          </RadioGroup>
                        </FlexChild>
                      </VerticalFlex>
                    </FlexChild> */}
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
                      STEP 2. 상품 상세등록
                    </P>
                  </Center>
                </div>
              </FlexChild>
              <FlexChild>
                <div className={styles.contentWrap}>
                  <VerticalFlex gap={20}>
                    <FlexChild
                      border={"1px solid #EFEFEF"}
                      borderRight={"none"}
                      borderLeft={"none"}
                    >
                      <HorizontalFlex gap={20} alignItems={"stretch"}>
                        <FlexChild
                          width={"130px"}
                          padding={15}
                          justifyContent={"center"}
                          backgroundColor={"#3C4B64"}
                        >
                          <P size={16} weight={600} color={"#ffffff"}>
                            썸네일
                          </P>
                        </FlexChild>
                        <FlexChild padding={"15px 20px 15px 0"}>
                          <InputImage
                            ref={(el) => {
                              inputs.current[3] = el;
                            }}
                            name={"상품_썸네일"}
                            path={"/product/thumbnail"}
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
                          padding={15}
                          justifyContent={"center"}
                          backgroundColor={"#3C4B64"}
                        >
                          <P size={16} weight={600} color={"#ffffff"}>
                            태그
                          </P>
                        </FlexChild>
                        <FlexChild>
                          <InputHashTag
                            ref={(el) => {
                              inputs.current[4] = el;
                            }}
                            width="100%"
                            name={"태그"}
                            placeHolder={"...태그"}
                          />
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                    <FlexChild
                      height={"100%"}
                      border={"1px solid #EFEFEF"}
                      borderRight={"none"}
                      borderLeft={"none"}
                    >
                      <HorizontalFlex gap={20} alignItems={"stretch"}>
                        <FlexChild
                          width={"130px"}
                          padding={15}
                          justifyContent={"center"}
                          backgroundColor={"#3C4B64"}
                        >
                          <P size={16} weight={600} color={"#ffffff"}>
                            상세페이지
                          </P>
                        </FlexChild>
                        <FlexChild height={"100%"} justifyContent={"center"}>
                          <Editor
                            onChange={(detail) => setDetail(detail)}
                            path="/product"
                          />
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
                      STEP 3. 옵션 설정
                    </P>
                  </Center>
                </div>
              </FlexChild>
              <FlexChild>
                <div className={styles.contentWrap}>
                  <VerticalFlex gap={20}>
                    <FlexChild
                      border={"1px solid #EFEFEF"}
                      borderRight={"none"}
                      borderLeft={"none"}
                    >
                      <RadioGroup
                        name="option"
                        value={optionType}
                        onValueChange={(value) => {
                          if (optionRef.current.isEmpty()) {
                            setOptionType(value);
                          } else {
                            NiceModal.show("confirm", {
                              confirmText: "변경",
                              cancelText: "취소",
                              message:
                                "변경시 지금까지 입력된 내용이 초기화됩니다.",
                              onConfirm: () => setOptionType(value),
                              admin: true,
                            });
                          }
                        }}
                      >
                        <HorizontalFlex gap={15} justifyContent={"flex-start"}>
                          <FlexChild
                            width={150}
                            padding={15}
                            backgroundColor={"#F5F6FB"}
                            justifyContent={"center"}
                          >
                            <P size={16} weight={600}>
                              옵션 종류 선택
                            </P>
                          </FlexChild>
                          <FlexChild width={"max-content"}>
                            <HorizontalFlex
                              gap={15}
                              justifyContent={"flex-start"}
                            >
                              <FlexChild
                                gap={6}
                                width={"max-content"}
                                cursor="pointer"
                                onClick={() => optionRadios.current[0].click()}
                              >
                                <RadioChild
                                  ref={(el) => {
                                    optionRadios.current[0] = el;
                                  }}
                                  id="single"
                                />
                                <P size={16} color={"#333"} weight={500}>
                                  단일옵션
                                </P>
                              </FlexChild>
                              <FlexChild
                                gap={6}
                                width={"max-content"}
                                cursor="pointer"
                                onClick={() => optionRadios.current[1].click()}
                              >
                                <RadioChild
                                  ref={(el) => {
                                    optionRadios.current[1] = el;
                                  }}
                                  id="simple"
                                />
                                <P size={16} color={"#333"} weight={500}>
                                  단순옵션
                                </P>
                              </FlexChild>
                              <FlexChild
                                gap={6}
                                width={"max-content"}
                                cursor="pointer"
                                onClick={() => optionRadios.current[2].click()}
                              >
                                <RadioChild
                                  ref={(el) => {
                                    optionRadios.current[2] = el;
                                  }}
                                  id="multiple"
                                />
                                <P size={16} color={"#333"} weight={500}>
                                  멀티옵션
                                </P>
                              </FlexChild>
                            </HorizontalFlex>
                          </FlexChild>
                        </HorizontalFlex>
                      </RadioGroup>
                    </FlexChild>
                    <FlexChild>
                      <Option type={optionType} ref={optionRef} />
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
                  styleType="white"
                  padding={"15px 74px"}
                  borderRadius={5}
                  fontSize={18}
                  fontWeight={700}
                  onClick={handlePreview}
                >
                  미리보기
                </Button>
              </FlexChild>
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
