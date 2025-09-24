"use client";
import Button from "@/components/buttons/Button";
import DatePicker from "@/components/date-picker/DatePicker";
import Dummy from "@/components/dummy/Dummy";
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

export function MyOrdersTable({
  initEndDate,
  initStartDate,
  initOrders,
}: {
  initStartDate: Date;
  initEndDate: Date;
  initOrders: any;
}) {
  // const [orders, setOrders] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);
  const [condition, setCondition] = useState<any>({});
  const [activePeriod, setActivePeriod] = useState("1week");
  const { orders, mutate } = useData(
    "orders",
    {
      ...condition,
      relations: ["items.brand","items.review", "shipping_methods", "store", "address"],
      start_date: startDate,
      end_date: endDate,
    },
    (condition) => requester.getOrders(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initOrders,
    }
  );
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

  return (
    <>
      <HorizontalFlex className={styles.search_box}>
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
            <h5>기간 선택</h5>
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
      </HorizontalFlex>
      <VerticalFlex gap={30}>
        {orders.length > 0 ? (
          orders.map((order: OrderData) => (
            <VerticalFlex key={order.id} className={styles.order_group}>
              <FlexChild className={styles.order_header}>
                <P size={15} weight={500} padding={"0 10px 0 0"}>
                  {new Date(order.created_at).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <Span color="var(--main-color1)" padding={"0 0 0 4px"}>
                    [{getOrderStatus(order)}]
                  </Span>
                </P>
                {order.status === "pending" && (
                  <Button
                    className={styles.tracking_btn}
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
                  order?.shipping_methods?.[0]?.tracking_number && (
                    <Button
                      className={styles.tracking_btn}
                      onClick={() =>
                        openTrackingNumber(
                          order?.shipping_methods?.[0]?.tracking_number as any
                        )
                      }
                    >
                      배송조회
                    </Button>
                  )}
              </FlexChild>

              <VerticalFlex className={styles.order_items_container}>
                <HorizontalFlex backgroundColor={"#323232"} padding={"12px 0"}>
                  <FlexChild width={"70%"} justifyContent={"center"}>
                    <P color={"#cfcfcf"}>상품정보</P>
                  </FlexChild>
                  <FlexChild width={"15%"} justifyContent={"center"}>
                    <P color={"#cfcfcf"}>할인금액</P>
                  </FlexChild>
                  <FlexChild width={"15%"} justifyContent={"center"}>
                    <P color={"#cfcfcf"}>결제금액</P>
                  </FlexChild>
                </HorizontalFlex>
                <Dummy height={15} />
                {order.items.map((item: LineItemData) => (
                  <HorizontalFlex
                    key={item.id}
                    className={styles.list_item}
                    gap={15}
                    padding={"0 0 15px 0"}
                  >
                    {/* 상품 단위 */}
                    <HorizontalFlex className={styles.unit}>
                      <Image src={item.thumbnail} width={80} borderRadius={5} />
                      <VerticalFlex
                        className={styles.unit_content}
                        width={"auto"}
                        alignItems="start"
                        padding={"0 0 0 10px"}
                        gap={10}
                      >
                        <FlexChild gap={5}>
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
                        <P
                          className={styles.unit_title}
                          lineClamp={1}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          {item.variant_title}
                        </P>

                        <P
                          className={styles.unit_title}
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
                      {order.status === "complete" && (
                        <FlexChild width={"max-content"}>
                          <VerticalFlex gap={6}>
                            <Button
                              onClick={() => {
                                console.log(item);
                                const i = item;
                                NiceModal.show("reviewWrite", {
                                  item: {
                                    id: i.id,
                                    brand_name: i?.brand?.name,
                                    product_title: i.product_title,
                                    variant_title: i.variant_title,
                                    thumbnail: i.thumbnail,
                                  },
                                  edit: true,
                                  withPCButton: true,
                                  onSuccess: () => mutate(),
                                });
                              }}
                            >
                              리뷰 작성
                            </Button>
                            <Button
                              onClick={() =>
                                document.getElementById("side_chat")?.click()
                              }
                            >
                              교환/환불 문의
                            </Button>
                          </VerticalFlex>
                        </FlexChild>
                      )}
                    </HorizontalFlex>

                    {/* 가격 박스 */}
                    <HorizontalFlex
                      width={"30%"}
                      className={styles.item_price_box}
                      paddingBottom={30}
                    >
                      <FlexChild justifyContent={"center"}>
                        <P>
                          <Span>
                            {((item.discount_price || 0) -
                              (item.unit_price || 0)) *
                              item.quantity}
                          </Span>
                          <Span>원</Span>
                        </P>
                      </FlexChild>

                      <FlexChild justifyContent={"center"}>
                        <P
                          color="var(--main-color1)"
                          weight={600}
                          fontSize={18}
                        >
                          <Span>
                            {(item.discount_price || 0) * item.quantity}
                          </Span>
                          <Span>원</Span>
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </HorizontalFlex>
                ))}
              </VerticalFlex>

              <VerticalFlex className={styles.order_summary}>
                <HorizontalFlex className={styles.summary_row}>
                  <P>배송비</P>
                  {order.shipping_methods?.[0].amount === 0 ? (
                    <P>무료</P>
                  ) : (
                    <P>
                      <Span>+</Span>
                      <Span>{order.shipping_methods?.[0].amount}</Span>
                      <Span>원</Span>
                    </P>
                  )}
                </HorizontalFlex>
                <HorizontalFlex className={styles.summary_row}>
                  <P>총 상품금액</P>
                  <P>
                    <Span>{order.total}</Span>
                    <Span>원</Span>
                  </P>
                </HorizontalFlex>
                <HorizontalFlex className={styles.summary_row}>
                  <P>총 할인금액</P>
                  <P>
                    <Span>{order.total_discounted - order.total}</Span>
                    <Span>원</Span>
                  </P>
                </HorizontalFlex>
                <HorizontalFlex
                  className={styles.summary_row}
                  hidden={!order.point}
                >
                  <P>사용포인트</P>
                  <P>
                    <Span>-{order.point}</Span>
                    <Span>P</Span>
                  </P>
                </HorizontalFlex>
                <HorizontalFlex className={styles.summary_row}>
                  <P>총 결제금액</P>
                  <P color="var(--main-color1)" weight={600} fontSize={20}>
                    <Span>
                      {order.total_discounted +
                        (order.shipping_methods?.[0].amount || 0) -
                        order.point}
                    </Span>
                    <Span>원</Span>
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
