import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import ModalBase from "@/modals/ModalBase";
import { adminRequester } from "@/shared/AdminRequester";
import { copy, openTrackingNumber, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./ExchangeDetailModal.module.css";

const ExchangeDetailModal = NiceModal.create(
  ({
    exchange,
    edit = false,
    onSuccess,
  }: {
    exchange: ExchangeData;
    edit?: boolean;
    onSuccess?: () => void;
  }) => {
    const modal = useRef<any>(null);
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["730px", "75vh"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "교환 " + (edit ? "편집" : "상세");
    const inputs = useRef<any[]>([]);
    const [selects, setSelects] = useState<ExchangeItemData[]>(
      exchange?.items || []
    );
    const swiperRef = useRef<SwiperType | null>(null);
    const [tracking, setTracking] = useState<string>(
      exchange.tracking_number || ""
    );
    const paintBullets = (swiper: SwiperType) => {
      // 페이지네이션 스타일 설정
      const bullets = swiper.pagination?.el?.querySelectorAll(
        ".swiper-pagination-bullet"
      );
      if (!bullets) return;

      bullets.forEach((el) => {
        const bullet = el as HTMLElement;
        bullet.style.setProperty("background-color", "#000", "important");
        bullet.style.setProperty("opacity", "0.3", "important");
        bullet.style.setProperty("transform", "scale(1)");
        bullet.style.setProperty("margin", "0 4px", "important");
        bullet.style.setProperty("left", "0", "important");
        bullet.style.setProperty("top", "2px", "important");
      });

      const active = swiper.pagination?.el?.querySelector(
        ".swiper-pagination-bullet-active"
      ) as HTMLElement | null;
      if (active) {
        active.style.setProperty("opacity", "1", "important");
        active.style.setProperty(
          "background-color",
          "var(--admin-color)",
          "important"
        );
        active.style.setProperty("transform", "scale(1.66)");
      }
    };

    return (
      <ModalBase
        borderRadius={"10px"}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={withCloseButton}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        closeBtnWhite={true}
      >
        <div
          style={{
            overflowY: "auto",
            padding: "20px 13px",
            height: "100%",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            display: "flex",
            flexGrow: 1,
          }}
        >
          <VerticalFlex gap={10}>
            <VerticalFlex>
              <HorizontalFlex
                justifyContent="flex-start"
                gap={20}
                borderBottom={"1px solid #EFEFEF"}
              >
                <FlexChild
                  width={120}
                  padding={"18px 15px"}
                  backgroundColor={"#F5F6FB"}
                  justifyContent={"center"}
                >
                  <P size={16} weight={600}>
                    주문번호
                  </P>
                </FlexChild>
                <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                  <P
                    cursor="pointer"
                    textHover
                    onClick={() =>
                      copy({
                        text: exchange?.order?.display || "",
                        message: "주문번호를 복사했습니다",
                      })
                    }
                  >
                    {exchange?.order?.display}
                  </P>
                </FlexChild>
              </HorizontalFlex>
              <HorizontalFlex justifyContent="flex-start">
                <FlexChild gap={20} borderBottom={"1px solid #EFEFEF"}>
                  <FlexChild
                    width={120}
                    padding={"18px 15px"}
                    backgroundColor={"#F5F6FB"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600}>
                      주문자
                    </P>
                  </FlexChild>
                  <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                    <P>{exchange?.order?.user?.name}</P>
                  </FlexChild>
                </FlexChild>
              </HorizontalFlex>
              <HorizontalFlex justifyContent="flex-start">
                <FlexChild
                  gap={20}
                  borderBottom={"1px solid #EFEFEF"}
                  alignItems="stretch"
                >
                  <FlexChild
                    width={120}
                    padding={"18px 15px"}
                    backgroundColor={"#F5F6FB"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600}>
                      운송장번호
                    </P>
                  </FlexChild>
                  <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                    {edit ? (
                      <Input
                        style={{
                          width: 300,
                          fontWeight: 600,
                          fontSize: 20,
                          padding: "1px 4px",
                        }}
                        placeHolder="운송장번호"
                        value={tracking}
                        onChange={(value) => setTracking(value as string)}
                      />
                    ) : (
                      <P
                        cursor={tracking ? "pointer" : undefined}
                        onClick={() => tracking && openTrackingNumber(tracking)}
                      >
                        {tracking || "없음"}
                      </P>
                    )}
                  </FlexChild>
                </FlexChild>
              </HorizontalFlex>
              <FlexChild
                marginTop={20}
                width={"100%"}
                padding={"18px 15px"}
                backgroundColor={"#383e58"}
                justifyContent={"center"}
              >
                <P size={16} color={"#ffffff"} weight={600}>
                  상품
                </P>
              </FlexChild>
              {edit && (
                <Select
                  minHeight={62}
                  multiple
                  zIndex={10080}
                  classNames={{
                    line: styles.select_row,
                  }}
                  value={selects.map((rl) => rl.item_id)}
                  onChange={(value) => {
                    const items: ExchangeItemData[] = (value as string[]).map(
                      (v) => {
                        let item: any = exchange.items?.find(
                          (f) => f.item_id === v
                        );
                        if (item) return item;
                        item = exchange.order?.items.find((i) => i.id === v);

                        return {
                          item_id: item.id,
                          item,
                          quantity: item.total_quantity,
                        } as ExchangeItemData;
                      }
                    );
                    if (items) {
                      setSelects(items);
                      document.getElementById("quantity")?.focus();
                    }
                  }}
                  width={"100%"}
                  options={
                    exchange?.order?.items.map((item) => ({
                      disabled:
                        item.quantity -
                          (item.exchanges
                            ?.filter((f) => f.exchange_id !== exchange.id)
                            ?.reduce((acc, now) => acc + now.quantity, 0) ||
                            0) -
                          (item.refunds?.reduce(
                            (acc, now) => acc + now.quantity,
                            0
                          ) || 0) <=
                        0,
                      display: (
                        <HorizontalFlex
                          key={item.id}
                          color="#111"
                          textDecorationLine={
                            item.quantity -
                              (item.exchanges
                                ?.filter((f) => f.exchange_id !== exchange.id)
                                ?.reduce((acc, now) => acc + now.quantity, 0) ||
                                0) -
                              (item.refunds?.reduce(
                                (acc, now) => acc + now.quantity,
                                0
                              ) || 0) <=
                            0
                              ? "line-through"
                              : undefined
                          }
                        >
                          <FlexChild gap={10}>
                            <Image src={item.thumbnail} size={40} />
                            <P>{item.title}</P>
                          </FlexChild>
                          <FlexChild width={"max-content"}>
                            <P>
                              <Span>X </Span>
                              <Span>
                                {item.quantity -
                                  (item.exchanges
                                    ?.filter(
                                      (f) => f.exchange_id !== exchange.id
                                    )
                                    ?.reduce(
                                      (acc, now) => acc + now.quantity,
                                      0
                                    ) || 0) -
                                  (item.refunds?.reduce(
                                    (acc, now) => acc + now.quantity,
                                    0
                                  ) || 0)}
                              </Span>
                              <Span>
                                {item.extra_quantity
                                  ? ` + ${item.extra_quantity}`
                                  : ""}
                              </Span>
                            </P>
                          </FlexChild>
                        </HorizontalFlex>
                      ),
                      value: item.id,
                    })) || []
                  }
                />
              )}
            </VerticalFlex>

            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              modules={[Pagination]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              onAfterInit={(swiper) => {
                // Pagination DOM이 생성된 뒤
                paintBullets(swiper);
              }}
              onSlideChange={(swiper) => {
                // active bullet이 바뀔 때마다
                paintBullets(swiper);
              }}
              onPaginationUpdate={(swiper) => {
                // dynamicBullets로 bullet 구성이 바뀌는 경우
                paintBullets(swiper);
              }}
            >
              {selects?.map((item, index) => (
                <SwiperSlide key={item?.id}>
                  <Item
                    ref={(el) => {
                      inputs.current[index] = el;
                    }}
                    item={item}
                    exchange={exchange}
                    edit={edit}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {edit ? (
              <FlexChild gap={20} position="sticky" bottom={0} padding={20}>
                <Button
                  className={styles.cancel_button}
                  onClick={() => modal.current.close()}
                >
                  취소
                </Button>
                <Button
                  className={styles.confirm_button}
                  onClick={() => {
                    const items = inputs.current
                      .filter(Boolean)
                      .map((input) => input.getValue());
                    if (items.length === 0)
                      return toast({
                        message: "최소 1개이상의 상품을 교환해야합니다.",
                      });
                    if (items.some((item) => item.swaps?.length === 0))
                      return toast({
                        message: "교환할 상품이 선택되지 않았습니다.",
                      });
                    adminRequester.updateExchange(
                      exchange.id,
                      {
                        items,
                        tracking_number: tracking,
                      },
                      () => {
                        onSuccess?.();
                        modal.current.close();
                      }
                    );
                  }}
                >
                  편집
                </Button>
              </FlexChild>
            ) : (
              <FlexChild gap={20} position="sticky" bottom={0} padding={20}>
                <Button
                  hidden={!!exchange.deleted_at || !!exchange.completed_at}
                  className={styles.confirm_button}
                  onClick={() =>
                    NiceModal.show("confirm", {
                      message: (
                        <VerticalFlex>
                          <P>교환 신청을 철회하시겠습니까?</P>
                          <P>
                            수정이 필요한 경우 반드시 [편집 기능]을 이용해주세요
                          </P>
                        </VerticalFlex>
                      ),
                      confirmText: "철회",
                      cancelText: "그만두기",
                      onConfirm: () =>
                        adminRequester.cancelExchange(exchange.id, {}, () => {
                          onSuccess?.();
                          modal.current.close();
                        }),
                    })
                  }
                >
                  철회
                </Button>
                <Button
                  hidden={exchange.completed_at}
                  className={styles.cancel_button}
                  onClick={() =>
                    NiceModal.show("confirm", {
                      message: "강제로 완료처리하시겠습니까?",
                      cancelText: "취소",
                      confirmText: "완료 처리",
                      onConfirm: () =>
                        adminRequester.updateExchange(
                          exchange.id,
                          {
                            completed_at: new Date(),
                          },
                          (response: any) => {
                            if (response.message) {
                              onSuccess?.();
                              modal.current.close();
                            }
                          }
                        ),
                    })
                  }
                >
                  수동 교환 완료
                </Button>
              </FlexChild>
            )}
          </VerticalFlex>
        </div>
      </ModalBase>
    );
  }
);

const Item = forwardRef(
  (
    {
      item,
      exchange,
      edit,
    }: { item: ExchangeItemData; exchange: ExchangeData; edit: boolean },
    ref
  ) => {
    const max =
      (item.item?.quantity || 0) -
      (item.item?.exchanges?.reduce((acc, now) => acc + now.quantity, 0) || 0);
    const [quantity, setQuantity] = useState<number>(item.quantity);
    const [memo, setMemo] = useState<string>(item.memo || "");
    const swapRef = useRef<any[]>([]);
    const [swaps, setSwaps] = useState<SwapItemData[]>(item.swaps || []);
    useImperativeHandle(ref, () => ({
      getValue() {
        const _item = {
          ...item,
          quantity,
          memo,
          swaps: swapRef.current.filter(Boolean).map((swap) => swap.getValue()),
        };
        delete _item.item;

        return _item;
      },
    }));
    return (
      <VerticalFlex marginTop={20} className={styles.content_wrapper}>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header}>
            <P>상품명</P>
          </FlexChild>
          <FlexChild className={styles.value}>
            <P>{item?.item?.title}</P>
          </FlexChild>
        </FlexChild>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header}>
            <P>
              <Span>수량</Span>
              <Span fontWeight={500} fontSize={12}>
                (증정 미포함)
              </Span>
            </P>
          </FlexChild>
          {edit ? (
            <FlexChild>
              <InputNumber
                id="quantity"
                min={1}
                width={300}
                max={max}
                hideArrow
                style={{
                  fontWeight: 600,
                  fontSize: 20,
                }}
                value={quantity}
                onChange={(quantity) => setQuantity(quantity)}
              />
            </FlexChild>
          ) : (
            <FlexChild className={styles.value}>
              <P>{quantity}</P>
            </FlexChild>
          )}
        </FlexChild>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header} gap={5}>
            <P>교환상품</P>
            <Button
              hidden={!edit}
              className={styles.plus_button}
              onClick={() =>
                NiceModal.show("table", {
                  overflow: "auto",
                  name: "variant",
                  indexing: false,
                  slideUp: false,
                  width: "730px",
                  height: "75vh",
                  scrollbarWidth: "none",
                  initCondition: {
                    relations: [
                      "product.store",
                      "product.discounts.discount",
                      "discounts.discount",
                    ],
                  },
                  columns: [
                    {
                      label: " ",
                      code: "thumbnail",
                      Cell: ({ cell, row }: any) => (
                        <Image src={cell || row.product.thumbnail} size={100} />
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
                    {
                      label: "상품명",
                      code: "title",
                      Cell: ({ row, cell }: any) => (
                        <P whiteSpace="wrap">
                          {row.product.title + (cell ? ` (${cell})` : "")}
                        </P>
                      ),
                    },
                    {
                      label: "판매가",
                      code: "discount_price",
                      styling: {
                        common: {
                          style: {
                            width: 100,
                            minWidth: 100,
                          },
                        },
                      },
                    },
                    {
                      label: "재고",
                      code: "stack",
                      styling: {
                        common: {
                          style: {
                            width: 80,
                            minWidth: 80,
                          },
                        },
                      },
                    },
                  ],
                  limit: 6,
                  selectable: true,
                  search: true,
                  onMaxPage: (data: Pageable) => data?.totalPages || 0,
                  onReprocessing: (data: any) => data?.content || [],
                  onSelect: (data: any) =>
                    setSwaps([
                      ...swaps,
                      ...data
                        .filter(
                          (f: VariantData) =>
                            f.stack > 0 &&
                            !swaps.some((swap) => swap.variant_id === f.id)
                        )
                        .map((v: VariantData) => ({
                          id: new Date().getTime() + "_" + v.id,
                          variant_id: v.id,
                          variant: v,
                          brand_id: v.product.brand_id,
                          product_title: v.product.title,
                          variant_title: v.title,
                          title: `${v.product.title}${
                            v.title ? ` ${v.title}` : ""
                          }`,
                          description: v.product.description,
                          thumbnail: v.thumbnail || v.product.thumbnail,
                          unit_price: v.price,
                          tax_rate: v.product.tax_rate,
                          discount_price: v.discount_price,
                          currency_unit: v.product.store?.currency_unit,
                        })),
                    ]),
                  onSearch: (condition: any) =>
                    adminRequester.getVariants(condition),
                })
              }
            >
              +
            </Button>
          </FlexChild>
          <FlexChild>
            {swaps.length === 0 ? (
              <P className={styles.value}>없음</P>
            ) : (
              <VerticalFlex>
                {swaps.map((swap, index) => (
                  <SwapItem
                    edit={edit}
                    key={swap.id}
                    swap={swap}
                    ref={(el) => {
                      swapRef.current[index] = el;
                    }}
                    handleDelete={() =>
                      setSwaps(swaps.filter((f) => f.id !== swap.id))
                    }
                  />
                ))}
              </VerticalFlex>
            )}
          </FlexChild>
        </FlexChild>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header}>
            <P>메모</P>
          </FlexChild>
          {edit ? (
            <FlexChild>
              <Input
                style={{
                  width: 300,
                  fontWeight: 600,
                  fontSize: 20,
                  padding: "1px 4px",
                }}
                value={memo}
                onChange={(value) => setMemo(value as string)}
                placeHolder="관리자용으로 메모할 내용을 작성해주세요"
              />
            </FlexChild>
          ) : (
            <FlexChild className={styles.value}>
              <P>{memo || "없음"}</P>
            </FlexChild>
          )}
        </FlexChild>
      </VerticalFlex>
    );
  }
);

const SwapItem = forwardRef(
  (
    {
      swap,
      handleDelete,
      edit,
    }: { swap: SwapItemData; handleDelete: () => void; edit: boolean },
    ref
  ) => {
    const [quantity, setQuantity] = useState<number>(swap.quantity);
    useImperativeHandle(ref, () => ({
      getValue() {
        const data: any = {
          variant_id: swap.variant_id,
          brand_id: swap.brand_id,
          quantity,
          product_title: swap.product_title,
          variant_title: swap.variant_title,
          description: swap.description,
          thumbnail: swap.thumbnail,
          unit_price: swap.unit_price,
          tax_rate: swap.tax_rate,
          discount_price: swap.discount_price,
          currency_unit: swap.currency_unit,
        };
        if (swap.id && !swap.id.includes(`_${swap.variant_id}`))
          data.id = swap.id;
        return data;
      },
    }));
    return (
      <FlexChild key={swap.id} className={styles.item}>
        <HorizontalFlex gap={5}>
          <FlexChild gap={5}>
            <Image src={swap.thumbnail} size={50} />
            <P>{swap.title}</P>
          </FlexChild>
          <FlexChild width={"max-content"}>
            {edit ? (
              <InputNumber
                hideArrow
                min={1}
                max={swap.variant.stack}
                value={quantity}
                onChange={(value) => setQuantity(value)}
              />
            ) : (
              <P padding={10}>{quantity}개</P>
            )}
          </FlexChild>
          <FlexChild width={"max-content"} hidden={!edit}>
            <Button className={styles.button} onClick={handleDelete}>
              삭제
            </Button>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    );
  }
);
export default ExchangeDetailModal;
