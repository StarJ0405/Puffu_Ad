import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import InputNumber from "@/components/inputs/InputNumber";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import {
  useCart,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import { requester } from "@/shared/Requester";
import useNavigate from "@/shared/hooks/useNavigate";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./PurchaseModal.module.css";

interface UpdateProps {
  key: string;
  value: ((value: any) => any) | any;
}
const PurchaseModal = NiceModal.create(
  ({ product, width = "min(100%, 100dvh)", height = "auto" }: any) => {
    const { storeData } = useStore();
    const { reload } = useCart();
    const title = "";
    const [withHeader, withFooter] = [false, false];
    const buttonText = "close";
    const clickOutsideToClose = true;
    const modal = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dataRef = useRef<any[]>([]);
    const handleUpdate = (
      index: number,
      data: UpdateProps | UpdateProps[] | boolean
    ) => {
      if (typeof data === "boolean") {
        const _data = [
          ...dataRef.current.slice(0, index),
          ...dataRef.current.slice(index + 1, 0),
        ];
        dataRef.current = _data;
      } else {
        const _data = dataRef.current[index] || {};
        (Array.isArray(data) ? data : [data]).forEach((d) => {
          if (typeof d.value === "function") {
            _data[d.key] = d.value(_data[d.key]);
          } else _data[d.key] = d.value;
        });
        dataRef.current[index] = _data;
      }
      return dataRef.current;
    };
    const onPurchaseClick = async () => {
      if (isLoading) return;
      setIsLoading(true);
      if (dataRef.current.length === 0) {
        setIsLoading(false);
        return NiceModal.show("confirm", {
          message: "상품을 최소 1개 이상 담아야합니다.",
          confirmText: "확인",
        });
      }
      requester.addItem(
        {
          store_id: storeData?.id,
          variants: dataRef.current,
        },
        ({ message, error }: { message: string; error: string }) => {
          if (message) {
            reload().then(() => {
              modal.current.close();
              navigate("/cart");
            });
          } else {
            toast({ message: error });
            setIsLoading(false);
          }
        }
      );
    };

    const onCartClick = async () => {
      if (isLoading) return;
      setIsLoading(true);
      if (dataRef.current.length === 0) {
        setIsLoading(false);
        return NiceModal.show("confirm", {
          message: "상품을 최소 1개 이상 담아야합니다.",
          confirmText: "확인",
        });
      }
      requester.addItem(
        {
          store_id: storeData?.id,
          variants: dataRef.current,
        },
        ({ message, error }: { message: string; error: string }) => {
          if (message) {
            reload().then(() => {
              modal.current.close();
              NiceModal.show("toast", {
                message: (
                  <FlexChild justifyContent="center" gap={10}>
                    <Image src="/resources/icons/check_black.png" size={22} />
                    <P>장바구니에 상품을 담았어요</P>
                  </FlexChild>
                ),
                withCloseButton: false,
                className: styles.toastClass,
              });
            });
          } else {
            toast({ message: error });
            setIsLoading(false);
          }
        }
      );
    };

    return (
      <ModalBase
        zIndex={10055}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={false}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
        borderRadius={6}
        slideUp={true}
      >
        <FlexChild
          padding={"50px 24px 24px 24px"}
          height={"100%"}
          position="relative"
        >
          <VerticalFlex
            gap={20}
            maxHeight="calc(min(60dvh) - 48px)"
            height="calc(min(60dvh) - 48px)"
            overflowY="scroll"
            hideScrollbar
          >
            <FlexChild height={"100%"} alignItems="flex-start">
              <Varaints
                product={product}
                storeData={storeData}
                handleUpdate={handleUpdate}
              />
            </FlexChild>
            <FlexChild position="sticky" bottom={0}>
              <HorizontalFlex justifyContent={"center"}>
                <FlexChild height={48} padding={3}>
                  <Button
                    className={clsx(
                      styles.confirmButton,
                      styles.main,
                      styles.white
                    )}
                    onClick={onCartClick}
                    isLoading={isLoading}
                  >
                    <P
                      size={16}
                      textAlign="center"
                      color={"var(--admin-text-color)"}
                    >
                      장바구니
                    </P>
                  </Button>
                </FlexChild>
                <FlexChild height={48} padding={3}>
                  <Button
                    className={clsx(styles.confirmButton, styles.main)}
                    onClick={onPurchaseClick}
                    isLoading={isLoading}
                  >
                    <P size={16} textAlign="center" color={"#ffffff"}>
                      구매하기
                    </P>
                  </Button>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      </ModalBase>
    );
  }
);

function Varaints({
  product,
  storeData,
  handleUpdate,
}: {
  product: ProductData;
  storeData?: StoreData | null;
  handleUpdate: (
    index: number,
    data: UpdateProps | UpdateProps[] | boolean
  ) => any[];
}) {
  if (product.options?.length > 0) {
    // 멀티옵션
    return (
      <Multiple
        product={product}
        storeData={storeData}
        handleUpdate={handleUpdate}
      />
    );
  }

  if (product.variants?.length === 1) {
    // 단일옵션
    return (
      <SingleOption
        storeData={storeData}
        product={product}
        variant={product.variants[0]}
        handleUpdate={handleUpdate}
      />
    );
  } else {
    // 단순옵션
    return (
      <SimpleOption
        product={product}
        storeData={storeData}
        handleUpdate={handleUpdate}
      />
    );
  }
  return <></>;
}

function SingleOption({
  storeData,
  product,
  variant,
  handleUpdate,
}: {
  quantity?: number;
  storeData?: StoreData | null;
  product: ProductData;
  variant: VariantData;
  handleUpdate: (
    index: number,
    data: UpdateProps | UpdateProps[] | boolean
  ) => any[];
}) {
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    handleUpdate(0, [
      {
        key: "variant_id",
        value: variant.id,
      },
      {
        key: "quantity",
        value: 1,
      },
    ]);
  }, []);
  return (
    <FlexChild className={styles.noOptionWrapper}>
      <VerticalFlex>
        <FlexChild paddingBottom={12}>
          <P className={styles.noOptionTitle}>{product.title}</P>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex height={"max-content"}>
            <FlexChild>
              <InputNumber
                min={1}
                value={quantity}
                onChange={(value) => {
                  handleUpdate(0, {
                    key: "quantity",
                    value: value,
                  });
                  setQuantity(value);
                }}
              />
            </FlexChild>
            <FlexChild width={"max-content"}>
              <VerticalFlex justifyContent="flex-end" height={41}>
                <FlexChild justifyContent="flex-end">
                  <P
                    className={styles.price}
                    hidden={variant.discount_price === variant.price}
                  >
                    <Span>{variant.price * quantity}</Span>
                    <Span>{storeData?.currency_unit}</Span>
                  </P>
                </FlexChild>
                <FlexChild>
                  <P className={styles.discountPrice}>
                    <Span>{variant.discount_price * quantity}</Span>
                    <Span>{storeData?.currency_unit}</Span>
                  </P>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
}

