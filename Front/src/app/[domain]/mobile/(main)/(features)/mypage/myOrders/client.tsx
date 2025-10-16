"use client";
import Button from "@/components/buttons/Button";
import DatePicker from "@/components/date-picker/DatePicker";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import useData from "@/shared/hooks/data/useData";
import { requester } from "@/shared/Requester";
import { getOrderStatus, openTrackingNumber } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useState } from "react";
import styles from "./page.module.css";
import { AnimatePresence, motion } from "framer-motion";

type OrderItem = {
  id: string | number;
  product_title?: string;
  variant_title?: string;
  total_quantity?: number;
  total_discount?: number;
  total_tax?: number;
  currency_unit?: string;
  thumbnail?: string;
  review?: any;
  variant?: {
    product_id?: string | number;
    stack?: number;
    buyable?: boolean;
    product?: { buyable?: boolean };
  };
};

export function MyOrdersTable({
  initEndDate,
  initStartDate,
  initOrders,
}: {
  initStartDate: Date;
  initEndDate: Date;
  initOrders: any;
}) {
  const [q, setQ] = useState("");
  const [condition, setCondition] = useState<any>({});
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);
  const [activePeriod, setActivePeriod] = useState("1week");
  const [reviewedSet, setReviewedSet] = useState<Set<string>>(new Set());
  const { orders, mutate } = useData(
    "orders",
    {
      ...condition,
      relations: [
        "refunds.items",
        "items.refunds.refund",
        "items.exchanges.exchange",
        "items.exchanges.swaps",
        "items.brand",
        "items.review",
        "shipping_method.coupons",
        "store",
        "address",
        "coupons",
        "items.coupons",
      ],
      start_date: startDate,
      end_date: endDate,
    },
    (condition) => requester.getOrders(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initOrders,
    }
  );

  const isReviewed = (it: OrderItem) =>
    Boolean(it?.review != null || reviewedSet.has(String(it?.id)));

  const handlePeriodChange = (period: string) => {
    const newStartDate = new Date();
    const newEndDate = new Date();
    setActivePeriod(period);
    setQ("");
    setCondition({});

    switch (period) {
      case "1week":
        newStartDate.setDate(newEndDate.getDate() - 7);
        break;
      case "1month":
        newStartDate.setMonth(newEndDate.getMonth() - 1);
        break;
      case "3months":
        newStartDate.setMonth(newEndDate.getMonth() - 3);
        break;
      case "6months":
        newStartDate.setMonth(newEndDate.getMonth() - 6);
        break;
      default:
        break;
    }
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleDateChange = (
    dates: Date | [Date | null, Date | null] | null
  ) => {
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      if (start && end) {
        setStartDate(start);
        setEndDate(end);
        setActivePeriod("");
      }
    }
  };

  const handleSearch = () => {
    if (q) setCondition({ q });
    else setCondition({});
  };

  const [refundCheck, setRefundCheck] = useState<{ [key: string]: boolean }>(
    {}
  );

  return (
    <>
      <VerticalFlex className={styles.search_box}>
        <VerticalFlex className={styles.search_input_box}>
          <h5>상품 검색</h5>
          <FlexChild className={styles.keyword}>
            <Input
              className={clsx("web_input", styles.search)}
              width={"100%"}
              type="search"
              placeHolder="상품 키워드를 입력하세요"
              value={q}
              onChange={(value) => setQ(value as string)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button backgroundColor="transparent" onClick={handleSearch}>
              <Image
                src="/resources/images/header/input_search_icon.png"
                width={18}
                height="auto"
                cursor="pointer"
              />
            </Button>
          </FlexChild>
        </VerticalFlex>

        <VerticalFlex className={styles.picker_input_box}>
          <VerticalFlex className={styles.dataPicker_box}>
            <FlexChild className={styles.btn_wrap}>
              <Button
                className={clsx(styles.term_btn, {
                  [styles.active]: activePeriod === "1week",
                })}
                onClick={() => handlePeriodChange("1week")}
              >
                1주일
              </Button>
              <Button
                className={clsx(styles.term_btn, {
                  [styles.active]: activePeriod === "1month",
                })}
                onClick={() => handlePeriodChange("1month")}
              >
                1개월
              </Button>
              <Button
                className={clsx(styles.term_btn, {
                  [styles.active]: activePeriod === "3months",
                })}
                onClick={() => handlePeriodChange("3months")}
              >
                3개월
              </Button>
              <Button
                className={clsx(styles.term_btn, {
                  [styles.active]: activePeriod === "6months",
                })}
                onClick={() => handlePeriodChange("6months")}
              >
                6개월
              </Button>
            </FlexChild>

            <FlexChild className={styles.picker_wrap}>
              <div className={styles.datePickerWrapper}>
                <DatePicker
                  selectionMode="range"
                  values={[startDate, endDate]}
                  onChange={handleDateChange}
                />
              </div>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>
      <VerticalFlex gap={20}>
        {orders.length > 0 ? (
          orders.map((order: OrderData) => (
            <VerticalFlex key={order.id} className={styles.order_group}>
              <FlexChild className={styles.order_header}>
                <VerticalFlex className={styles.order_top_info}>
                  <FlexChild gap={7}>
                    <P size={15} weight={500}>
                      {new Date(order.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      <Span color="var(--main-color1)">
                        [{getOrderStatus(order)}]
                      </Span>
                    </P>
                  </FlexChild>
                  <FlexChild className={styles.order_code}>
                    <P>
                      <Span>주문번호 : </Span>
                      <Span>{order.display}</Span>
                    </P>
                  </FlexChild>
                </VerticalFlex>
                {order.status === "pending" && (
                  <Button
                    // className={styles.tracking_btn}
                    className={styles.order_detail_btn}
                    onClick={() =>
                      NiceModal.show("confirm", {
                        message: "주문을 취소하시겠습니까?",
                        confirmText: "진행하기",
                        cancelText: "그만두기",
                        onConfirm: () =>
                          requester.cancelOrder(order.id, {}, () => mutate()),
                      })
                    }
                  >
                    주문취소
                  </Button>
                )}
                {(order.status === "shipping" || order.status === "complete") &&
                  order.shipping_method?.tracking_number && (
                    <Button
                      // className={styles.tracking_btn}
                      className={styles.order_detail_btn}
                      onClick={() =>
                        openTrackingNumber(
                          order.shipping_method?.tracking_number as any
                        )
                      }
                    >
                      배송조회
                    </Button>
                  )}
              </FlexChild>

              <VerticalFlex className={styles.order_items_container}>
                {order.items.map((item: LineItemData) => {
                  const isChecked = refundCheck[item.id] || false;

                  return (
                    <VerticalFlex
                      key={item.id}
                      className={styles.list_item}
                      gap={15}
                    >
                      {/* 상품 단위 */}
                      <HorizontalFlex className={styles.unit}>
                        <Image
                          src={item.thumbnail}
                          width={66}
                          borderRadius={5}
                        />
                        <VerticalFlex
                          className={styles.unit_content}
                          width={"auto"}
                          alignItems="start"
                        >
                          <FlexChild gap={5}>
                            <Span
                              hidden={!item.exchanges?.length}
                              size={15}
                              widows={500}
                              color="var(--main-color1)"
                            >
                              [
                              {item.refunds?.filter(
                                (f) => !f.refund?.completed_at
                              ).length
                                ? "교환 처리중"
                                : "교환 완료"}
                              ]
                            </Span>
                            <Span
                              hidden={!item.refunds?.length}
                              size={15}
                              widows={500}
                              color="var(--main-color1)"
                            >
                              [
                              {item.refunds?.filter(
                                (f) => !f.refund?.completed_at
                              ).length
                                ? "환불 처리중"
                                : "환불 완료"}
                              ]
                            </Span>
                            <Span className={styles.unit_brand}>
                              {item?.brand?.name}
                            </Span>
                            <Image
                              src={"/resources/icons/cart/cj_icon.png"}
                              width={13}
                            />
                          </FlexChild>

                          <P
                            className={styles.unit_title}
                            lineClamp={2}
                            overflow="hidden"
                            display="--webkit-box"
                          >
                            {item.product_title}
                          </P>
                          {item.variant_title && (
                            <P
                              className={styles.unit_variant}
                              lineClamp={1}
                              overflow="hidden"
                              display="--webkit-box"
                            >
                              - {item.variant_title}
                            </P>
                          )}

                          <P
                            className={styles.unit_price}
                            lineClamp={2}
                            overflow="hidden"
                            display="--webkit-box"
                          >
                            <Span>{item.total_quantity}</Span>
                            <Span>개 / </Span>
                            <Span>{item.unit_price}</Span>
                            <Span>원</Span>
                          </P>
                        </VerticalFlex>
                      </HorizontalFlex>
                      {/* isReviewed */}
                      {order.status === "complete" && (
                        <FlexChild gap={6}>
                          <FlexChild
                            justifyContent="center"
                            hidden={
                              item.confirmation ||
                              !order.shipping_method?.shipped_at ||
                              !!item.refunds?.length ||
                              !!item.exchanges?.length
                            }
                          >
                            <Button
                              width={"100%"}
                              className={clsx(
                                styles.order_detail_btn,
                                styles.review_btn
                              )}
                              onClick={() => {
                                if (order.shipping_method?.shipped_at) {
                                  const shipped_at = new Date(
                                    order.shipping_method?.shipped_at
                                  );
                                  const date = new Date();
                                  date.setDate(date.getDate() - 3);
                                  if (shipped_at.getTime() <= date.getTime()) {
                                    NiceModal.show("confirm", {
                                      message: (
                                        <VerticalFlex>
                                          <P>
                                            구매 확정시 교환/환불이
                                            불가능합니다.
                                          </P>
                                          <P>진행하시겠습니까?</P>
                                        </VerticalFlex>
                                      ),
                                      confirmText: "진행",
                                      cancelText: "취소",
                                      onConfirm: () =>
                                        requester.confirmItem(
                                          order.id,
                                          item.id,
                                          {},
                                          () => mutate()
                                        ),
                                    });
                                  } else {
                                    NiceModal.show("confirm", {
                                      message:
                                        "배송완료일 기준으로 3일 후부터 구매를 확정할 수 있습니다.",
                                      confirmText: "확인",
                                    });
                                  }
                                }
                              }}
                            >
                              구매확정
                            </Button>
                          </FlexChild>
                          <FlexChild
                            justifyContent="center"
                            hidden={
                              !item.confirmation ||
                              item.quantity -
                                (item.refunds?.reduce(
                                  (acc, now) => acc + now.quantity,
                                  0
                                ) || 0) -
                                (item.exchanges?.reduce(
                                  (acc, now) => acc + now.quantity,
                                  0
                                ) || 0) ===
                                0
                            }
                          >
                            {!isReviewed(item) ? (
                              <Button
                                width={"100%"}
                                className={clsx(
                                  styles.order_detail_btn,
                                  styles.review_btn
                                )}
                                onClick={() => {
                                  const i = item;
                                  NiceModal.show("reviewWrite", {
                                    item: {
                                      id: i.id,
                                      brand_name: i?.brand?.name,
                                      product_title: i.product_title,
                                      variant_title: i.variant_title,
                                      thumbnail: i.thumbnail,
                                      discount_price: i?.discount_price,
                                      unit_price: i?.unit_price,
                                    },
                                    edit: true,
                                    withPCButton: false,
                                    width: "100vw",
                                    height: "100dvh",
                                    onSuccess: () => mutate(),
                                  });
                                }}
                              >
                                리뷰 작성
                              </Button>
                            ) : (
                              <P size={14} color="#eee">
                                리뷰 작성 완료
                              </P>
                            )}
                          </FlexChild>

                          <FlexChild justifyContent="center">
                            <Button
                              className={styles.order_detail_btn}
                              width={"100%"}
                              onClick={() =>
                                document.getElementById("side_chat")?.click()
                              }
                            >
                              교환/환불 문의
                            </Button>

                            {/* 교환 환불 처리되면 이걸로 출력 */}
                            <P hidden size={14} color="#eee">
                              교환 완료 | 환불 완료
                            </P>
                          </FlexChild>
                        </FlexChild>
                      )}

                      {/* 가격 박스 */}
                      <HorizontalFlex className={styles.item_price_box}>
                        <FlexChild>
                          <P>할인금액 : </P>
                          <P>
                            <Span>
                              {(item.total_final || 0) -
                                (item.unit_price || 0) * item.quantity}
                            </Span>
                            <Span>원</Span>
                          </P>
                        </FlexChild>

                        <FlexChild>
                          <P>결제 금액 : </P>
                          <P>
                            <Span color="var(--main-color1)" weight={600}>
                              {(item.total_final || 0) * item.quantity}
                            </Span>
                            <Span color="var(--main-color1)" weight={600}>
                              원
                            </Span>
                          </P>
                        </FlexChild>
                      </HorizontalFlex>

                      <FlexChild hidden={!item.refunds?.length}>
                        <Button
                          className={styles.refunds_btn}
                          onClick={() =>
                            setRefundCheck((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id], // item.id별 토글
                            }))
                          }
                        >
                          {isChecked ? "닫기" : "환불 상세"}
                        </Button>
                      </FlexChild>

                      <AnimatePresence mode="wait">
                        {isChecked && (
                          <motion.div
                            // key={refund}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FlexChild
                              className={styles.refunds_wrap}
                              hidden={!item.refunds?.length}
                            >
                              <VerticalFlex
                                className={styles.refunds_box}
                                gap={20}
                              >
                                <HorizontalFlex className={styles.item}>
                                  <VerticalFlex className={styles.refund_unit}>
                                    <P>환불 후 남은 개수 </P>
                                    <Span>
                                      {item.quantity -
                                        (item.refunds
                                          ?.filter(
                                            (f) => f.refund?.completed_at
                                          )
                                          ?.reduce(
                                            (acc, now) => acc + now.quantity,
                                            0
                                          ) || 0)}
                                    </Span>
                                  </VerticalFlex>
                                  <VerticalFlex className={styles.refund_unit}>
                                    <P>환불중인 개수 </P>
                                    <Span>
                                      {item.refunds
                                        ?.filter((f) => !f.refund?.completed_at)
                                        ?.reduce(
                                          (acc, now) => acc + now.quantity,
                                          0
                                        ) || 0}
                                    </Span>
                                  </VerticalFlex>
                                </HorizontalFlex>

                                <HorizontalFlex className={styles.item} hidden>
                                  <VerticalFlex className={styles.refund_unit}>
                                    <P>할인 금액 </P>
                                    <Span>
                                      {(
                                        ((item.discount_price || 0) -
                                          (item.unit_price || 0)) *
                                        (item.quantity -
                                          (item.refunds
                                            ?.filter(
                                              (f) => f.refund?.completed_at
                                            )
                                            ?.reduce(
                                              (acc, now) => acc + now.quantity,
                                              0
                                            ) || 0))
                                      ).toLocaleString("ko-KR")}
                                      원
                                    </Span>
                                  </VerticalFlex>
                                  <VerticalFlex className={styles.refund_unit}>
                                    <P>결제 금액 </P>
                                    <Span>
                                      {(
                                        (item.discount_price || 0) *
                                        (item.quantity -
                                          (item.refunds
                                            ?.filter(
                                              (f) => f.refund?.completed_at
                                            )
                                            ?.reduce(
                                              (acc, now) => acc + now.quantity,
                                              0
                                            ) || 0))
                                      ).toLocaleString("ko-KR")}
                                      원
                                    </Span>
                                  </VerticalFlex>
                                </HorizontalFlex>
                              </VerticalFlex>
                            </FlexChild>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </VerticalFlex>
                  );
                })}
              </VerticalFlex>

              <VerticalFlex className={styles.order_summary}>
                <HorizontalFlex className={styles.summary_row}>
                  <P>배송비</P>
                  <P>
                    <Span>{order.delivery_fee || 0}</Span>
                    <Span> 원</Span>
                  </P>
                </HorizontalFlex>
                <HorizontalFlex className={styles.summary_row}>
                  <P>총 상품금액</P>
                  <P>
                    <Span>{order.total}</Span>
                    <Span> 원</Span>
                  </P>
                </HorizontalFlex>
                <HorizontalFlex className={styles.summary_row}>
                  <P>총 할인금액</P>
                  <P>
                    <Span>{(order.total_final || 0) - order.total}</Span>
                    <Span> 원</Span>
                  </P>
                </HorizontalFlex>
                <HorizontalFlex
                  className={styles.summary_row}
                  hidden={!order.point}
                >
                  <P>사용포인트</P>
                  <P>
                    <Span>{-order.point}</Span>
                    <Span> P</Span>
                  </P>
                </HorizontalFlex>
                <HorizontalFlex className={styles.summary_row}>
                  <P>총 결제금액</P>
                  <P color="var(--main-color1)" weight={600}>
                    <Span size={16}>{order.total_final}</Span>
                    <Span size={16}> 원</Span>
                  </P>
                </HorizontalFlex>
              </VerticalFlex>
            </VerticalFlex>
          ))
        ) : (
          <NoContent type="주문 내역" />
        )}
      </VerticalFlex>
    </>
  );
}
