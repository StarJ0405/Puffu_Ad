"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import DatePicker from "@/components/date-picker/DatePicker";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Span from "@/components/span/Span";
import { useEffect, useMemo, useState, useCallback } from "react";
import useNavigate from "@/shared/hooks/useNavigate";
import clsx from "clsx";
import styles from "./page.module.css";
import { requester } from "@/shared/Requester";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import NoContent from "@/components/noContent/noContent";
import ListPagination from "@/components/listPagination/ListPagination";

type LogRow = {
  id: string;
  name?: string;
  created_at: string;
  data?: { user_id?: string; point?: number | string; total?: number | string };
};

const fmtYmd = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export function PointHistory({
  initEndDate,
  initStartDate,
}: {
  initStartDate: Date;
  initEndDate: Date;
}) {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const GROUPS_PER_PAGE = 5;
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<LogRow[]>([]);
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);
  const [activePeriod, setActivePeriod] = useState<
    "1week" | "1month" | "3months" | "6months" | "custom"
  >("1week");

  const fetchPointsByRange = useCallback(async (from: Date, to: Date) => {
    const params: any = {
      order: { created_at: "DESC" },
      starts_at: startOfDay(from).toISOString(),
      ends_at: endOfDay(to).toISOString(),
    };
    const res = await requester.getPoints(params);
    const list = res?.content ?? res?.data?.content ?? [];
    setRows(Array.isArray(list) ? list : []);
  }, []);

  useEffect(() => {
    fetchPointsByRange(startOfDay(initStartDate), endOfDay(initEndDate));
  }, [fetchPointsByRange, initStartDate, initEndDate]);

  const handlePeriodChange = (
    period: "1week" | "1month" | "3months" | "6months"
  ) => {
    const now = new Date();
    const from = new Date(now);
    if (period === "1week") from.setDate(now.getDate() - 7);
    if (period === "1month") from.setMonth(now.getMonth() - 1);
    if (period === "3months") from.setMonth(now.getMonth() - 3);
    if (period === "6months") from.setMonth(now.getMonth() - 6);

    const s = startOfDay(from);
    const e = endOfDay(now);
    setActivePeriod(period);
    setStartDate(s);
    setEndDate(e);
    setPage(0);
    fetchPointsByRange(s, e);
  };

  const handleDateChange = (v: Date | [Date | null, Date | null] | null) => {
    if (!Array.isArray(v)) return;
    const [s0, e0] = v;
    if (!s0 || !e0) return;
    const s = startOfDay(new Date(s0));
    const e = endOfDay(new Date(e0));
    setStartDate(s);
    setEndDate(e);
    setActivePeriod("custom");
    setPage(0);
    fetchPointsByRange(s, e);
  };

  const list = useMemo(() => {
    return (rows ?? []).map((row) => {
      const d = new Date(row.created_at);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const amt = Number(row?.data?.point ?? 0); // 금액/부호 = log.data.point
      const total = row?.data?.total; // 잔액 = log.data.total

      return {
        id: row.id,
        date: fmtYmd(d),
        title: row.name ?? "-",
        used: amt > 0, // true=적립(+), false=사용(-)
        point: Math.abs(amt).toLocaleString(),
        balance: total != null ? Number(total).toLocaleString() : "-", // per-row 잔액
        time: `${hh} : ${mm}`,
      };
    });
  }, [rows]);

  // 날짜별 그룹핑
  const grouped = useMemo(() => {
    const m = new Map<string, typeof list>();
    for (const item of list) {
      if (!m.has(item.date)) m.set(item.date, []);
      m.get(item.date)!.push(item);
    }
    return Array.from(m.entries()).sort(([a], [b]) => (a > b ? -1 : 1));
  }, [list]);

  const maxPage = Math.max(0, Math.ceil(grouped.length / GROUPS_PER_PAGE) - 1);
  const pageGroups = useMemo(
    () =>
      grouped.slice(
        page * GROUPS_PER_PAGE,
        page * GROUPS_PER_PAGE + GROUPS_PER_PAGE
      ),
    [grouped, page]
  );

  const userTotalPoint = userData?.point;

  return (
    <VerticalFlex gap={40}>
      {/* 현 적립 포인트 */}
      <FlexChild gap={30}>
        <VerticalFlex className={styles.my_point_box}>
          <FlexChild className={styles.title}>
            <P>현재 적립 포인트</P>
          </FlexChild>
          <FlexChild className={styles.my_point}>
            <P>{userTotalPoint?.toLocaleString()}</P>
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
      </FlexChild>

      {/* 포인트 내역 */}
      <VerticalFlex className={styles.history_wrapper} gap={25}>
        {pageGroups.length > 0 ? (
          <>
            {pageGroups.map(([date, items]) => (
              <VerticalFlex
                key={date}
                className={styles.point_history}
                alignItems="flex-start"
                gap={20}
              >
                <FlexChild className={styles.history_title}>
                  <P className={styles.date}>{date}</P>
                </FlexChild>

                {items.map((point, index) => {
                  const isUsed = point.used;
                  return (
                    <FlexChild
                      key={point.id ?? index}
                      borderBottom={
                        index === items.length - 1 ? "none" : "1px solid #444"
                      }
                      paddingBottom={index === items.length - 1 ? 0 : 15}
                      onClick={() => navigate(`/mypage/point/${point.id}`)}
                    >
                      <HorizontalFlex>
                        <VerticalFlex alignItems="flex-start" gap={20}>
                          <P className={styles.title}>{point.title}</P>
                          <P className={styles.time}>{point.time}</P>
                        </VerticalFlex>
                        <VerticalFlex alignItems="flex-end" gap={10}>
                          <P className={styles.point}>
                            <Span>{isUsed ? "+" : "-"}</Span>
                            <Span>{point.point}</Span>
                            <Span>P</Span>
                          </P>
                          <P
                            className={clsx(styles.status, {
                              [styles.used]: !isUsed,
                            })}
                          >
                            {isUsed ? "적립" : "사용"}
                          </P>
                          {point.balance !== "-" && (
                            <P className={styles.points_balance}>
                              <Span>잔액 </Span>
                              <Span>{point.balance}</Span>
                              <Span>P</Span>
                            </P>
                          )}
                        </VerticalFlex>
                      </HorizontalFlex>
                    </FlexChild>
                  );
                })}
              </VerticalFlex>
            ))}
            <VerticalFlex paddingTop={20}>
              <ListPagination
                page={page}
                maxPage={maxPage}
                onChange={setPage}
              />
            </VerticalFlex>
          </>
        ) : (
          <NoContent type={"포인트"} />
        )}
      </VerticalFlex>
    </VerticalFlex>
  );
}