function OptionCard({
  index,
  quantity: init_quantity = 1,
  storeData,
  variant,
  handleUpdate,
  handleRemove,
}: {
  index: number;
  quantity?: number;
  storeData?: StoreData | null;
  variant: VariantData;
  handleUpdate: (
    index: number,
    data: UpdateProps | UpdateProps[] | boolean
  ) => any[];
  handleRemove: (id: string) => void;
}) {
  const [quantity, setQuantity] = useState(init_quantity);
  useEffect(() => {
    setQuantity(init_quantity);
  }, [init_quantity]);
  useEffect(() => {
    handleUpdate(index, [
      {
        key: "variant_id",
        value: variant.id,
      },
      {
        key: "quantity",
        value: "1",
      },
    ]);
  }, []);
  return (
    <FlexChild className={styles.noOptionWrapper}>
      <P
        className={styles.closeWrapper}
        onClick={() => handleRemove(variant.id)}
      >
        <Image src="/resources/icons/closeBtn.png" size={12} />
      </P>
      <VerticalFlex>
        <FlexChild paddingBottom={12}>
          <P className={styles.noOptionTitle}>{variant.title}</P>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex height={"max-content"}>
            <FlexChild>
              <InputNumber
                id={variant.id}
                min={1}
                value={quantity}
                onChange={(value) => {
                  handleUpdate(index, {
                    key: "quantity",
                    value: String(quantity),
                  });
                  setQuantity(value);
                }}
              />
            </FlexChild>
            <FlexChild width={"max-content"}>
              <VerticalFlex justifyContent="flex-end" height={41}>
                <FlexChild justifyContent="flex-end">
                  <P
                    className={styles.price}
                    hidden={variant.discount_price === variant.price}
                  >
                    <Span>{variant.price * quantity}</Span>
                    <Span>{storeData?.currency_unit}</Span>
                  </P>
                </FlexChild>
                <FlexChild>
                  <P className={styles.discountPrice}>
                    <Span>{variant.discount_price * quantity}</Span>
                    <Span>{storeData?.currency_unit}</Span>
                  </P>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
}
function SimpleOption({
  storeData,
  product,
  handleUpdate,
}: {
  storeData?: StoreData | null;
  product: ProductData;
  handleUpdate: (
    index: number,
    data: UpdateProps | UpdateProps[] | boolean
  ) => any[];
}) {
  const [list, setList] = useState<string[]>([]);
  const handleRemove = (id: string) => {
    const index = list.findIndex((f) => f === id);
    if (index > -1) {
      handleUpdate(index, false);
      setList(list.filter((f) => f !== id));
    }
  };
  const [reset, setReset] = useState([]);
  return (
    <VerticalFlex>
      <FlexChild paddingBottom={16}>
        <Select
          width={"100%"}
          inside
          classNames={{
            placeholder: styles.selectPlaceholder,
            line: styles.selectLine,
            arrow: styles.selectArrow,
            header: styles.selectHeader,
          }}
          options={product.variants.map((variant) => ({
            display: variant.buyable ? (
              variant.stack > 0 ? (
                <FlexChild justifyContent="space-between">
                  <P className={styles.selectOption}>{variant.title}</P>
                  <P className={styles.selectOption}>
                    <Span>{variant.discount_price}</Span>
                    <Span>{storeData?.currency_unit}</Span>
                  </P>
                </FlexChild>
              ) : (
                <FlexChild justifyContent="space-between">
                  <P
                    className={clsx(styles.selectOption, styles.disabled)}
                    textDecorationLine="line-through"
                  >
                    {variant.title}
                  </P>
                  <P className={clsx(styles.selectOption, styles.disabled)}>
                    재고부족
                  </P>
                </FlexChild>
              )
            ) : (
              <FlexChild justifyContent="space-between">
                <P
                  className={clsx(styles.selectOption, styles.disabled)}
                  textDecorationLine="line-through"
                >
                  {variant.title}
                </P>
                <P className={clsx(styles.selectOption, styles.disabled)}>
                  구매불가
                </P>
              </FlexChild>
            ),
            value: variant.id,
            disabled: variant.stack === 0 || !variant.buyable,
          }))}
          value={reset}
          placeholder="종류 선택"
          onChange={(value) => {
            if (list.includes(String(value))) {
              document.getElementById(`${value}_right`)?.click();
            } else {
              setList([...list, String(value)]);
            }
            setReset([]);
          }}
        />
      </FlexChild>
      <FlexChild>
        <VerticalFlex gap={10}>
          {list.map((l, index) => {
            const variant = product.variants.find((f) => f.id === l);
            if (!variant) return <></>;
            return (
              <OptionCard
                key={variant.id}
                index={index}
                handleUpdate={handleUpdate}
                storeData={storeData}
                variant={variant}
                handleRemove={handleRemove}
              />
            );
          })}
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
function Multiple({
  storeData,
  product,
  handleUpdate,
}: {
  storeData?: StoreData | null;
  product: ProductData;
  handleUpdate: (
    index: number,
    data: UpdateProps | UpdateProps[] | boolean
  ) => any[];
}) {
  const [list, setList] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const handleRemove = (id: string) => {
    const index = list.findIndex((f) => f === id);
    if (index > -1) {
      handleUpdate(index, false);
      setList(list.filter((f) => f !== id));
    }
  };
  const [openOption, setOpenOption] = useState<string | null>(null);
  return (
    <VerticalFlex>
      <FlexChild paddingBottom={16}>
        <VerticalFlex gap={16}>
          {product.options.map((option, index) => (
            <Select
              key={option.id}
              inside
              classNames={{
                placeholder: styles.selectPlaceholder,
                line: styles.selectLine,
                arrow: styles.selectArrow,
                header: styles.selectHeader,
              }}
              width={"100%"}
              placeholder={`${option.title} 선택`}
              value={[selected?.[index]]}
              disabled={selected.length < index}
              isOpen={openOption === option.id}
              onOpenChange={(isOpen) => {
                if (isOpen) setOpenOption(option.id);
                else if (openOption === option.id) setOpenOption(null);
              }}
              onClick={({ disabled }) => {
                if (disabled)
                  NiceModal.show("toast", {
                    message: (
                      <FlexChild justifyContent="center" gap={10}>
                        <P>상위 옵션을 선택해주세요</P>
                      </FlexChild>
                    ),
                    autoClose: 350,
                    withCloseButton: false,
                    className: styles.toastClass,
                  });
              }}
              options={Array.from(
                new Set(
                  option.values
                    .filter((_f) => {
                      const _selected = selected.slice(0, index);
                      if (_selected.length === 0) return true;
                      const variants = product.variants.filter(
                        (f) =>
                          _selected.every((s) =>
                            f.values.some((ov) => ov.value === s)
                          ) && f.values.some((f) => f.value === _f.value)
                      );
                      return variants.length > 0;
                    })
                    .map((ov) => ov.value)
                )
              ).map((value) => {
                if (index === product.options.length - 1) {
                  const _selected = [...selected, value];
                  const variant = product.variants.find((f) =>
                    _selected.every((s) =>
                      f.values.some((ov) => ov.value === s)
                    )
                  );
                  return {
                    display: variant?.buyable ? (
                      variant.stack > 0 ? (
                        <FlexChild justifyContent="space-between">
                          <P className={styles.selectOption}>{value}</P>
                          <P className={styles.selectOption}>
                            <Span>{variant?.discount_price}</Span>
                            <Span>{storeData?.currency_unit}</Span>
                          </P>
                        </FlexChild>
                      ) : (
                        <FlexChild justifyContent="space-between">
                          <P
                            className={clsx(
                              styles.selectOption,
                              styles.disabled
                            )}
                            textDecorationLine="line-through"
                          >
                            {variant?.title}
                          </P>
                          <P
                            className={clsx(
                              styles.selectOption,
                              styles.disabled
                            )}
                          >
                            재고부족
                          </P>
                        </FlexChild>
                      )
                    ) : (
                      <FlexChild justifyContent="space-between">
                        <P
                          className={clsx(styles.selectOption, styles.disabled)}
                          textDecorationLine="line-through"
                        >
                          {variant?.title}
                        </P>
                        <P
                          className={clsx(styles.selectOption, styles.disabled)}
                        >
                          구매불가
                        </P>
                      </FlexChild>
                    ),
                    value: value,
                    disabled: variant?.stack === 0 || !variant?.buyable,
                  };
                }
                return {
                  display: value,
                  value: value,
                };
              })}
              onChange={(value) => {
                const _selected = selected.slice(0, index);
                _selected[index] = String(value);

                if (_selected.length === product.options.length) {
                  const variant = product.variants.find((f) =>
                    _selected.every((s) => f.values.some((ov) => ov.id === s))
                  );
                  if (variant)
                    if (list.includes(variant.id)) {
                      document.getElementById(`${variant.id}_right`)?.click();
                    } else setList([...list, variant.id]);
                  setSelected([]);
                } else setSelected(_selected);
              }}
            />
          ))}
        </VerticalFlex>
      </FlexChild>
      <FlexChild>
        <VerticalFlex gap={10}>
          {list.map((l, index) => {
            const variant = product.variants.find((f) => f.id === l);
            if (!variant) return <></>;
            return (
              <OptionCard
                key={variant.id}
                index={index}
                handleUpdate={handleUpdate}
                storeData={storeData}
                variant={variant}
                handleRemove={handleRemove}
              />
            );
          })}
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
export default PurchaseModal;
