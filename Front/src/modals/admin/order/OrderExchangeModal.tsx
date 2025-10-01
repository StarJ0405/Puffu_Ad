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
import { copy, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./OrderExchangeModal.module.css";

const OrderExchangeModal = NiceModal.create(
  ({ order, onSuccess }: { order: OrderData; onSuccess?: () => void }) => {
    const modal = useRef<any>(null);
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["730px", "75vh"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "교환 신청";
    const [selects, setSelects] = useState<LineItemData[]>([]);
    const inputs = useRef<any[]>([]);
    const swiperRef = useRef<SwiperType | null>(null);

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
            <VerticalFlex flexGrow={0} marginBottom={0}>
              <HorizontalFlex>
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
                          text: order?.display,
                          message: "주문번호를 복사했습니다",
                        })
                      }
                    >
                      {order?.display}
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
                      <P>{order?.user?.name}</P>
                    </FlexChild>
                  </FlexChild>
                </HorizontalFlex>
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
              <Select
                minHeight={62}
                multiple
                zIndex={10080}
                classNames={{
                  line: styles.select_row,
                }}
                onChange={(value) => {
                  const items = order.items.filter((f) =>
                    (value as string[]).some((v) => v === f.id)
                  );
                  if (items) {
                    setSelects(items);
                    document.getElementById("quantity")?.focus();
                  }
                }}
                width={"100%"}
                options={order.items.map((item) => ({
                  disabled: item.quantity <= 0,
                  display: (
                    <HorizontalFlex
                      key={item.id}
                      color="#111"
                      textDecorationLine={
                        item.quantity <= 0 ? "line-through" : undefined
                      }
                    >
                      <FlexChild gap={10}>
                        <Image src={item.thumbnail} size={40} />
                        <P>{item.title}</P>
                      </FlexChild>
                      <FlexChild width={"max-content"}>
                        <P>
                          <Span>X </Span>
                          <Span>{item.quantity}</Span>
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
                }))}
              />
            </VerticalFlex>
            {selects?.length > 0 ? (
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
                {selects.map((select, index) => (
                  <SwiperSlide key={select?.id}>
                    <Item
                      ref={(el) => {
                        inputs.current[index] = el;
                      }}
                      order={order}
                      select={select}
                      handleUpdate={(quantity) => {
                        (select as any).select = quantity;
                        selects[index] = select;
                        setSelects([...selects]);
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <VerticalFlex
                marginTop={20}
                className={styles.emtpy_wrapper}
                justifyContent="center"
              >
                <P>상품을 선택해주세요</P>
              </VerticalFlex>
            )}
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
                  if (selects.length === 0) {
                    return toast({
                      message: "최소 1개 이상의 상품을 선택해주세요",
                    });
                  } else {
                    const items = inputs.current
                      .filter(Boolean)
                      .map((input) => input.getValue());
                    if (items.some((item) => item.swaps?.length === 0))
                      return toast({
                        message: "교환상품을 선택하지않은 목록이 있습니다.",
                      });
                    adminRequester.exchangeOrder(
                      order.id,
                      {
                        items,
                      },
                      () => {
                        onSuccess?.();
                        modal.current?.close();
                      }
                    );
                  }
                }}
              >
                신청
              </Button>
            </FlexChild>
          </VerticalFlex>
        </div>
      </ModalBase>
    );
  }
);

const Item = forwardRef(
  (
    {
      select,
      order,
      handleUpdate,
    }: {
      select: LineItemData;
      order: OrderData;
      handleUpdate: (quantity: number) => void;
    },
    ref
  ) => {
    const swapRef = useRef<any[]>([]);
    const max = select.quantity;
    const [swaps, setSwaps] = useState<VariantData[]>([]);
    const [quantity, setQuantity] = useState<number>(max);
    const [memo, setMemo] = useState<string>("");
    useImperativeHandle(ref, () => ({
      getValue() {
        return {
          item_id: select.id,
          quantity,
          memo,
          swaps: swapRef.current.filter(Boolean).map((swap) => swap.getValue()),
        };
      },
    }));
    useEffect(() => {
      handleUpdate(quantity);
    }, [quantity]);
    return (
      <VerticalFlex marginTop={20} className={styles.content_wrapper}>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header}>
            <P>상품명</P>
          </FlexChild>
          <FlexChild className={styles.value}>
            <P>{select.title}</P>
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
        </FlexChild>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header} gap={5}>
            <P>교환상품</P>
            <Button
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
                  onSelect: (data: any) => setSwaps([...swaps, ...data]),
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
              <P>없음</P>
            ) : (
              <VerticalFlex>
                {swaps.map((swap, index) => (
                  <SwapItem
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
        </FlexChild>
      </VerticalFlex>
    );
  }
);
const SwapItem = forwardRef(
  (
    { swap, handleDelete }: { swap: VariantData; handleDelete: () => void },
    ref
  ) => {
    const [quantity, setQuantity] = useState<number>(1);
    useImperativeHandle(ref, () => ({
      getValue() {
        return { varaint_id: swap.id, quantity };
      },
    }));
    return (
      <FlexChild key={swap.id} className={styles.item}>
        <HorizontalFlex gap={5}>
          <FlexChild gap={5}>
            <Image src={swap.thumbnail || swap.product.thumbnail} size={50} />
            <P>
              {swap.product.title}
              {swap.title ? ` (${swap.title})` : ""}
            </P>
          </FlexChild>
          <FlexChild width={"max-content"}>
            <InputNumber
              hideArrow
              min={1}
              max={swap.stack}
              value={quantity}
              onChange={(value) => setQuantity(value)}
            />
          </FlexChild>
          <FlexChild width={"max-content"}>
            <Button className={styles.button} onClick={handleDelete}>
              삭제
            </Button>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
    );
  }
);
export default OrderExchangeModal;
