import Button from "@/components/buttons/Button";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Div from "@/components/div/Div";
import Editor from "@/components/editor/edtior";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputHashTag from "@/components/inputs/InputHashTag";
import InputImage from "@/components/inputs/InputImage";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./ProductModal.module.css";
const ProductModal = NiceModal.create(
  ({
    product,
    edit = false,
    onSuccess,
  }: {
    product: any;
    edit?: boolean;
    onSuccess?: () => void;
  }) => {
    const [categoryIds, setCategoryIds] = useState(
      (product.categories ?? []).map((cat: CategoryData) => cat.id)
    );
    const { selectedCategories } = useData(
      "selectedCategories",
      { store_id: product.store_id, tree: "ancestors", ids: categoryIds },
      (condition) => adminRequester.getCategories(condition),
      {
        onReprocessing: (data) => data?.content || [],
        refresh: {
          revalidateOnFocus: edit,
        },
      }
    );
    const { categories } = useData(
      "categories",
      {
        parent_id: null,
        store_id: product.store_id,
        tree: "descendants",
      },
      (condition) => adminRequester.getCategories(condition),
      {
        onReprocessing: (data) => data?.content || [],
        refresh: {
          revalidateOnFocus: edit,
        },
      }
    );
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "상품 " + (edit ? "편집" : "상세정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [thumbnail] = useState(product.thumbnail ? [product.thumbnail] : []);
    const inputs = useRef<any[]>([]);
    const image = useRef<any>(null);
    const [detail, setDetail] = useState(product.detail);
    // const [adult, setAdult] = useState<boolean>(product.adult);
    const [radio, setRadio] = useState<boolean[]>([
      product.visible,
      product.buyable,
      // product.tax_rate === 0,
      true,
    ]);
    const [warehousing, setWarehousing] = useState<boolean>(
      !!product?.warehousing
    );
    const [productType, setProductType] = useState<string>(
      product?.product_type ?? "null" // "null" | "is_set" | "random_box"
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const getName = (category: CategoryData): string => {
      if (category?.parent) {
        return getName(category?.parent) + " > " + category?.name;
      }
      return category?.name;
    };
    const handleSave = () => {
      setIsLoading(true);
      try {
        const title = inputs.current[0].getValue();
        if (!title) {
          return setError("상품명이 입력되지 않았습니다.");
        }
        const code = inputs.current[4].getValue();
        validateInputs([...inputs.current, image.current])
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return;

            const _data: ProductDataFrame = {
              store_id: product.store_id,
              brand_id: product.brand_id,
              categories: selectedCategories.map((category: CategoryData) => ({
                id: category.id,
              })),
              // adult,
              visible: radio[0],
              buyable: radio[1],
              warehousing,
              product_type:
                productType === "null"
                  ? null
                  : (productType as "is_set" | "random_box"),
              title: title,
              code,
              description: inputs.current[1].getValue(),
              price: inputs.current[2].getValue(),
              thumbnail: image.current.getValue(),
              tags: inputs.current[3].getValue(),
              detail,
              // tax_rate: !radio[2] ? inputs.current[3].getValue() : 0,
              tax_rate: 0,
            };

            adminRequester.updateProduct(
              product.id,
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
      if (!product) {
        modal.current.close();
      }
    }, [product]);
    useClientEffect(() => {
      if (error) {
        setIsLoading(false);
        toast({ message: error });
      }
    }, [error]);
    return (
      <ModalBase
        borderRadius={10}
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
                src={product?.thumbnail || "/resources/images/no-img.png"}
                size={200}
              />
            )}
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>스토어</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{product?.store?.name}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>입점사</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{product?.brand?.name}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>카테고리</P>
              </FlexChild>
              <FlexChild
                className={styles.content}
                gap={"5px 10px"}
                flexWrap="wrap"
              >
                {edit
                  ? selectedCategories.map((category: CategoryData) => (
                      <Button
                        key={category.id}
                        styleType="admin"
                        onClick={() => {
                          NiceModal.show("categorySelect", {
                            categories,
                            selected: selectedCategories,
                            onSelect: (value: CategoryData[]) => {
                              if (value.length === 0)
                                NiceModal.show("confirm", {
                                  message:
                                    "카테고리는 최소 1개 선택되어야합니다.",
                                  confirmText: "확인",
                                });
                              else setCategoryIds(value.map((cat) => cat.id));
                            },
                          });
                        }}
                      >
                        <P>{getName(category)}</P>
                      </Button>
                    ))
                  : selectedCategories.map((category: CategoryData) => (
                      <P
                        key={category.id}
                        backgroundColor="var(--admin-color)"
                        color="#fff"
                        padding={"5px 10px"}
                      >
                        {getName(category)}
                      </P>
                    ))}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>상품명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={product.title}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[0] = el;
                    }}
                  />
                ) : (
                  <P>{product?.title}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>상품코드</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={product?.product?.code}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[4] = el;
                    }}
                  />
                ) : (
                  <P>{product?.code}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>요약설명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={product.description}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[1] = el;
                    }}
                  />
                ) : (
                  <P>{product.description || "없음"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>판매가</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <InputNumber
                    value={product.price}
                    max={99999999}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[2] = el;
                    }}
                  />
                ) : (
                  <P>
                    <Span>{product.price || 0}</Span>
                    <Span>{product?.store?.currency_unit}</Span>
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>진열상태</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <RadioGroup
                    name="visible"
                    onValueChange={(value) =>
                      setRadio((prev) => [
                        value === "visible",
                        prev[1],
                        prev[2],
                      ])
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
                  <P>{product.visible ? "진열중" : "미진열"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>판매상태</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <RadioGroup
                    name="buyable"
                    onValueChange={(value) =>
                      setRadio((prev) => [prev[0], value === "sale", prev[2]])
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
                  <P>{product.visible ? "판매중" : "판매중단"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>입고예정</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <RadioGroup
                    name="warehousing"
                    value={warehousing ? "planned" : "none"}
                    onValueChange={(v) => setWarehousing(v === "planned")}
                  >
                    <HorizontalFlex gap={20} justifyContent="flex-start">
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="planned" />
                        <P>처리</P>
                      </FlexChild>
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="none" />
                        <P>미처리</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </RadioGroup>
                ) : (
                  <P>{product.warehousing ? "입고예정" : "미처리"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>상품타입</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <RadioGroup
                    name="product_type"
                    value={productType}
                    onValueChange={(v) => setProductType(v)}
                  >
                    <HorizontalFlex gap={20} justifyContent="flex-start">
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="null" />
                        <P>기본상품</P>
                      </FlexChild>
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="is_set" />
                        <P>세트상품</P>
                      </FlexChild>
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="random_box" />
                        <P>랜덤박스</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </RadioGroup>
                ) : (
                  <P>
                    {product?.product_type === "is_set"
                      ? "세트상품"
                      : product?.product_type === "random_box"
                      ? "랜덤박스"
                      : "기본상품"}
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {/* <FlexChild hidden={product?.store?.currency_unit === "P"}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>세금설정</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <RadioGroup
                    name="tax"
                    onValueChange={(value) =>
                      setRadio((prev) => [prev[0], prev[1], value === "in"])
                    }
                    value={radio[2] ? "in" : "out"}
                  >
                    <HorizontalFlex gap={20}>
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="in" />
                        <P>가격에 포함</P>
                      </FlexChild>
                      <FlexChild gap={6} width={"max-content"}>
                        <RadioChild id="out" />
                        <P>개별설정</P>
                      </FlexChild>
                      <FlexChild paddingLeft={10}>
                        <InputNumber
                          value={product.tax_rate}
                          ref={(el) => {
                            inputs.current[3] = el;
                          }}
                        />
                      </FlexChild>
                    </HorizontalFlex>
                  </RadioGroup>
                ) : (
                  <P>{product.tax_rate || "가격에 포함"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild> */}
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>태그설정</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <>
                    <InputHashTag
                      value={product.tags}
                      width={"100%"}
                      ref={(el) => {
                        inputs.current[3] = el;
                      }}
                    />
                  </>
                ) : (
                  <P>
                    {!product?.tags || product?.tags?.length === 0
                      ? "없음"
                      : (product?.tags || [])?.map((tag: string) => (
                          <Span
                            key={tag}
                            marginRight={6}
                            padding={"2px 6px"}
                            borderRadius={4}
                            backgroundColor="var(--admin-color)"
                            color="#fff"
                          >
                            #{tag}
                          </Span>
                        ))}
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {/* <FlexChild hidden={!edit && !adult}>
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
                      product.adult
                        ? "/resources/images/checkbox_on.png"
                        : "/resources/images/checkbox_off.png"
                    }
                  />
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild> */}
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>상세</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Editor
                    defaultValue={product?.detail}
                    onChange={(detail) => setDetail(detail)}
                    path="/product"
                  />
                ) : (
                  <Div
                    dangerouslySetInnerHTML={{
                      __html: product?.detail,
                    }}
                  />
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
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

export default ProductModal;
