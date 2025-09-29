import Button from "@/components/buttons/Button";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Tooltip from "@/components/tooltip/Tooltip";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./PromotionOptionModal.module.css";

const PromotionOptionModal = NiceModal.create(
  ({
    store_id,
    rule,
    onSuccess,
  }: {
    store_id: string;
    rule: any;
    edit?: boolean;
    onSuccess?: () => void;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "규칙 " + (rule?.id ? "편집" : "생성");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const input = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [type, setType] = useState(rule?.N ? "bundle" : "discount");
    const [products, setProducts] = useState(rule?.products || []);
    const [variants, setVariants] = useState(rule?.variants || []);
    const [value, setValue] = useState(rule?.value || 1);
    const [N, setN] = useState(rule?.N || 1);
    const [M, setM] = useState(rule?.M || 1);

    const handleSave = () => {
      setIsLoading(true);
      try {
        const name = input.current.getValue();
        if (!name.trim()) return setError("규칙명을 입력해주세요");
        if (products?.length === 0 && variants?.length == 0)
          return setError("상품이나 옵션은 적어도 1개 이상 존재해야합니다.");
        validateInputs([input.current]).then(({ isValid }) => {
          if (isValid) {
            if (rule?.id) {
              if (type === "discount") {
                const _data = {
                  value,
                  name,
                  products,
                  variants,
                };
                adminRequester.updatePromotionDiscount(
                  rule.event_id,
                  rule.id,
                  _data,
                  ({
                    message,
                    error,
                  }: {
                    message?: string;
                    error?: string;
                  }) => {
                    setIsLoading(false);
                    if (message) {
                      onSuccess?.();
                      modal.current.close();
                    } else if (error) setError(error);
                  }
                );
              } else {
                const _data = {
                  N,
                  M,
                  name,
                  products,
                  variants,
                };
                adminRequester.updatePromotionBundle(
                  rule.event_id,
                  rule.id,
                  _data,
                  ({
                    message,
                    error,
                  }: {
                    message?: string;
                    error?: string;
                  }) => {
                    setIsLoading(false);
                    if (message) {
                      onSuccess?.();
                      modal.current.close();
                    } else if (error) setError(error);
                  }
                );
              }
            } else {
              if (type === "discount") {
                const _data = {
                  value,
                  name,
                  products,
                  variants,
                };
                adminRequester.createPromotionDiscount(
                  rule.event_id,
                  _data,
                  ({
                    message,
                    error,
                  }: {
                    message?: string;
                    error?: string;
                  }) => {
                    setIsLoading(false);
                    if (message) {
                      onSuccess?.();
                      modal.current.close();
                    } else if (error) setError(error);
                  }
                );
              } else {
                const _data = {
                  N,
                  M,
                  name,
                  products,
                  variants,
                };
                adminRequester.createPromotionBundle(
                  rule.event_id,
                  _data,
                  ({
                    message,
                    error,
                  }: {
                    message?: string;
                    error?: string;
                  }) => {
                    setIsLoading(false);
                    if (message) {
                      onSuccess?.();
                      modal.current.close();
                    } else if (error) setError(error);
                  }
                );
              }
            }
          } else {
            setIsLoading(false);
          }
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
          <FlexChild borderBottom={"1px solid #d0d0d0"}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>규칙명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <Input
                  ref={input}
                  value={rule?.name}
                  className={styles.input}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild borderBottom={"1px solid #d0d0d0"}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>타입</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {rule?.id ? (
                  <P>{type === "discount" ? "할인" : "N+M"}</P>
                ) : (
                  <RadioGroup
                    name="type"
                    value={type}
                    onValueChange={(value) => setType(value)}
                  >
                    <HorizontalFlex justifyContent="flex-start" gap={12}>
                      <FlexChild width={"max-content"} gap={6}>
                        <RadioChild id="discount" />
                        <P>할인</P>
                      </FlexChild>
                      <FlexChild width={"max-content"} gap={6}>
                        <RadioChild id="bundle" />
                        <P>N+M</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </RadioGroup>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {type === "discount" ? (
            <FlexChild borderBottom={"1px solid #d0d0d0"}>
              <HorizontalFlex>
                <FlexChild className={styles.head}>
                  <P>할인율</P>
                </FlexChild>
                <FlexChild className={styles.content}>
                  <InputNumber
                    suffix="%"
                    min={1}
                    max={100}
                    value={value}
                    onChange={(value) => setValue(value)}
                  />
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          ) : (
            <FlexChild borderBottom={"1px solid #d0d0d0"}>
              <HorizontalFlex>
                <FlexChild className={styles.head}>
                  <P>증정 기준</P>
                </FlexChild>
                <FlexChild className={styles.content} gap={10}>
                  <InputNumber min={1} value={N} onChange={(N) => setN(N)} />
                  +
                  <InputNumber min={1} value={M} onChange={(M) => setM(M)} />
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          )}
          <FlexChild borderBottom={"1px solid #d0d0d0"}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
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
                      zIndex={10080}
                      content={
                        type === "discount"
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
                          setProducts([
                            ...products,
                            ...data.map((product) => ({
                              product_id: product.id,
                              product,
                            })),
                          ]);
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
                paddingTop={10}
                paddingBottom={10}
              >
                {products.map((product: any, index: number) => (
                  <FlexChild
                    key={`${product.id}_${index}`}
                    className={styles.closeWrapper}
                  >
                    <FlexChild
                      position="absolute"
                      className={styles.close}
                      onClick={() => {
                        const index = products.findIndex(
                          (f: any) => f.id === product.id
                        );
                        setProducts([
                          ...products.slice(0, index),
                          ...products.slice(index + 1),
                        ]);
                      }}
                    >
                      <Image
                        src="/resources/images/closeBtnWhite2x.png"
                        size={11}
                      />
                    </FlexChild>
                    <VerticalFlex>
                      <Image src={product?.product?.thumbnail} size={100} />
                      <P>{product?.product?.title}</P>
                    </VerticalFlex>
                  </FlexChild>
                ))}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
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
                      zIndex={10080}
                      content={
                        type === "discount"
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
                                disable={
                                  !row.thumbnail && !row.product.thumbnail
                                }
                                content={
                                  <Div
                                    backgroundColor="white"
                                    border={"0.5px solid #c0c0c0"}
                                  >
                                    <Image
                                      src={
                                        row.thumbnail || row.product.thumbnail
                                      }
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
                          setVariants([
                            ...variants,
                            ...data.map((variant) => ({
                              variant_id: variant.id,
                              variant,
                            })),
                          ]);
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
                paddingTop={10}
                paddingBottom={10}
              >
                {variants.map((variant: any, index: number) => (
                  <FlexChild
                    key={`${variant.id}_${index}`}
                    className={styles.closeWrapper}
                  >
                    <FlexChild
                      position="absolute"
                      className={styles.close}
                      onClick={() => {
                        const index = variants.findIndex(
                          (f: any) => f.id === variant.id
                        );
                        setVariants([
                          ...variants.slice(0, index),
                          ...variants.slice(index + 1),
                        ]);
                      }}
                    >
                      <Image
                        src="/resources/images/closeBtnWhite2x.png"
                        size={11}
                      />
                    </FlexChild>
                    <VerticalFlex>
                      <Image
                        src={
                          variant?.variant.thumbnail ||
                          variant?.variant?.product?.thumbnail
                        }
                        size={100}
                      />
                      <P>
                        {variant?.variant?.title
                          ? `${variant?.variant?.product?.title} / ${variant?.variant?.title}`
                          : `${variant?.variant?.product?.title}`}
                      </P>
                    </VerticalFlex>
                  </FlexChild>
                ))}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>

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
              {rule?.id ? "편집" : "등록"}
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
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default PromotionOptionModal;
