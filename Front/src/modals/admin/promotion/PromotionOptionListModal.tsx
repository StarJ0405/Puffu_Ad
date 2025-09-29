import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Tooltip from "@/components/tooltip/Tooltip";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./PromotionOptionListModal.module.css";

const PromotionOptionListModal = NiceModal.create(
  ({
    promotion: initPromotion,
    onSuccess,
  }: {
    promotion: any;
    onSuccess?: () => void;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "프로모션 규칙 리스트";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [rule, setRule] = useState<any>();
    const { promotion, mutate } = useData(
      "promotion",
      {
        relations: [
          "discounts.products.product",
          "discounts.variants.variant.product",
          "bundles.products.product",
          "bundles.variants.variant.product",
        ],
      },
      (condition) => adminRequester.getPromotion(initPromotion.id, condition),
      {
        onReprocessing: (data) => data?.content,
        fallbackData: {
          content: initPromotion,
        },
      }
    );
    useEffect(() => {
      if (!promotion) {
        modal.current.close();
      }
    }, [promotion]);

    useEffect(() => {
      if (rule) {
        const discount = promotion.discounts.find((f: any) => f.id === rule.id);
        if (discount) setRule(discount);
        else {
          const bundle = promotion.bundles.find((f: any) => f.id === rule.id);
          if (bundle) setRule(bundle);
          else {
            setRule(promotion.discounts?.[0] || promotion?.bundles?.[0]);
          }
        }
      } else {
        setRule(promotion.discounts?.[0] || promotion?.bundles?.[0]);
      }
    }, [promotion]);
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
                  NiceModal.show("promotionOption", {
                    rule: {
                      event_id: promotion.id,
                    },
                    store_id: promotion.store_id,
                    onSuccess: () => {
                      onSuccess?.();
                      mutate();
                    },
                  });
                }}
              >
                추가
              </P>

              {promotion.discounts.map((discount: any, index: number) => (
                <FlexChild
                  key={`${discount.id}_${index}`}
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
                        message: `${discount.name}을 삭제하시겠습니까?`,
                        confirmText: "삭제",
                        cancelText: "취소",
                        onConfirm: () =>
                          adminRequester.deletePromotionDiscount(
                            promotion.id,
                            discount.id,
                            {},
                            () => {
                              onSuccess?.();
                              mutate();
                            }
                          ),
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
                      [styles.selected]: discount?.id === rule?.id,
                    })}
                    onClick={() => setRule(discount)}
                  >
                    {discount.name}
                  </P>
                </FlexChild>
              ))}
              {promotion.bundles.map((bundle: any, index: number) => (
                <FlexChild
                  key={`${bundle.id}_${index}`}
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
                        message: `${bundle.name}을 삭제하시겠습니까?`,
                        confirmText: "삭제",
                        cancelText: "취소",
                        onConfirm: () =>
                          adminRequester.deletePromotionBundle(
                            promotion.id,
                            bundle.id,
                            {},
                            () => {
                              onSuccess?.();
                              mutate();
                            }
                          ),
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
                      [styles.selected]: bundle?.id === rule?.id,
                    })}
                    onClick={() => setRule(bundle)}
                  >
                    {bundle.name}
                  </P>
                </FlexChild>
              ))}
            </HorizontalFlex>
          </FlexChild>
          <FlexChild marginTop={10}>
            {rule &&
              (rule?.value ? (
                <VerticalFlex>
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
                        <FlexChild gap={12} width={"max-content"}>
                          <P>할인</P>
                        </FlexChild>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
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
                      <FlexChild>
                        <P>
                          <Span>{rule.value}</Span>
                          <Span>%</Span>
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
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
                        <VerticalFlex
                          gap={10}
                          height={"100%"}
                          justifyContent="center"
                        >
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
                              content={"해당 상품의 모든 옵션에 적용됩니다."}
                            >
                              <Image
                                src="/resources/images/question.png"
                                size={14}
                              />
                            </Tooltip>
                          </FlexChild>
                        </VerticalFlex>
                      </FlexChild>
                      <FlexChild
                        paddingRight={15}
                        flexWrap="wrap"
                        gap={20}
                        alignItems="flex-start"
                      >
                        {rule.products.map((product: any, index: number) => (
                          <FlexChild
                            key={`${product.id}_${index}`}
                            className={styles.closeWrapper}
                          >
                            <VerticalFlex>
                              <Image
                                src={product?.product?.thumbnail}
                                size={200}
                              />
                              <P>{product?.product?.title}</P>
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
                        <VerticalFlex
                          gap={10}
                          height={"100%"}
                          justifyContent="center"
                        >
                          <FlexChild
                            justifyContent="center"
                            gap={4}
                            alignItems="flex-start"
                          >
                            <P size={16} weight={600}>
                              적용옵션
                            </P>
                            <Tooltip content={"해당 옵션에'만' 적용됩니다."}>
                              <Image
                                src="/resources/images/question.png"
                                size={14}
                              />
                            </Tooltip>
                          </FlexChild>
                        </VerticalFlex>
                      </FlexChild>
                      <FlexChild
                        paddingRight={15}
                        flexWrap="wrap"
                        gap={20}
                        alignItems="flex-start"
                      >
                        {rule.variants.map((variant: any, index: number) => (
                          <FlexChild
                            key={`${variant.id}_${index}`}
                            className={styles.closeWrapper}
                          >
                            <VerticalFlex>
                              <Image
                                src={
                                  variant?.variant.thumbnail ||
                                  variant?.variant?.product?.thumbnail
                                }
                                size={200}
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
                </VerticalFlex>
              ) : (
                <VerticalFlex>
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
                        <FlexChild gap={12} width={"max-content"}>
                          <P>N+M</P>
                        </FlexChild>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
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
                          증정 기준
                        </P>
                      </FlexChild>
                      <FlexChild>
                        <P>
                          {rule?.N} + {rule?.M}
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
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
                        <VerticalFlex
                          gap={10}
                          height={"100%"}
                          justifyContent="center"
                        >
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
                                "해당 상품은 교차 선택으로 N + M이 적용됩니다."
                              }
                            >
                              <Image
                                src="/resources/images/question.png"
                                size={14}
                              />
                            </Tooltip>
                          </FlexChild>
                        </VerticalFlex>
                      </FlexChild>
                      <FlexChild
                        paddingRight={15}
                        flexWrap="wrap"
                        gap={20}
                        alignItems="flex-start"
                      >
                        {rule.products.map((product: any, index: number) => (
                          <FlexChild
                            key={`${product.id}_${index}`}
                            className={styles.closeWrapper}
                          >
                            <VerticalFlex>
                              <Image
                                src={product?.product?.thumbnail}
                                size={200}
                              />
                              <P>{product?.product?.title}</P>
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
                        <VerticalFlex
                          gap={10}
                          height={"100%"}
                          justifyContent="center"
                        >
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
                                "해당 옵션은 비교차 선택으로 N + M이 적용됩니다."
                              }
                            >
                              <Image
                                src="/resources/images/question.png"
                                size={14}
                              />
                            </Tooltip>
                          </FlexChild>
                        </VerticalFlex>
                      </FlexChild>
                      <FlexChild
                        paddingRight={15}
                        flexWrap="wrap"
                        gap={20}
                        alignItems="flex-start"
                      >
                        {rule.variants.map((variant: any, index: number) => (
                          <FlexChild
                            key={`${variant.id}_${index}`}
                            className={styles.closeWrapper}
                          >
                            <VerticalFlex>
                              <Image
                                src={
                                  variant?.variant.thumbnail ||
                                  variant?.variant?.product?.thumbnail
                                }
                                size={200}
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
                </VerticalFlex>
              ))}
          </FlexChild>
          <FlexChild
            justifyContent="center"
            gap={5}
            position="sticky"
            bottom={0}
            marginTop={10}
          >
            {rule && (
              <Button
                styleType="admin"
                padding={"12px 20px"}
                fontSize={18}
                onClick={() =>
                  NiceModal.show("promotionOption", {
                    rule,
                    store_id: promotion.store_id,
                    onSuccess: () => {
                      onSuccess?.();
                      mutate();
                    },
                  })
                }
              >
                편집
              </Button>
            )}
            <Button
              styleType="white"
              padding={"12px 20px"}
              fontSize={18}
              onClick={() => modal.current.close()}
            >
              닫기
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default PromotionOptionListModal;
