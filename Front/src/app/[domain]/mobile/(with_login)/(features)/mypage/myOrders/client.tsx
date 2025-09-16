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
import { useEffect, useState } from "react";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import mypage from "../mypage.module.css";

export function MyOrdersTable() {
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState(q);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activePeriod, setActivePeriod] = useState("1week");

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    setStartDate(date);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [q]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let data :any= {
          relations:['items.brand','shipping_methods','store','address'],
          start_date: startDate,
          end_date: endDate,
        }
        if(debouncedQ)
          data.q = debouncedQ;
        console.log("data: ", data);
        const res = await requester.getOrders(data);
        console.log("orders response: ", res);
        // setOrders(res.data); // Assuming res.data contains the array of orders
      } catch (err) {
        console.error("Failed to fetch orders: ", err);
      }
    };

    fetchOrders();
  }, [debouncedQ, startDate, endDate]);

  const handlePeriodChange = (period: string) => {
    const newStartDate = new Date();
    const newEndDate = new Date();
    setActivePeriod(period);

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
  
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleSearch = () => {
    setDebouncedQ(q);
  };

  const cart = [
    {
      content: [
        {
          title: "여성용) 핑크색 일본 st 로제 베일 가운",
          thumbnail: "/resources/images/dummy_img/product_07.png",
          brand: "푸푸토이",
          price: "20,000",
          option: [
            { title: "여성용) 핑크색 일본 컬러 레드", price: "0" },
            { title: "여성용) 핑크색 일본 1+1 증정", price: "1,000" },
          ],
          delivery: "/resources/icons/cart/cj_icon.png",
        },
        {
          title: "여성용) 핑크색 일본 st 로제 베일 가운",
          thumbnail: "/resources/images/dummy_img/product_07.png",
          brand: "푸푸토이",
          price: "20,000",
          option: [
            { title: "여성용) 핑크색 일본 컬러 레드", price: "0" },
            { title: "여성용) 핑크색 일본 1+1 증정", price: "1,000" },
          ],
          delivery: "/resources/icons/cart/cj_icon.png",
        },
      ],
      date: "2025년 9월 10일",
    },
    {
      content: [
        {
          title: "여성용) 핑크색 일본 st 로제 베일 가운",
          thumbnail: "/resources/images/dummy_img/product_07.png",
          brand: "푸푸토이",
          price: "20,000",
          option: [
            { title: "여성용) 핑크색 일본 컬러 레드", price: "0" },
            { title: "여성용) 핑크색 일본 1+1 증정", price: "1,000" },
          ],
          delivery: "/resources/icons/cart/cj_icon.png",
        },
        {
          title: "여성용) 핑크색 일본 st 로제 베일 가운",
          thumbnail: "/resources/images/dummy_img/product_07.png",
          brand: "푸푸토이",
          price: "20,000",
          option: [
            { title: "여성용) 핑크색 일본 컬러 레드", price: "0" },
            { title: "여성용) 핑크색 일본 1+1 증정", price: "1,000" },
          ],
          delivery: "/resources/icons/cart/cj_icon.png",
        },
      ],
      date: "2025년 9월 7일",
    },
  ];
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
              <Input
                className={clsx("web_input", styles.picker_input)}
                width={"100%"}
                type="text"
                readOnly={true}
                value={formatDate(startDate)}
              />
              <Span size={18}>-</Span>
              <Input
                className={clsx("web_input", styles.picker_input)}
                width={"100%"}
                type="text"
                readOnly={true}
                value={formatDate(endDate)}
              />
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>
      <VerticalFlex gap={20}>
        {cart.length > 0 ? (
          cart.map((item, i) => (
            <VerticalFlex key={i} gap={20}>
              <VerticalFlex gap={10} borderBottom={"1px solid #bbb"}>
                <FlexChild>
                  <P size={15} weight={500}>
                    {item.date}
                  </P>
                </FlexChild>

                {item.content.map((child, j) => (
                  <VerticalFlex
                    key={j}
                    className={styles.list_item}
                    gap={30}
                    borderBottom={"1px solid #323232"}
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
                      {child.option.map((option, k) => (
                        <HorizontalFlex key={k} gap={10}>
                          <P>{option.title}</P>
                          <Span> + {option.price}원</Span>
                        </HorizontalFlex>
                      ))}
                    </VerticalFlex>

                    {/* 가격 박스 */}
                    <HorizontalFlex className={styles.price_box}>
                      <FlexChild>
                        <P>할인금액 : </P>
                        <Span>0원</Span>
                      </FlexChild>

                      <FlexChild>
                        <P>결제 금액 : </P>
                        <Span
                          color="var(--main-color1)"
                          weight={600}
                          fontSize={20}
                        >
                          {child.price}₩
                        </Span>
                      </FlexChild>
                    </HorizontalFlex>
                  </VerticalFlex>
                ))}
              </VerticalFlex>
            </VerticalFlex>
          ))
        ) : (
          <NoContent type="장바구니" />
        )}
      </VerticalFlex>
    </>
  );
}
