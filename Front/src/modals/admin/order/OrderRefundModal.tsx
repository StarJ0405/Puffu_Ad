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
import styles from "./OrderRefundModal.module.css";

const OrderRefundModal = NiceModal.create(
  ({ order, onSuccess }: { order: OrderData; onSuccess?: () => void }) => {
    const modal = useRef<any>(null);
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["730px", "75vh"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "환불 신청";
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

              <HorizontalFlex justifyContent="flex-start">
                <FlexChild
                  alignItems="stretch"
                  gap={20}
                  borderTop={"1px solid #EFEFEF"}
                  borderBottom={"1px solid #EFEFEF"}
                >
                  <FlexChild
                    width={120}
                    padding={"18px 15px"}
                    backgroundColor={"#F5F6FB"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600}>
                      총 결제금액
                    </P>
                  </FlexChild>
                  <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                    <P>
                      <Span>{order.total_final || 0}</Span>
                      <Span>원 (</Span>
                      <Span>{(order.total_final || 0) + order.point}</Span>
                      <Span>원 - </Span>
                      <Span>{order.point}</Span>

                      <Span>P)</Span>
                    </P>
                  </FlexChild>
                </FlexChild>
              </HorizontalFlex>
              <HorizontalFlex justifyContent="flex-start">
                <FlexChild
                  alignItems="stretch"
                  gap={20}
                  borderTop={"1px solid #EFEFEF"}
                  borderBottom={"1px solid #EFEFEF"}
                >
                  <FlexChild
                    width={120}
                    padding={"18px 15px"}
                    backgroundColor={"#F5F6FB"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600}>
                      환불가능 금액
                    </P>
                  </FlexChild>
                  <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                    <P hidden={!order.total_final}>
                      <Span color="green">
                        {selects?.reduce(
                          (acc, item) =>
                            acc +
                            ((item?.total_final || 0) +
                              (item?.shared_price || 0)) *
                              ((item as any).select || 0),
                          0
                        ) || 0}
                      </Span>
                      <Span>원</Span>
                    </P>
                    <P
                      padding={"0 0.5em"}
                      hidden={
                        order.point === 0 ||
                        order.point ===
                          (order.total_discounted || 0) +
                            (order.shipping_method?.amount || 0)
                      }
                    >
                      <Span> | </Span>
                    </P>
                    <P hidden={order.point === 0}>
                      <Span color="green">
                        {selects?.reduce(
                          (acc, item) =>
                            acc +
                            ((order?.point || 0) /
                              (order?.total_discounted || 0)) *
                              (item?.total_final || 0) *
                              ((item as any).select || 0),
                          0
                        ) || 0}
                      </Span>
                      <Span>P</Span>
                    </P>
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
                  disabled:
                    item.quantity -
                      (item.refunds?.reduce(
                        (acc, now) => acc + now.quantity,
                        0
                      ) || 0) -
                      (item.exchanges?.reduce(
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
                          (item.refunds?.reduce(
                            (acc, now) => acc + now.quantity,
                            0
                          ) || 0) -
                          (item.exchanges?.reduce(
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
                              (item.refunds?.reduce(
                                (acc, now) => acc + now.quantity,
                                0
                              ) || 0) -
                              (item.exchanges?.reduce(
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
                  } else
                    adminRequester.refundOrder(
                      order.id,
                      {
                        items: inputs.current
                          .filter(Boolean)
                          .map((input) => input.getValue()),
                      },
                      () => {
                        onSuccess?.();
                        modal.current?.close();
                      }
                    );
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
    const max =
      select.quantity -
      (select.refunds?.reduce((acc, now) => acc + now.quantity, 0) || 0) -
      (select.exchanges?.reduce((acc, now) => acc + now.quantity, 0) || 0);
    const [quantity, setQuantity] = useState<number>(max);
    const [memo, setMemo] = useState<string>("");
    useImperativeHandle(ref, () => ({
      getValue() {
        return { item_id: select.id, quantity, memo };
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
          <FlexChild className={styles.header}>
            <P>
              <Span display="inline-block">판매된 가격</Span>
              <Span display="inline-block" fontSize={12} fontWeight={500}>
                (프로모션 적용)
              </Span>
            </P>
          </FlexChild>
          <FlexChild className={styles.value}>
            <P>
              <Span>{select.total_final || 0}</Span>
              <Span>원</Span>
            </P>
          </FlexChild>
        </FlexChild>
        <FlexChild className={styles.row}>
          <P className={styles.header}>배송비</P>
          <P className={styles.value}>
            <Span>
              {((order.delivery_fee || 0) / order.total_discounted) *
                (select.total_final || 0) *
                quantity}
            </Span>
            <Span>원</Span>
          </P>
        </FlexChild>
        <FlexChild className={styles.row}>
          <P className={styles.header}>기타 할인</P>
          <P className={styles.value}>
            <Span>
              {((select.shared_price || 0) +
                ((order.point - (order.delivery_fee || 0)) /
                  (order.total_discounted || 0)) *
                  (select.total_final || 0)) *
                select.quantity}
            </Span>
            <Span></Span>

            <Span>원</Span>
          </P>
        </FlexChild>
        <FlexChild className={styles.row}>
          <P className={styles.header}>환불가능 금액</P>
          <P className={styles.value}>
            <Span>
              {((select?.total_final || 0) + (select.shared_price || 0)) *
                quantity}
            </Span>
            <Span>원</Span>
          </P>
        </FlexChild>
        <FlexChild className={styles.row}>
          <P className={styles.header}>환불가능 포인트</P>
          <P className={styles.value}>
            <Span>
              {(order.point / order.total_discounted) *
                (select.discount_price || 0) *
                quantity}
            </Span>
            <Span>P</Span>
          </P>
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
export default OrderRefundModal;
