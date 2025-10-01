"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import DatePicker from "@/components/date-picker/DatePicker";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Span from "@/components/span/Span";
import Div from "@/components/div/Div";
import { useState } from "react";
import useNavigate from "@/shared/hooks/useNavigate";
import clsx from "clsx";
import styles from "./page.module.css";


export function PointHistory({
  initEndDate,
  initStartDate,
}: {
  initStartDate: Date;
  initEndDate: Date;
}) {
  const [q, setQ] = useState("");
  const [condition, setCondition] = useState<any>({});
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);
  const [activePeriod, setActivePeriod] = useState("1week");
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

  const test = [
    {
      date: "2025년 9월 1일",
      title: "[손가락 콘돔] 핑돔 1box 24pcs (Findom 1box) - FD24 (ALC)외 3개",
      point: "1,000",
      used: false,
      balance: "9,860",
      id: "test1",
    },
    {
      date: "2025년 9월 1일",
      title: "[주간할인] 백탁 실리콘 애널 로션",
      point: "1,000",
      used: false,
      balance: "11,860",
      id: "test2",
    },
    {
      date: "2025년 9월 1일",
      title: "초보자 등급 적립금",
      point: "200",
      used: true,
      balance: "12,060",
      id: "test3",
    },
  ];

  return (
    <>
      <VerticalFlex gap={25}>
        {/* 현 적립 포인트 */}
        <VerticalFlex className={styles.my_point_box}>
          <FlexChild className={styles.title}>
            <P>
              현재 적립 포인트
            </P>
          </FlexChild>
          <FlexChild className={styles.my_point}>
            <P>10,000,000</P>
            <P>P</P>
          </FlexChild>
        </VerticalFlex>

        {/* 기간선택 */}
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

        {/* 포인트 내역(최신순으로 정렬해야함) */}
        <VerticalFlex className={styles.point_history} alignItems="flex-start" gap={20}>
          <P className={styles.date}>2025.09.01</P>
          {test.map((point, index) => {
            const isUsed = point.used;
            const navigate = useNavigate();
            return (
              <FlexChild
                key={index}
                borderBottom={"1px solid #797979"}
                paddingBottom={15}
                onClick={() => navigate(`/mypage/point/${point.id}`)}
              >
                <HorizontalFlex>
                  <VerticalFlex alignItems="flex-start" gap={10}>
                    <P className={styles.title}>{point.title}</P>
                    <P className={styles.time}>13{":"}30</P>
                  </VerticalFlex>
                  <VerticalFlex alignItems="flex-end" gap={5}>
                    <P className={styles.point}>
                      <Span>{isUsed ? '+' : '-'}</Span>
                      <Span>{point.point}</Span>
                      <Span>P</Span>
                    </P>
                    <P className={clsx(styles.status,{
                        [styles.used] : !isUsed,
                      })}>
                      {isUsed ? '적립' : '사용'}
                    </P>
                    <P className={styles.points_balance}>
                      <Span>잔액 </Span>
                      <Span>{point.balance}</Span>
                      <Span>P</Span>
                    </P>
                  </VerticalFlex>
                </HorizontalFlex>
              </FlexChild>
            )
          })}
          <Div className={styles.space_line} />
        </VerticalFlex>
      </VerticalFlex>
    </>
  )
}