import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper as ReactSwiper, SwiperSlide } from "swiper/react";
import { KeyedMutator } from "swr";
import ModalBase from "../../ModalBase";
import styles from "./VariantListModal.module.css";

const types = [
  {
    id: "single",
    label: "단일옵션",
    is: (product: ProductData): boolean => {
      return (
        product?.options?.length === 0 &&
        product?.variants?.length === 1 &&
        !product.variants[0]?.title
      );
    },
    trnsform: async (
      product: ProductData,
      before: string,
      onSuccess: () => void
    ): Promise<void> => {
      if (product.variants.length > 1) {
        return toast({ message: "옵션이 한개 일때만 전환이 가능합니다." });
      }

      NiceModal.show("confirm", {
        message: (
          <VerticalFlex>
            <P>{`단일옵션으로 전환하시겠습니까?`}</P>
            <P color="red">일부 불가능한 설정이 전부 삭제됩니다.</P>
          </VerticalFlex>
        ),
        confirmText: "전환",
        cancelText: "취소",
        onConfirm: () => {
          adminRequester.putProduct(
            product.id,
            {
              type: "single",
              before: types.find((type) => type.id === before)?.id,
            },
            ({ error, message }: { error: string; message: string }) => {
              if (error) toast({ message: error });
              else if (message) {
                onSuccess();
              }
            }
          );
        },
      });
    },
  },
  {
    id: "simple",
    label: "단순옵션",
    is: (product: ProductData): boolean => {
      return (
        product?.options?.length === 0 &&
        (product?.variants?.length > 1 || !!product.variants?.[0]?.title)
      );
    },
    trnsform: async (
      product: ProductData,
      before: string,
      onSuccess: () => void
    ): Promise<void> => {
      switch (before) {
        case "single": {
          function show(values?: string[]) {
            NiceModal.show("input", {
              message: "필요한 추가 정보를 입력해주세요.",
              input: [
                {
                  label: "썸네일",
                  type: "image",
                  placeHolder: "1:1이미지를 권장합니다.",
                  value: values?.[0],
                },
                {
                  label: "옵션명",
                  placeHolder: "기존 단일 옵션의 이름을 지정해주세요.",
                  value: values?.[1],
                },
              ],
              confirmText: "변경",
              cancelText: "취소",
              onConfirm: (values: string[]) => {
                if (values[1].trim() === "") {
                  setTimeout(() => {
                    setTimeout(() => {
                      toast({
                        message: "공백이 아닌 제목이 필요합니다.",
                      });
                    }, 10);
                    show(values);
                  }, 0);
                } else {
                  adminRequester.putProduct(
                    product.id,
                    {
                      type: "simple",
                      before: types.find((type) => type.id === before)?.id,
                      title: values[1].trim(),
                      thumbnail: values[0],
                    },
                    ({
                      error,
                      message,
                    }: {
                      error: string;
                      message: string;
                    }) => {
                      if (error) toast({ message: error });
                      else if (message) {
                        onSuccess();
                      }
                    }
                  );
                }
              },
            });
          }
          show();
          break;
        }
        case "multiple": {
          NiceModal.show("confirm", {
            message: (
              <VerticalFlex>
                <P>{`단순옵션으로 전환하시겠습니까?`}</P>
                <P color="red">일부 불가능한 설정이 전부 삭제됩니다.</P>
              </VerticalFlex>
            ),
            confirmText: "전환",
            cancelText: "취소",
            onConfirm: () => {
              adminRequester.putProduct(
                product.id,
                {
                  type: "simple",
                  before: types.find((type) => type.id === before)?.id,
                },
                ({ error, message }: { error: string; message: string }) => {
                  if (error) toast({ message: error });
                  else if (message) {
                    onSuccess();
                  }
                }
              );
            },
          });
          break;
        }
      }
    },
  },
  {
    id: "multiple",
    label: "멀티옵션",
    is: (product: ProductData): boolean => {
      return product.options.length > 0;
    },
    trnsform: async (
      product: ProductData,
      before: string,
      onSuccess: () => void
    ): Promise<void> => {
      switch (before) {
        case "single": {
          function show(values?: any[]) {
            NiceModal.show("input", {
              message: "필요한 추가 정보를 입력해주세요.",
              input: [
                {
                  label: "썸네일",
                  type: "image",
                  placeHolder: "1:1이미지를 권장합니다.",
                  value: values?.[0],
                },
                {
                  label: "옵션명",
                  placeHolder: "기존 단일 옵션의 이름을 지정해주세요.",
                  value: values?.[1],
                },
                {
                  label: "옵션 카테고리",
                  type: "hash",
                  placeHolder: "2가지 이상의 옵션 카테고리를 입력해주세요.",
                  value: values?.[2],
                },
              ],
              confirmText: "변경",
              cancelText: "취소",
              onConfirm: (values: any[]) => {
                if (values?.[2]?.length < 2) {
                  setTimeout(() => {
                    show(values);
                    setTimeout(() => {
                      toast({
                        message:
                          "최소 2가지 이상의 옵션 카테고리가 필요합니다.",
                      });
                    }, 10);
                  }, 0);
                } else if (values[1].trim() === "") {
                  setTimeout(() => {
                    setTimeout(() => {
                      toast({
                        message: "공백이 아닌 제목이 필요합니다.",
                      });
                    }, 10);
                    show(values);
                  }, 0);
                } else {
                  adminRequester.putProduct(
                    product.id,
                    {
                      type: "multiple",
                      before: types.find((type) => type.id === before)?.id,
                      title: values[1].trim(),
                      thumbnail: values[0],
                      options: values[2],
                    },
                    ({
                      error,
                      message,
                    }: {
                      error: string;
                      message: string;
                    }) => {
                      if (error) toast({ message: error });
                      else if (message) {
                        onSuccess();
                      }
                    }
                  );
                }
              },
            });
          }
          show();
          break;
        }
        case "simple": {
          function show(values: string[] = []) {
            NiceModal.show("input", {
              message: "필요한 추가 정보를 입력해주세요.",
              input: [
                {
                  type: "hash",
                  placeHolder: "2가지 이상의 옵션 카테고리를 입력해주세요.",
                  value: values,
                },
              ],
              confirmText: "변경",
              cancelText: "취소",
              onConfirm: (values: string[]) => {
                if (values.length < 2) {
                  setTimeout(() => {
                    show(values);
                    setTimeout(() => {
                      toast({
                        message:
                          "최소 2가지 이상의 옵션 카테고리가 필요합니다.",
                      });
                    }, 10);
                  }, 0);
                } else {
                  adminRequester.putProduct(
                    product.id,
                    {
                      type: "multiple",
                      before: types.find((type) => type.id === before)?.id,
                      options: values,
                    },
                    ({
                      error,
                      message,
                    }: {
                      error: string;
                      message: string;
                    }) => {
                      if (error) toast({ message: error });
                      else if (message) {
                        onSuccess();
                      }
                    }
                  );
                }
              },
            });
          }
          show();
          break;
        }
      }
    },
  },
];
const VariantListModal = NiceModal.create(
  ({
    product: initProduct,
    onSuccess,
  }: {
    product: ProductData;
    onSuccess?: () => void;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "옵션 관리";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const { product, mutate } = useData(
      "product",
      {
        relations: ["variants.product.store", "variants.values", "options"],
      },
      (condition) => adminRequester.getProduct(initProduct.id, condition),
      {
        onReprocessing: (data) => data?.content,
        fallbackData: { content: initProduct },
        revalidateOnMount: true,
      }
    );
    const [type, setType] = useState(
      types.find((type) => type.is(initProduct))
    );

    useEffect(() => {
      if (!product) {
        modal.current.close();
      } else {
        setType(types.find((type) => type.is(product)));
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
          maxHeight={"80vh"}
          overflow="scroll"
          overflowY="scroll"
          position="relative"
          hideScrollbar
        >
          <FlexChild paddingBottom={10}>
            <HorizontalFlex>
              {types.map((_type, index) => (
                <FlexChild
                  key={`types_${index}`}
                  className={clsx(styles.list, {
                    [styles.selected]: _type.id === type?.id,
                  })}
                  onClick={() => {
                    if (type && type.id !== _type.id)
                      _type.trnsform(product, type?.id, () =>
                        mutate().then(() => onSuccess?.())
                      );
                  }}
                >
                  <P>{_type.label}</P>
                </FlexChild>
              ))}
            </HorizontalFlex>
          </FlexChild>
          <FlexChild padding={"10px 20px"}>
            <Variants
              type={type?.id}
              product={product}
              mutate={mutate}
              onSuccess={onSuccess}
            />
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);
function Variants({
  type,
  product,
  mutate,
  onSuccess,
}: {
  type?: string;
  product: ProductData;
  mutate: KeyedMutator<any>;
  onSuccess?: () => void;
}) {
  switch (type) {
    case "single":
      return (
        <Single
          variant={product.variants[0]}
          mutate={mutate}
          onSuccess={onSuccess}
        />
      );
    case "simple":
      return (
        <Simple
          product_id={product.id}
          variants={product.variants}
          mutate={mutate}
          onSuccess={onSuccess}
        />
      );
    case "multiple":
      return (
        <Multiple
          product_id={product.id}
          options={product.options}
          variants={product.variants}
          mutate={mutate}
          onSuccess={onSuccess}
        />
      );
  }
  return <></>;
}
function Single({
  variant,
  mutate,
  onSuccess,
}: {
  variant: VariantData;
  mutate: KeyedMutator<any>;
  onSuccess?: () => void;
}) {
  return (
    <VerticalFlex>
      <FlexChild>
        <HorizontalFlex>
          <FlexChild className={styles.label}>
            <P>재고량</P>
          </FlexChild>
          <FlexChild>
            <P>
              <Span>{variant.stack}</Span>
              <Span>개</Span>
            </P>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <HorizontalFlex>
          <FlexChild className={styles.label}>
            <P>판매가</P>
          </FlexChild>
          <FlexChild>
            <P>
              <Span>{variant?.price}</Span>
              <Span>{variant?.product?.store?.currency_unit}</Span>
            </P>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <HorizontalFlex>
          <FlexChild className={styles.label}>
            <P>진열상태</P>
          </FlexChild>
          <FlexChild>
            <P>{variant.visible ? "진열중" : "미진열"}</P>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <HorizontalFlex>
          <FlexChild className={styles.label}>
            <P>진열상태</P>
          </FlexChild>
          <FlexChild>
            <P>{variant.buyable ? "판매중" : "판매중단"}</P>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>

      <FlexChild paddingTop={20} justifyContent="center" gap={10}>
        <Button
          className={styles.singleEditButton}
          onClick={() =>
            NiceModal.show("variantDetail", {
              variant,
              edit: true,
              type: "single",
              onSuccess: () => {
                mutate().then(() => {
                  onSuccess?.();
                });
              },
            })
          }
        >
          <P>수정하기</P>
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}
function Simple({
  product_id,
  variants,
  mutate,
  onSuccess,
}: {
  product_id: string;
  variants: VariantData[];
  mutate: KeyedMutator<any>;
  onSuccess?: () => void;
}) {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const paginationRef = useRef<any>(null);
  useEffect(() => {
    if (swiperInstance && paginationRef.current) {
      // Swiper 인스턴스가 있고, paginationRef.current가 준비되었을 때만 실행
      swiperInstance.params.pagination.el = paginationRef.current;
      swiperInstance.pagination.init(); // 페이징 초기화
      swiperInstance.pagination.render(); // 페이징 렌더링
      swiperInstance.pagination.update(); // 페이징 업데이트
    }
  }, [swiperInstance, paginationRef.current]);
  return (
    <VerticalFlex>
      <FlexChild position="relative">
        <ReactSwiper
          spaceBetween={0}
          slidesPerView={variants?.length > 2 ? 1.8 : 2}
          loop={true}
          autoplay={{
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          onSwiper={setSwiperInstance}
          initialSlide={0}
          direction="horizontal"
          modules={[Autoplay, Pagination]}
          pagination={{
            el: paginationRef.current,
            type: "fraction",
            clickable: true,
          }}
          onBeforeInit={(swiper) => {
            const pagination: any = swiper?.params?.pagination;
            pagination.el = paginationRef.current;
          }}
        >
          {variants
            .sort((v1, v2) =>
              String(
                `${new Date(v1.created_at).getTime()} ${v1.id}`
              ).localeCompare(
                String(`${new Date(v2.created_at).getTime()} ${v2.id}`)
              )
            )
            .map((variant: VariantData) => (
              <SwiperSlide key={variant?.id}>
                <VerticalFlex>
                  <FlexChild paddingBottom={10}>
                    <Image src={variant.thumbnail} width={"30%"} />
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>옵션명</P>
                      </FlexChild>
                      <FlexChild>
                        <P fontWeight={700} fontSize={18}>
                          {variant.title}
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>재고량</P>
                      </FlexChild>
                      <FlexChild>
                        <P>
                          <Span>{variant.stack}</Span>
                          <Span>개</Span>
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>증감액</P>
                      </FlexChild>
                      <FlexChild>
                        <P>
                          <Span>{variant?.extra_price}</Span>
                          <Span>{variant?.product?.store?.currency_unit}</Span>
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>판매가</P>
                      </FlexChild>
                      <FlexChild>
                        <P>
                          <Span>{variant?.price}</Span>
                          <Span>{variant?.product?.store?.currency_unit}</Span>
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>진열상태</P>
                      </FlexChild>
                      <FlexChild>
                        <P>{variant.visible ? "진열중" : "미진열"}</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>진열상태</P>
                      </FlexChild>
                      <FlexChild>
                        <P>{variant.buyable ? "판매중" : "판매중단"}</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>

                  <FlexChild paddingTop={20} justifyContent="center" gap={10}>
                    <Button
                      className={styles.singleEditButton}
                      onClick={() =>
                        NiceModal.show("variantDetail", {
                          variant,
                          edit: true,
                          type: "simple",
                          onSuccess: () => {
                            mutate().then(() => {
                              onSuccess?.();
                            });
                          },
                        })
                      }
                    >
                      <P>수정하기</P>
                    </Button>
                    <Button
                      hidden={variants?.length === 1}
                      className={styles.singleCloseButton}
                      onClick={() =>
                        NiceModal.show("confirm", {
                          message: `${variant.title}을 삭제하시겠습니까?`,
                          confirmText: "삭제",
                          cancelText: "취소",
                          onConfirm: () => {
                            adminRequester.deleteVaraint(
                              variant.id,
                              {},
                              ({
                                message,
                                error,
                              }: {
                                error: string;
                                message: string;
                              }) => {
                                if (error) toast({ message: error });
                                else if (message)
                                  mutate().then(() => {
                                    onSuccess?.();
                                  });
                              }
                            );
                          },
                        })
                      }
                    >
                      <P>삭제하기</P>
                    </Button>
                  </FlexChild>
                </VerticalFlex>
              </SwiperSlide>
            ))}
        </ReactSwiper>
        <div ref={paginationRef} className={styles.customPagination} />
      </FlexChild>
      <Button
        styleType="admin"
        className={styles.button}
        onClick={() => {
          NiceModal.show("variantDetail", {
            variant: {
              product_id,
            },
            edit: true,
            type: "simple",
            onSuccess: () => {
              mutate().then(() => {
                onSuccess?.();
              });
            },
          });
        }}
      >
        <P>추가하기</P>
      </Button>
    </VerticalFlex>
  );
}

function Multiple({
  product_id,
  options,
  variants,
  mutate,
  onSuccess,
}: {
  product_id: string;
  options: OptionData[];
  variants: VariantData[];
  mutate: KeyedMutator<any>;
  onSuccess?: () => void;
}) {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const paginationRef = useRef<any>(null);
  useEffect(() => {
    if (swiperInstance && paginationRef.current) {
      // Swiper 인스턴스가 있고, paginationRef.current가 준비되었을 때만 실행
      swiperInstance.params.pagination.el = paginationRef.current;
      swiperInstance.pagination.init(); // 페이징 초기화
      swiperInstance.pagination.render(); // 페이징 렌더링
      swiperInstance.pagination.update(); // 페이징 업데이트
    }
  }, [swiperInstance, paginationRef.current]);
  return (
    <VerticalFlex>
      <FlexChild paddingBottom={20}>
        <VerticalFlex>
          <FlexChild className={styles.optionGroup}>
            <P>옵션 카테고리</P>
            <Button
              className={styles.add}
              styleType="admin"
              onClick={() =>
                NiceModal.show("input", {
                  message: `추가할 옵션 카테고리 정보를 입력해주세요.`,
                  input: [
                    {
                      placeHolder: "카테고리명",
                    },
                  ],
                  confirmText: "변경",
                  cancelText: "취소",
                  onConfirm: (value: string) => {
                    const _data: OptionDataFrame = {
                      title: value,
                      product_id: variants?.[0].product_id,
                    };
                    adminRequester.createOption(
                      _data,
                      ({
                        error,
                        message,
                      }: {
                        error: string;
                        message: string;
                      }) => {
                        if (error) toast({ message: error });
                        else if (message) {
                          mutate();
                        }
                      }
                    );
                  },
                })
              }
            >
              <P>카테고리 추가</P>
            </Button>
          </FlexChild>

          <FlexChild className={styles.optionGroupChildWrapper}>
            {options
              .sort((o1, o2) => o1.title.localeCompare(o2.title))
              .map((option) => (
                <FlexChild className={styles.optionGroupChild} key={option.id}>
                  <P>{option.title}</P>
                  <Image
                    src="/resources/images/editing.png"
                    size={16}
                    cursor="pointer"
                    onClick={() =>
                      NiceModal.show("input", {
                        message: `변경할 이름을 입력해주세요.`,
                        input: [
                          {
                            value: option.title,
                            placeHolder: option.title,
                          },
                        ],
                        confirmText: "변경",
                        cancelText: "취소",
                        onConfirm: (value: string) => {
                          adminRequester.updateOption(
                            option.id,
                            {
                              title: value,
                            },
                            ({
                              error,
                              message,
                            }: {
                              error: string;
                              message: string;
                            }) => {
                              if (error) toast({ message: error });
                              else if (message) {
                                mutate();
                              }
                            }
                          );
                        },
                      })
                    }
                  />
                  <Image
                    hidden={options.length <= 2}
                    src="/resources/images/closeBtn2x_2.png"
                    size={16}
                    cursor="pointer"
                    onClick={() =>
                      NiceModal.show("confirm", {
                        message: `정말로 ${option.title} 을 삭제시겠습니까?`,
                        confirmText: "삭제",
                        cancelText: "취소",
                        onConfirm: () => {
                          adminRequester.deleteOption(
                            option.id,
                            {},
                            ({
                              error,
                              message,
                            }: {
                              error: string;
                              message: string;
                            }) => {
                              if (error) toast({ message: error });
                              else if (message) {
                                mutate();
                              }
                            }
                          );
                        },
                      })
                    }
                  />
                </FlexChild>
              ))}
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      <FlexChild>
        <ReactSwiper
          spaceBetween={0}
          slidesPerView={variants?.length > 2 ? 1.8 : 2}
          loop={true}
          autoplay={{
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          onSwiper={setSwiperInstance}
          initialSlide={0}
          direction="horizontal"
          modules={[Autoplay, Pagination]}
          pagination={{
            el: paginationRef.current,
            type: "fraction",
            clickable: true,
          }}
          onBeforeInit={(swiper) => {
            const pagination: any = swiper?.params?.pagination;
            pagination.el = paginationRef.current;
          }}
        >
          {variants
            .sort((v1, v2) =>
              String(
                `${new Date(v1.created_at).getTime()} ${v1.id}`
              ).localeCompare(
                String(`${new Date(v2.created_at).getTime()} ${v2.id}`)
              )
            )
            .map((variant: VariantData) => (
              <SwiperSlide key={variant?.id}>
                <VerticalFlex>
                  <FlexChild paddingBottom={10}>
                    <Image src={variant.thumbnail} width={"30%"} />
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>옵션명</P>
                      </FlexChild>
                      <FlexChild>
                        <P fontWeight={700} fontSize={18}>
                          {variant.title}
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  {options
                    .sort((o1, o2) => o1.title.localeCompare(o2.title))
                    .map((option) => (
                      <FlexChild key={option.id}>
                        <HorizontalFlex>
                          <FlexChild className={styles.label2}>
                            <P>{option.title}</P>
                          </FlexChild>
                          <FlexChild>
                            <P fontWeight={700} fontSize={18}>
                              {variant.values.find(
                                (v) => v.option_id === option.id
                              )?.value || "default"}
                            </P>
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                    ))}
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>재고량</P>
                      </FlexChild>
                      <FlexChild>
                        <P>
                          <Span>{variant.stack}</Span>
                          <Span>개</Span>
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>증감액</P>
                      </FlexChild>
                      <FlexChild>
                        <P>
                          <Span>{variant?.extra_price}</Span>
                          <Span>{variant?.product?.store?.currency_unit}</Span>
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>판매가</P>
                      </FlexChild>
                      <FlexChild>
                        <P>
                          <Span>{variant?.price}</Span>
                          <Span>{variant?.product?.store?.currency_unit}</Span>
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>진열상태</P>
                      </FlexChild>
                      <FlexChild>
                        <P>{variant.visible ? "진열중" : "미진열"}</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  <FlexChild>
                    <HorizontalFlex>
                      <FlexChild className={styles.label}>
                        <P>진열상태</P>
                      </FlexChild>
                      <FlexChild>
                        <P>{variant.buyable ? "판매중" : "판매중단"}</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>

                  <FlexChild paddingTop={20} justifyContent="center" gap={10}>
                    <Button
                      className={styles.singleEditButton}
                      onClick={() =>
                        NiceModal.show("variantDetail", {
                          variant,
                          edit: true,
                          type: "multiple",
                          options,
                          onSuccess: () => {
                            mutate().then(() => {
                              onSuccess?.();
                            });
                          },
                        })
                      }
                    >
                      <P>수정하기</P>
                    </Button>
                    <Button
                      hidden={variants?.length === 1}
                      className={styles.singleCloseButton}
                      onClick={() =>
                        NiceModal.show("confirm", {
                          message: `${variant.title}을 삭제하시겠습니까?`,
                          confirmText: "삭제",
                          cancelText: "취소",
                          onConfirm: () => {
                            adminRequester.deleteVaraint(
                              variant.id,
                              {},
                              ({
                                message,
                                error,
                              }: {
                                error: string;
                                message: string;
                              }) => {
                                if (error) toast({ message: error });
                                else if (message)
                                  mutate().then(() => {
                                    onSuccess?.();
                                  });
                              }
                            );
                          },
                        })
                      }
                    >
                      <P>삭제하기</P>
                    </Button>
                  </FlexChild>
                </VerticalFlex>
              </SwiperSlide>
            ))}
        </ReactSwiper>
        <div ref={paginationRef} className={styles.customPagination} />
      </FlexChild>
      <Button
        styleType="admin"
        className={styles.button}
        onClick={() => {
          NiceModal.show("variantDetail", {
            variant: {
              product_id,
            },
            edit: true,
            type: "multiple",
            options,
            onSuccess: () => {
              mutate().then(() => {
                onSuccess?.();
              });
            },
          });
        }}
      >
        <P>추가하기</P>
      </Button>
    </VerticalFlex>
  );
}

export default VariantListModal;
