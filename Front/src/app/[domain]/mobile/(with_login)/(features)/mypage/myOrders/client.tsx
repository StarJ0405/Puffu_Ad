"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";
import { useEffect, useState, useCallback } from "react";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import mypage from "../mypage.module.css";
import DatePicker from "@/components/date-picker/DatePicker";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";

const getStatusKorean = (status: string) => {
  switch (status) {
    case "pending":
      return "상품 준비중";
    case "fulfilled":
      return "배송 준비중";
    case "shipping":
      return "배송중";
    case "complete":
      return "배송 완료";
    case "cancel":
      return "주문 취소";
    default:
      return status;
  }
};

const getInitialStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

export function MyOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [startDate, setStartDate] = useState(getInitialStartDate());
  const [endDate, setEndDate] = useState(new Date());
  const [activePeriod, setActivePeriod] = useState("1week");
  const { isMobile } = useBrowserEvent();

  const formatOrders = useCallback((ordersData: any[]) => {
    return ordersData.map((order) => {
      const orderDate = new Date(order.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let totalDiscount = 0;
      let totalPayment = 0;

      const content = order.items.map((item: any) => {
        const discount = item.total - item.total_discount;
        totalDiscount += discount;
        totalPayment += item.total_discount;
        return {
          title: item.product_title,
          thumbnail: item.thumbnail,
          brand: item.brand.name,
          price: item.total_discount.toLocaleString(),
          discountAmount: discount.toLocaleString(),
          option: item.variant_title
            ? [{ title: item.variant_title, price: "0" }]
            : [],
          delivery: "/resources/icons/cart/cj_icon.png",
        };
      });

      return {
        date: orderDate,
        orderId: order.display, // Unique order identifier
        content: content,
        totalDiscount: totalDiscount.toLocaleString(),
        totalPayment: totalPayment.toLocaleString(),
        status: order.status,
        trackingNumber: order.shipping_methods?.[0]?.tracking_number,
      };
    });
  }, []);

  const fetchOrders = useCallback(
    async (start: Date, end: Date, query: string) => {
      try {
        const data: any = {
          relations: ["items.brand", "shipping_methods", "store", "address"],
          start_date: start,
          end_date: end,
        };
        if (query && query.length > 0) {
          data.q = query;
        }
        console.log("data: ", data);
        const res = await requester.getOrders(data);
        console.log("res: ", res);
        if (res.content) {
          const formattedOrders = formatOrders(res.content);
          setOrders(formattedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to fetch orders: ", err);
        setOrders([]);
      }
    },
    [formatOrders]
  );

  useEffect(() => {
    fetchOrders(startDate, endDate, "");
  }, []);

  const handlePeriodChange = (period: string) => {
    const newStartDate = new Date();
    const newEndDate = new Date();
    setActivePeriod(period);
    setQ("");

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
    fetchOrders(newStartDate, newEndDate, "");
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
    fetchOrders(startDate, endDate, q);
  };

  const handleTracking = (trackingNumber: string) => {
    const filteredTrackingNumber = trackingNumber.replace(/-/g, "");
    const url = `https://www.cjlogistics.com/ko/tool/parcel/tracking?gnbInvcNo=${filteredTrackingNumber}`;
    if (isMobile) {
      window.open(url, "_blank");
    } else {
      window.open(url, "delivery_tracking", "width=800,height=600");
    }
  };

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
          orders.map((item, i) => (
            <VerticalFlex key={i} className={styles.order_group}>
              <FlexChild className={styles.order_header}>
                <P size={15} weight={500}>
                  {item.date}{" "}
                  <Span color="var(--main-color1)">
                    [{getStatusKorean(item.status)}]
                  </Span>
                </P>
                {item.status === "shipping" && item.trackingNumber && (
                  <Button
                    className={styles.tracking_btn}
                    onClick={() => handleTracking(item.trackingNumber)}
                  >
                    배송조회
                  </Button>
                )}
              </FlexChild>

              <VerticalFlex className={styles.order_items_container}>
                {item.content.map((child: any, j: number) => (
                  <VerticalFlex
                    key={j}
                    className={styles.list_item}
                    gap={15}
                  >
                    {/* 상품 단위 */}
                    <HorizontalFlex className={styles.unit}>
                      <Image
                        src={child.thumbnail}
                        width={80}
                        borderRadius={5}
                      />
                      <VerticalFlex
                        className={styles.unit_content}
                        width={"auto"}
                        alignItems="start"
                      >
                        <FlexChild gap={5}>
                          <Span className={styles.unit_brand}>
                            {child.brand}
                          </Span>
                          <Image src={child.delivery} width={13} />
                        </FlexChild>

                        <P
                          className={styles.unit_title}
                          lineClamp={2}
                          overflow="hidden"
                          display="--webkit-box"
                        >
                          {child.title}
                        </P>
                      </VerticalFlex>
                    </HorizontalFlex>

                    {/* 옵션 리스트 */}
                    <VerticalFlex className={styles.option_list}>
                      {child.option.map((option: any, k: number) => (
                        <HorizontalFlex key={k} gap={10}>
                          <P>{option.title}</P>
                          <Span> + {option.price}원</Span>
                        </HorizontalFlex>
                      ))}
                    </VerticalFlex>

                    {/* 가격 박스 */}
                    <HorizontalFlex className={styles.item_price_box}>
                      <FlexChild>
                        <P>할인금액 : </P>
                        <Span>{child.discountAmount}원</Span>
                      </FlexChild>

                      <FlexChild>
                        <P>결제 금액 : </P>
                        <Span
                          color="var(--main-color1)"
                          weight={600}
                          fontSize={18}
                        >
                          {child.price}원
                        </Span>
                      </FlexChild>
                    </HorizontalFlex>
                  </VerticalFlex>
                ))}
              </VerticalFlex>

              <VerticalFlex className={styles.order_summary}>
                <HorizontalFlex className={styles.summary_row}>
                  <P>총 할인금액</P>
                  <Span>{item.totalDiscount}원</Span>
                </HorizontalFlex>
                <HorizontalFlex className={styles.summary_row}>
                  <P>총 결제금액</P>
                  <Span
                    color="var(--main-color1)"
                    weight={600}
                    fontSize={20}
                  >
                    {item.totalPayment}원
                  </Span>
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
