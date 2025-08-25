import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Select from "@/components/select/Select";
import { requester } from "@/shared/Requester";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./OptionChangeModal.module.css";
import Span from "@/components/span/Span";

const OptionChangeModal = NiceModal.create(
  ({ item_id, product_id, onSuccess }: any) => {
    const [product, setProduct] = useState<ProductData>();
    const title = "";
    const [withHeader, withFooter] = [false, false];
    const buttonText = "close";
    const clickOutsideToClose = true;
    const modal = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      requester
        .getProduct(product_id, {
          relations: ["options.values", "variants", "variants.values"],
        })
        .then(({ content }) => setProduct(content));
    }, []);
    const [variant, setVariant] = useState<String>();
    const onChange = () => {
      setIsLoading(true);
      requester.changeItem(
        item_id,
        {
          variant_id: variant,
        },
        ({ message, error }: { message: string; error: string }) => {
          if (error) {
            toast({ message: error });
            setIsLoading(false);
          }
          if (message) {
            if (onSuccess) {
              onSuccess?.()?.then(() => {
                modal.current.close();
              });
            } else {
              modal.current.close();
            }
          }
        }
      );
    };
    return (
      <ModalBase
        zIndex={10055}
        ref={modal}
        width={"min(100%, 100dvh)"}
        height={"auto"}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={false}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
        borderRadius={"16px 16px 0 0"}
        slideUp={true}
      >
        <FlexChild
          padding={"50px 24px 24px 24px"}
          height={"100%"}
          position="relative"
        >
          <Div className={styles.bar} />
          <VerticalFlex gap={20} hideScrollbar height={"100%"} flexStart>
            <Varaints product={product} setVariant={setVariant} />

            <FlexChild position="sticky" bottom={0}>
              <HorizontalFlex justifyContent={"center"}>
                <FlexChild height={48} padding={3}>
                  <Button
                    className={styles.cancel}
                    onClick={() => modal.current.close()}
                    isLoading={isLoading}
                  >
                    <P
                      size={16}
                      textAlign="center"
                      color={"var(--admin-text-color)"}
                    >
                      취소
                    </P>
                  </Button>
                </FlexChild>
                <FlexChild height={48} padding={3}>
                  <Button
                    className={styles.button}
                    onClick={onChange}
                    isLoading={isLoading}
                    disabled={!variant}
                  >
                    <P size={16} textAlign="center" color={"#ffffff"}>
                      변경하기
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
  setVariant,
}: {
  product?: ProductData;
  setVariant: Dispatch<SetStateAction<String | undefined>>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [openOption, setOpenOption] = useState<string | null>(null);
  if (product) {
    if (product?.options?.length > 0) {
      // 멀티 옵션
      return (
        <FlexChild alignItems="flex-start">
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
                options={option.values
                  .filter((_f) => {
                    const _selected = selected.slice(0, index);
                    if (_selected.length === 0) return true;
                    const variants = product.variants.filter(
                      (f) =>
                        _selected.every((s) =>
                          f.values.some((ov) => ov.id === s)
                        ) && f.values.some((f) => f.id === _f.id)
                    );
                    return variants.length > 0;
                  })
                  .map((value) => {
                    return {
                      display: value.value,
                      value: value.id,
                    };
                  })}
                onChange={(value) => {
                  const _selected = selected.slice(0, index);
                  _selected[index] = String(value);

                  if (_selected.length === product.options.length) {
                    const variant = product.variants.find((f) =>
                      _selected.every((s) => f.values.some((ov) => ov.id === s))
                    );
                    if (variant) setVariant(variant.id);
                  }
                  setSelected(_selected);
                }}
              />
            ))}
          </VerticalFlex>
        </FlexChild>
      );
    }
    if (product.variants.length > 0) {
      // 단순 옵션
      return (
        <FlexChild alignItems="flex-start">
          <Select
            inside
            classNames={{
              placeholder: styles.selectPlaceholder,
              line: styles.selectLine,
              arrow: styles.selectArrow,
              header: styles.selectHeader,
            }}
            width="100%"
            options={product.variants.map((variant) => ({
              display: variant.title,
              value: variant.id,
            }))}
            onChange={(value) => setVariant(value as string)}
          />
        </FlexChild>
      );
    }
  }

  return <></>;
}

export default OptionChangeModal;
