"use client";

import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import DatePicker from "@/components/date-picker/DatePicker";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import Table, { Column } from "@/components/table/Table";
import Tooltip from "@/components/tooltip/Tooltip";
import { RowInterface } from "@/modals/context/ContextMenuModal";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import {
  delay,
  downloadExcelFile,
  openTrackingNumber,
  readExcelFile,
  toast,
} from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import _ from "lodash";
import { RefObject, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
export default function ({
  initCondition,
  initData,
  status,
  initStores,
}: {
  initCondition: any;
  initData: Pageable;
  status: string | undefined;
  initStores: any;
}) {
  const columns: Column[] = [
    {
      label: "주문번호",
      code: "display",
      styling: {
        common: {
          style: {
            width: 130,
            minWidth: 130,
          },
        },
      },
    },
    {
      label: "주문자",
      code: "user",
      Cell: ({ cell }) => (
        <Tooltip
          position="left"
          content={
            <VerticalFlex
              padding={15}
              backgroundColor="#fff"
              border={"1px solid #dadada"}
              flexStart
              gap={5}
            >
              <FlexChild>
                <P width={80}>이름</P>
                <P>{cell.name}</P>
              </FlexChild>
              <FlexChild>
                <P width={80}>아이디</P>
                <P>{cell.username}</P>
              </FlexChild>
              <FlexChild>
                <P width={80}>전화번호</P>
                <P>{cell.phone}</P>
              </FlexChild>
            </VerticalFlex>
          }
        >
          <P width={60}>{cell.name}</P>
        </Tooltip>
      ),
      styling: {
        common: {
          style: {
            width: 60,
            minWidth: 60,
          },
        },
      },
    },
    {
      label: "결제금액",
      code: "total_final",
      Cell: ({ cell, row }) => {
        if (row.status === "cancel") return "주문 취소";
        const type =
          cell <= 0
            ? "포인트 결제"
            : row?.payment_data?.bank_number
            ? "무통장"
            : row?.payment_data?.trackId
            ? "NESTPAY(신용카드)"
            : row?.payment_data?.type === "BRANDPAY"
            ? "토스"
            : "알 수 없음";
        const { refundValue, refundPoint } = (
          (row.refunds || []) as RefundData[]
        ).reduce(
          (acc, now) => {
            acc.refundValue += now.value;
            acc.refundPoint += now.point;
            return acc;
          },
          { refundValue: 0, refundPoint: 0 }
        );

        return (
          <Tooltip
            disable={refundPoint <= 0 && refundValue <= 0}
            content={
              <VerticalFlex
                backgroundColor="#fff"
                border={"1px solid #d0d0d0"}
                padding={10}
                minWidth={200}
              >
                <FlexChild hidden={cell <= 0} paddingBottom={"0.5em"}>
                  <HorizontalFlex>
                    <P fontWeight={700} fontSize={18}>
                      결제
                    </P>
                    <P color="green">
                      <Span>{cell - refundValue}</Span>
                      <Span>원</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild
                  hidden={
                    row.refunds.filter((f: RefundData) => f.value > 0)
                      .length === 0
                  }
                >
                  <VerticalFlex>
                    <FlexChild>
                      <P textIndent={"1em"}>- 기본 결제액</P>
                    </FlexChild>
                    <FlexChild justifyContent="flex-end">
                      <P>
                        <Span>{cell}</Span>
                        <Span>원</Span>
                      </P>
                    </FlexChild>
                    <FlexChild>
                      <P textIndent={"1em"}>- 환불액</P>
                    </FlexChild>
                    {row.refunds
                      .filter((f: RefundData) => f.value > 0)
                      .map((refund: RefundData) => (
                        <FlexChild justifyContent="flex-end" key={refund.id}>
                          <P color="red">
                            <Span>{-refund.value}</Span>
                            <Span>원</Span>
                          </P>
                        </FlexChild>
                      ))}
                  </VerticalFlex>
                </FlexChild>
                <FlexChild hidden={row.point <= 0} paddingBottom={"0.5em"}>
                  <HorizontalFlex>
                    <P fontWeight={700} fontSize={18}>
                      포인트
                    </P>
                    <P color="green">
                      <Span>{row.point - refundPoint}</Span>
                      <Span>P</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild
                  hidden={
                    row.refunds.filter((f: RefundData) => f.point > 0)
                      .length === 0
                  }
                >
                  <VerticalFlex>
                    <FlexChild>
                      <P textIndent={"1em"}>- 기본 포인트</P>
                    </FlexChild>
                    <FlexChild justifyContent="flex-end">
                      <P>
                        <Span>{row.point}</Span>
                        <Span>P</Span>
                      </P>
                    </FlexChild>
                    <FlexChild>
                      <P textIndent={"1em"}>- 환불 포인트</P>
                    </FlexChild>
                    {row.refunds
                      .filter((f: RefundData) => f.point > 0)
                      .map((refund: RefundData) => (
                        <FlexChild justifyContent="flex-end" key={refund.id}>
                          <P color="red">
                            <Span>{-refund.point}</Span>
                            <Span>P</Span>
                          </P>
                        </FlexChild>
                      ))}
                  </VerticalFlex>
                </FlexChild>
              </VerticalFlex>
            }
          >
            <VerticalFlex>
              <P lineHeight={1.3} width={150} fontWeight={600}>
                {type}
              </P>
              <P
                width={150}
                hidden={cell <= 0}
                textDecorationLine={
                  refundValue > 0 ? "line-through" : undefined
                }
              >
                <Span>{cell}</Span>
                <Span>원</Span>
              </P>
              <P
                color="green"
                width={150}
                hidden={cell <= 0 || refundValue === 0}
              >
                <Span>{cell - refundValue}</Span>
                <Span>원</Span>
              </P>

              <P
                width={150}
                hidden={row?.point <= 0}
                textDecorationLine={
                  refundPoint > 0 ? "line-through" : undefined
                }
              >
                <Span>{row?.point}</Span>
                <Span>P</Span>
              </P>
              <P
                color="green"
                width={150}
                hidden={row?.point <= 0 || refundPoint === 0}
              >
                <Span>{row.point - refundPoint}</Span>
                <Span>P</Span>
              </P>
            </VerticalFlex>
          </Tooltip>
        );
      },
      styling: {
        common: {
          style: {
            width: 150,
            minWidth: 150,
          },
        },
      },
    },
    {
      label: "상품",
      code: "items",
      Cell: ({ cell }) => (
        <VerticalFlex gap={10}>
          {cell
            ?.sort((i1: LineItemData, i2: LineItemData) =>
              String(
                `${i1.brand_id} ${i1.product_title} ${new Date(
                  i1.created_at
                ).getTime()}`
              ).localeCompare(
                String(
                  `${i2.brand_id} ${i2.product_title} ${new Date(
                    i2.created_at
                  ).getTime()}`
                )
              )
            )
            ?.map((item: LineItemData) => {
              return (
                <FlexChild
                  key={item.id}
                  flexGrow={0}
                  flexShrink={0}
                  flexBasis={"auto"}
                  textDecorationLine={
                    !!item.refunds?.length || !!item.exchanges?.length
                      ? "line-through"
                      : undefined
                  }
                >
                  <Tooltip
                    position="right"
                    content={
                      <Image src={item.thumbnail} size={"min(30vw,30vh)"} />
                    }
                  >
                    <Image src={item.thumbnail} size={50} />
                  </Tooltip>
                  <P>({item?.brand?.name})</P>
                  <P>{item.title}</P>
                  <P>
                    <Span>X </Span>
                    <Span>
                      {item.total_quantity}
                      {item.extra_quantity > 0 &&
                        `(${item.quantity} + ${item.extra_quantity})`}
                    </Span>
                  </P>
                </FlexChild>
              );
            })}
        </VerticalFlex>
      ),
    },
    {
      label: "배송지 정보",
      code: "address",
      Cell: ({ cell, row }: { cell: AddressData; row: OrderData }) => {
        const tracking_number = row?.shipping_method?.tracking_number;
        return (
          <Tooltip
            position="left"
            content={
              <VerticalFlex
                padding={15}
                backgroundColor="#fff"
                border={"1px solid #dadada"}
                gap={6}
              >
                <FlexChild alignItems="flex-start">
                  <P width={80} paddingRight={10}>
                    수령인
                  </P>
                  <P width={300}>{cell?.name}</P>
                </FlexChild>
                <FlexChild alignItems="flex-start">
                  <P width={80} paddingRight={10}>
                    전화번호
                  </P>
                  <P width={300}>{cell?.phone}</P>
                </FlexChild>
                <FlexChild alignItems="flex-start">
                  <P width={80} paddingRight={10}>
                    주소
                  </P>
                  <P width={300}>
                    {cell?.address1} {cell?.address2} ({cell?.postal_code})
                  </P>
                </FlexChild>
                <FlexChild alignItems="flex-start">
                  <P width={80} paddingRight={10}>
                    배송메모
                  </P>
                  <P width={300}>{cell?.message}</P>
                </FlexChild>

                <FlexChild alignItems="flex-start" hidden={!tracking_number}>
                  <P width={80} paddingRight={10}>
                    운송장번호
                  </P>
                  <P
                    textHover
                    cursor="point"
                    width={300}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openTrackingNumber(tracking_number || "");
                    }}
                  >
                    {tracking_number}
                  </P>
                </FlexChild>
              </VerticalFlex>
            }
          >
            <VerticalFlex width={150} maxWidth={150}>
              <P>{cell?.name}</P>
              <P>{cell?.phone}</P>
              <P>
                {cell?.address1} {cell?.address2} ({cell?.postal_code})
              </P>
              <P>{cell?.message}</P>
              <P
                hidden={!tracking_number}
                textHover
                cursor="point"
                width={300}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openTrackingNumber(tracking_number || "");
                }}
              >
                {tracking_number}
              </P>
            </VerticalFlex>
          </Tooltip>
        );
      },
      styling: {
        common: {
          style: {
            width: 150,
            minWidth: 150,
          },
        },
      },
    },
    {
      label: "관리자메모",
      code: "metadata",
      Cell: ({ cell }) =>
        cell?.memo ? (
          <Tooltip position="left" disable={!cell?.memo} content={cell?.memo}>
            <P width={100}>{cell?.memo}</P>
          </Tooltip>
        ) : (
          "없음"
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
  ];
  const { stores } = useData(
    "stores",
    {},
    (condition) => adminRequester.getStores(condition),
    {
      onReprocessing: (data) => data?.content || [],
      fallbackData: initStores,
    }
  );
  const [store, setStore] = useState<string>("");
  const [dates, setDates] = useState<Date[]>([
    initCondition.start_date,
    new Date(),
  ]);
  const [total, setTotal] = useState(initData.NumberOfTotalElements);
  const table = useRef<any>(null);
  const input = useRef<any>(null);
  const onSearchClick = () => {
    const data: any = {};
    const q = input.current.getValue();
    if (q) data.q = q;
    const start_date = dates?.[0];
    const end_date = dates?.[1];
    if (start_date) {
      start_date.setHours(0, 0, 0, 0);
      data.start_date = start_date;
    }
    if (end_date) {
      end_date.setHours(23, 59, 59, 999);
      data.end_date = end_date;
    }
    if (store) data.store_id = store;
    table.current.setCondition(data);
  };
  const onResetClick = () => {
    input.current.empty();
    setDates([initCondition.start_date, new Date()]);
    setStore("");
    table.current.reset();
  };
  const ContextMenu = ({ x, y, row }: { x: number; y: number; row?: any }) => {
    const rows: RowInterface[] = [
      {
        label: "새로고침",
        key: "Ctrl+R",
        hotKey: "r",
        onClick: () => {
          table.current.research();
          toast({ message: "목록을 갱신했습니다." });
        },
      },
    ];
    if (row) {
      rows.push(
        {
          label: "상세보기",
          hotKey: "i",
          onClick: () => {
            NiceModal.show("orderDetail", { order: row });
          },
        },
        {
          label: "관리자메모",
          hotKey: "a",
          onClick: () => {
            NiceModal.show("input", {
              message: "관리자메모 입력",
              cancelText: "취소",
              confirmText: "저장",
              input: {
                type: "text-area",
                value: row?.metadata?.memo || "",
              },
              onConfirm: (value: string) =>
                adminRequester.updateOrder(
                  row.id,
                  {
                    metadata: _.merge(row.metadata || {}, { memo: value }),
                  },
                  () => table.current.research()
                ),
            });
          },
        }
      );
      if (status === "product" || status === "ready" || status === "awaiting") {
        rows.push({
          label: "주문 취소",
          hotKey: "d",
          onClick: () =>
            NiceModal.show("confirm", {
              message: (
                <VerticalFlex gap={15}>
                  <P
                    fontSize={20}
                    fontWeight={700}
                  >{`주문 번호 ${row.display}`}</P>
                  <P>해당 주문을 취소하시겠습니까?</P>
                </VerticalFlex>
              ),
              cancelText: "닫기",
              confirmText: "취소 처리",
              onConfirm: () => {
                adminRequester.cancelOrders(
                  {
                    id: row.id,
                  },
                  () => {
                    table.current.research();
                  }
                );
              },
            }),
        });
      }
      if (status === "fulfilled" || status === "ready") {
        rows.push({
          label: `송장번호 ${
            row?.shipping_method?.tracking_number ? "수정" : "입력"
          }`,
          hotKey: "s",
          onClick: () =>
            NiceModal.show("input", {
              message: "송장번호를 입력하세요",
              cancelText: "취소",
              confirmText: "입력",
              input: {
                value: row?.shipping_method?.tracking_number || "",
              },
              onConfirm: (value: string) =>
                adminRequester.updateOrder(
                  row.id,
                  {
                    tracking_number: String(value).trim(),
                  },
                  () => table.current.research()
                ),
            }),
        });
      }
      if (status === "awaiting") {
        rows.push({
          label: "입금확인 처리",
          hotKey: "c",
          onClick: () =>
            NiceModal.show("confirm", {
              message: (
                <VerticalFlex gap={15}>
                  <P
                    fontSize={20}
                    fontWeight={700}
                  >{`주문 번호 ${row.display}`}</P>
                  <P>해당 주문의 입금을 확인했습니까?</P>
                </VerticalFlex>
              ),
              cancelText: "닫기",
              confirmText: "확인 처리",
              onConfirm: () => {
                adminRequester.updateOrder(
                  row.id,
                  {
                    status: "pending",
                  },
                  () => {
                    table.current.research();
                  }
                );
              },
            }),
        });
      }
      if (status === "product" && row.payment_data?.bank_number) {
        rows.push({
          label: "입금확인 취소",
          hotKey: "c",
          onClick: () =>
            NiceModal.show("confirm", {
              message: (
                <VerticalFlex gap={15}>
                  <P
                    fontSize={20}
                    fontWeight={700}
                  >{`주문 번호 ${row.display}`}</P>
                  <P>해당 주문의 입금을 대기로 전환하시겠습니까?</P>
                </VerticalFlex>
              ),
              cancelText: "닫기",
              confirmText: "대기 처리",
              onConfirm: () => {
                adminRequester.updateOrder(
                  row.id,
                  {
                    status: "awaiting",
                  },
                  () => {
                    table.current.research();
                  }
                );
              },
            }),
        });
      }
      if (
        status === "completed" &&
        row.items.some(
          (item: LineItemData) =>
            item.quantity -
              (item.refunds?.reduce((acc, now) => acc + now.quantity, 0) || 0) >
            0
        )
      ) {
        rows.push(
          {
            label: "환불 신청",
            hotKey: "f",
            onClick: () =>
              NiceModal.show("orderRefund", {
                order: row,
                onSuccess: () => table.current.research(),
              }),
          },
          {
            label: "교환 신청",
            hotKey: "x",
            onClick: () =>
              NiceModal.show("orderExchange", {
                order: row,
                onSuccess: () => table.current.research(),
              }),
          }
        );
      }
    }
    return { x, y, rows };
  };
  const onDetailClick = (e: React.MouseEvent, row: any) => {
    e.preventDefault();
    e.stopPropagation();
    NiceModal.show("orderDetail", { order: row });
  };
  const dateFormats = [
    {
      label: "전체",
      getDate: () => [new Date(0), new Date()],
    },
    {
      label: "오늘",
      getDate: () => [new Date(), new Date()],
    },
    {
      label: "1주일",
      getDate: () => {
        const start_date = new Date();
        start_date.setDate(start_date.getDate() - 7);
        return [start_date, new Date()];
      },
    },
    {
      label: "1개월",
      getDate: () => {
        const start_date = new Date();
        start_date.setMonth(start_date.getMonth() - 1);
        return [start_date, new Date()];
      },
    },
    {
      label: "3개월",
      getDate: () => {
        const start_date = new Date();
        start_date.setMonth(start_date.getMonth() - 3);
        return [start_date, new Date()];
      },
    },
    {
      label: "6개월",
      getDate: () => {
        const start_date = new Date();
        start_date.setMonth(start_date.getMonth() - 6);
        return [start_date, new Date()];
      },
    },
    {
      label: "1년",
      getDate: () => {
        const start_date = new Date();
        start_date.setFullYear(start_date.getFullYear() - 1);
        return [start_date, new Date()];
      },
    },
  ];
  return (
    <VerticalFlex>
      <FlexChild>
        <div className={styles.search_ontainer}>
          <VerticalFlex>
            <FlexChild>
              <VerticalFlex>
                <FlexChild borderBottom={"1px solid #e9e9e9"}>
                  <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                    <FlexChild
                      width={"10%"}
                      backgroundColor={"var(--admin-table-bg-color)"}
                    >
                      <div className={styles.titleWrap}>
                        <Center>
                          <P size={16} weight={"bold"}>
                            스토어
                          </P>
                        </Center>
                      </div>
                    </FlexChild>
                    <FlexChild>
                      <Select
                        value={store}
                        options={[
                          { display: "전체", value: "" },
                          ...stores?.map((store: StoreData) => ({
                            display: store.name,
                            value: store.id,
                          })),
                        ]}
                        onChange={(selected) => setStore(selected as string)}
                      />
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild borderBottom={"1px solid #e9e9e9"}>
                  <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                    <FlexChild
                      width={"10%"}
                      backgroundColor={"var(--admin-table-bg-color)"}
                    >
                      <div className={styles.titleWrap}>
                        <Center>
                          <P size={16} weight={"bold"}>
                            기간
                          </P>
                        </Center>
                      </div>
                    </FlexChild>
                    <FlexChild>
                      <HorizontalFlex gap={10}>
                        <FlexChild width={300}>
                          <DatePicker
                            values={dates as any}
                            defaultSelectedRange={[dates[0], dates[1]]}
                            selectionMode="range"
                            onChange={(dates: any) => setDates(dates)}
                          />
                        </FlexChild>
                        <FlexChild gap={10}>
                          {dateFormats.map((format) => {
                            const _dates = format.getDate();
                            return (
                              <Button
                                className={clsx(styles.dateButton, {
                                  [styles.selected]:
                                    _dates?.[0].toLocaleDateString() ===
                                      dates?.[0].toLocaleDateString() &&
                                    _dates?.[1].toLocaleDateString() ===
                                      dates?.[1].toLocaleDateString(),
                                })}
                                key={format.label}
                                onClick={() => setDates(_dates)}
                              >
                                {format.label}
                              </Button>
                            );
                          })}
                        </FlexChild>
                      </HorizontalFlex>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild borderBottom={"1px solid #e9e9e9"}>
                  <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                    <FlexChild
                      width={"10%"}
                      backgroundColor={"var(--admin-table-bg-color)"}
                    >
                      <div className={styles.titleWrap}>
                        <Center>
                          <P size={16} weight={"bold"}>
                            통합검색
                          </P>
                        </Center>
                      </div>
                    </FlexChild>
                    <FlexChild>
                      <Input
                        width={300}
                        style={{ padding: "6px 12px" }}
                        ref={input}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSearchClick();
                        }}
                      />
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
            <FlexChild backgroundColor={"#f5f6fb"} padding={"20px 0"}>
              <HorizontalFlex gap={20}>
                <FlexChild justifyContent={"flex-end"}>
                  <Button
                    styleType="admin"
                    className={styles.button}
                    onClick={onSearchClick}
                  >
                    <P size={16}>조건검색</P>
                  </Button>
                </FlexChild>
                <FlexChild>
                  <Button
                    styleType="white"
                    className={styles.button}
                    onClick={onResetClick}
                  >
                    <P size={16}>초기화</P>
                  </Button>
                </FlexChild>
              </HorizontalFlex>
            </FlexChild>
          </VerticalFlex>
        </div>
      </FlexChild>
      <FlexChild padding={"15px 5px"}>
        <HorizontalFlex>
          <FlexChild>
            <P fontSize={18} weight={600}>
              검색 결과 : {total}건
            </P>
          </FlexChild>
          <Buttons status={status} table={table} total={total} />

          <FlexChild width={"max-content"}>
            <Select
              width={80}
              value={initCondition.pageSize}
              options={[1, 20, 50, 100, 200].map((i) => ({
                display: String(i),
                value: i,
              }))}
              onChange={(value) => table.current.setLimit(value)}
            />
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <Table
          indexing={false}
          ref={table}
          onRowClick={(e, row) => onDetailClick(e, row)}
          name="orders"
          columns={columns}
          initCondition={initCondition}
          initLimit={20}
          initData={initData}
          onSearch={(condition) => {
            return adminRequester.getOrders(condition);
          }}
          onMaxPage={(data) => {
            return Number(data?.totalPages);
          }}
          onReprocessing={(data) => data?.content || []}
          onChange={({ origin }) => setTotal(origin.NumberOfTotalElements)}
          ContextMenu={ContextMenu}
        />
      </FlexChild>
    </VerticalFlex>
  );
}

function Buttons({
  status,
  table,
  total,
}: {
  status?: string;
  table: RefObject<any>;
  total: number;
}) {
  const ref = useRef<any>(null);
  const [result, setResult] = useState<React.ReactNode>(<></>);
  useEffect(() => {
    switch (status) {
      case "product":
        setResult(
          <>
            <FlexChild width={"max-content"} paddingRight={10}>
              <Button
                styleType="admin"
                onClick={() => {
                  const selected = table.current.getData();
                  if (selected?.length > 0) {
                    NiceModal.show("confirm", {
                      message: (
                        <VerticalFlex>
                          <P>
                            {`${selected?.length}개의 주문서를 취소 처리하시겠습니까?`}
                          </P>
                          <P>다운로드시 주문서가 주문 취소로 이동합니다.</P>
                        </VerticalFlex>
                      ),
                      confirmText: "취소처리",
                      cancelText: "닫기",
                      onConfirm: () => {
                        adminRequester.cancelOrders(
                          {
                            id: selected.map((order: OrderData) => order.id),
                          },
                          () => {
                            table.current.research();
                          }
                        );
                      },
                    });
                  } else {
                    NiceModal.show("confirm", {
                      message: (
                        <VerticalFlex>
                          <P>{`${total}개의 주문서를 취소 처리하시겠습니까?`}</P>
                          <P>다운로드시 주문서가 주문 취소로 이동합니다.</P>
                        </VerticalFlex>
                      ),
                      confirmText: "취소처리",
                      cancelText: "닫기",
                      onConfirm: () => {
                        (async () => {
                          NiceModal.show("loading", {
                            ref,
                            message: "취소 진행중 0%",
                          });
                          const maxPage = table.current.getMaxPage();
                          const list: any[] = [];

                          for (let i = 0; i <= maxPage; i++) {
                            await delay(3000);
                            const data = await table.current.getPageData(i);
                            list.push(...data);
                            ref.current.setMessage(
                              `취소 진행중 ${Math.round((i / maxPage) * 100)}%`
                            );
                          }
                          adminRequester.cancelOrders(
                            {
                              id: list.map((l) => l.id),
                            },
                            () => {
                              table.current.research();
                              ref.current.close();
                            }
                          );
                        })();
                      },
                    });
                  }
                }}
              >
                <P>취소 처리</P>
              </Button>
            </FlexChild>
            <FlexChild width={"max-content"} paddingRight={10}>
              <Button
                styleType="white"
                onClick={() => {
                  const header: ExcelWritableColumn[] = [
                    {
                      text: "받는분성명",
                      code: "address",
                      Cell: ({ cell }) => cell.name,
                    },
                    {
                      text: "받는분전화번호",
                      code: "address",
                      Cell: ({ cell }) => cell.phone,
                    },
                    {
                      text: "받는분기타연락처",
                      Cell: () => "",
                    },
                    {
                      text: "받는분주소(전체, 분할)",
                      code: "address",
                      Cell: ({ cell }) =>
                        `${cell.address1} ${cell.address2} (${cell.postal_code})`,
                    },
                    {
                      text: "배송메시지1",
                      code: "address",
                      Cell: ({ cell }) => cell.message,
                    },
                    {
                      text: "고객주문번호",
                      code: "display",
                    },
                  ];
                  const style = {
                    header: {
                      alignment: { horizontal: "center" },
                      font: {
                        bold: true,
                      },
                      fill: {
                        fgColor: { rgb: "F0F0F0" },
                      },
                    },
                  };
                  const selected = table.current.getData();
                  if (selected?.length > 0) {
                    NiceModal.show("confirm", {
                      message: (
                        <VerticalFlex>
                          <P>
                            {`${selected?.length}개의 택배양식을 다운로드하시겠습니까?`}
                          </P>
                          <P>다운로드시 주문서가 배송대기로 이동합니다.</P>
                        </VerticalFlex>
                      ),
                      confirmText: "다운로드",
                      cancelText: "취소",
                      onConfirm: () => {
                        downloadExcelFile(
                          selected,
                          `택배양식_${new Date().toISOString()}`,
                          [],
                          header,
                          style,
                          async (_list) => {
                            await adminRequester.updateOrders({
                              id: _list.map((l) => l.id),
                              status: "fulfilled",
                            });
                            table.current.research();
                          }
                        );
                      },
                    });
                  } else {
                    NiceModal.show("confirm", {
                      message: (
                        <VerticalFlex>
                          <P>{`${total}개의 택배양식을 다운로드하시겠습니까?`}</P>
                          <P>다운로드시 주문서가 배송대기로 이동합니다.</P>
                        </VerticalFlex>
                      ),
                      confirmText: "다운로드",
                      cancelText: "취소",
                      onConfirm: () => {
                        (async () => {
                          NiceModal.show("loading", {
                            ref,
                            message: "다운로드 진행중 0%",
                          });
                          const maxPage = table.current.getMaxPage();
                          const list: any[] = [];

                          for (let i = 0; i <= maxPage; i++) {
                            await delay(3000);
                            const data = await table.current.getPageData(i);
                            list.push(...data);
                            ref.current.setMessage(
                              `다운로드 진행중 ${Math.round(
                                (i / maxPage) * 100
                              )}%`
                            );
                          }

                          downloadExcelFile(
                            list,
                            `택배양식_${new Date().toISOString()}`,
                            [],
                            header,
                            style,
                            async (_list) => {
                              await adminRequester.updateOrders({
                                id: _list.map((l) => l.id),
                                status: "fulfilled",
                              });
                              table.current.research();
                            }
                          );
                          ref.current.close();
                        })();
                      },
                    });
                  }
                }}
              >
                <FlexChild gap={5}>
                  <Image src={"/resources/icons/excel.png"} size={17} />
                  <P>택배양식출력</P>
                </FlexChild>
              </Button>
            </FlexChild>
            <FlexChild width={"max-content"} paddingRight={10}>
              <Button
                styleType="white"
                onClick={() => {
                  const header: ExcelWritableColumn[] = [
                    {
                      text: "주문번호",
                      code: "display",
                    },
                    {
                      text: "주문상품명",
                      code: "title",
                    },

                    {
                      text: "수량",
                      code: "quantity",
                    },
                    {
                      text: "수령인",
                      code: "name",
                    },
                  ];
                  const style = {
                    header: {
                      alignment: { horizontal: "center" },
                      font: {
                        bold: true,
                      },
                      fill: {
                        fgColor: { rgb: "F0F0F0" },
                      },
                    },
                  };
                  const selected = table.current.getData();
                  if (selected?.length > 0) {
                    NiceModal.show("confirm", {
                      message: `${selected?.length}개의 택배양식을 다운로드하시겠습니까?`,
                      confirmText: "다운로드",
                      cancelText: "취소",
                      onConfirm: () => {
                        downloadExcelFile(
                          selected
                            .map((order: OrderData) => {
                              return order.items
                                .sort((i1, i2) =>
                                  (i1?.title || "")?.localeCompare(
                                    i2?.title || ""
                                  )
                                )
                                .map((item) => ({
                                  display: order.display,
                                  title: item.title,
                                  quantity:
                                    item.extra_quantity > 0
                                      ? `${item.quantity} + ${item.extra_quantity}`
                                      : item.quantity,
                                  name: order?.address?.name,
                                }));
                            })
                            .flat(),
                          `주문서_${new Date().toISOString()}`,
                          [],
                          header,
                          style
                        );
                      },
                    });
                  } else {
                    NiceModal.show("confirm", {
                      message: `${total}개의 택배양식을 다운로드하시겠습니까?`,
                      confirmText: "다운로드",
                      cancelText: "취소",
                      onConfirm: () => {
                        (async () => {
                          NiceModal.show("loading", {
                            ref,
                            message: "다운로드 진행중 0%",
                          });
                          const maxPage = table.current.getMaxPage();
                          const list: any[] = [];
                          if (maxPage === 0)
                            list.push(...(await table.current.getPageData(0)));
                          else
                            for (let i = 0; i <= maxPage; i++) {
                              if (i !== 0) await delay(3000);
                              const data = await table.current.getPageData(i);
                              list.push(...data);
                              ref.current.setMessage(
                                `다운로드 진행중 ${Math.round(
                                  (i / maxPage) * 100
                                )}%`
                              );
                            }

                          downloadExcelFile(
                            list
                              .map((order: OrderData) => {
                                return order.items
                                  .sort((i1, i2) =>
                                    (i1?.title || "")?.localeCompare(
                                      i2?.title || ""
                                    )
                                  )
                                  .map((item) => ({
                                    display: order.display,
                                    title: item.title,
                                    quantity:
                                      item.extra_quantity > 0
                                        ? `${item.quantity} + ${item.extra_quantity}`
                                        : item.quantity,
                                    name: order?.address?.name,
                                  }));
                              })
                              .flat(),
                            `주문서_${new Date().toISOString()}`,
                            [],
                            header,
                            style
                          );
                          ref.current.close();
                        })();
                      },
                    });
                  }
                }}
              >
                <FlexChild gap={5}>
                  <Image src={"/resources/icons/excel.png"} size={17} />
                  <P>주문서 엑셀</P>
                </FlexChild>
              </Button>
            </FlexChild>
          </>
        );
        break;
      case "ready":
        setResult(
          <>
            <FlexChild width={"max-content"} paddingRight={10}>
              <Button
                styleType="admin"
                onClick={() => {
                  const selected = table.current.getData();
                  if (selected?.length > 0) {
                    NiceModal.show("confirm", {
                      message: (
                        <VerticalFlex>
                          <P>
                            {`${selected?.length}개의 주문서를 취소 처리하시겠습니까?`}
                          </P>
                          <P>다운로드시 주문서가 주문 취소로 이동합니다.</P>
                        </VerticalFlex>
                      ),
                      confirmText: "취소처리",
                      cancelText: "닫기",
                      onConfirm: () => {
                        adminRequester.cancelOrders(
                          {
                            id: selected.map((order: OrderData) => order.id),
                          },
                          () => {
                            table.current.research();
                          }
                        );
                      },
                    });
                  } else {
                    NiceModal.show("confirm", {
                      message: (
                        <VerticalFlex>
                          <P>{`${total}개의 주문서를 취소 처리하시겠습니까?`}</P>
                          <P>다운로드시 주문서가 주문 취소로 이동합니다.</P>
                        </VerticalFlex>
                      ),
                      confirmText: "취소처리",
                      cancelText: "닫기",
                      onConfirm: () => {
                        (async () => {
                          NiceModal.show("loading", {
                            ref,
                            message: "취소 진행중 0%",
                          });
                          const maxPage = table.current.getMaxPage();
                          const list: any[] = [];

                          for (let i = 0; i <= maxPage; i++) {
                            await delay(3000);
                            const data = await table.current.getPageData(i);
                            list.push(...data);
                            ref.current.setMessage(
                              `취소 진행중 ${Math.round((i / maxPage) * 100)}%`
                            );
                          }
                          adminRequester.cancelOrders(
                            {
                              id: list.map((l) => l.id),
                            },
                            () => {
                              table.current.research();
                              ref.current.close();
                            }
                          );
                        })();
                      },
                    });
                  }
                }}
              >
                <P>취소 처리</P>
              </Button>
            </FlexChild>
            <FlexChild width={"max-content"} paddingRight={10}>
              <Button
                styleType="white"
                type="file"
                onFileChange={async (e) => {
                  const file = e?.target?.files?.[0];
                  if (file) {
                    switch (file.type) {
                      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                      case "text/csv": {
                        const header = [
                          { code: "고객주문번호", attr: "display" },
                          { code: "운송장번호", attr: "tracking_number" },
                        ];
                        const list = await readExcelFile(
                          file,
                          (Array.isArray(header) ? header : [header]) || []
                        );

                        await adminRequester.updateOrders(
                          list.filter((f) => !!f.display && !!f.tracking_number)
                        );
                        table.current.research();
                        toast({
                          message: "정보가 성공적으로 업데이트되었습니다.",
                        });
                        break;
                      }
                      default: {
                        toast({
                          message: `${file.type}은 형식에 맞지 않는 데이터입니다.`,
                        });
                        break;
                      }
                    }

                    e.target.value = "";
                  }
                }}
              >
                <FlexChild gap={5}>
                  <Image src={"/resources/icons/excel.png"} size={17} />
                  <P>송장 일괄업로드</P>
                </FlexChild>
              </Button>
            </FlexChild>
            <FlexChild width={"max-content"} paddingRight={10}>
              <Button
                styleType="white"
                onClick={() => {
                  const header: ExcelWritableColumn[] = [
                    {
                      text: "주문번호",
                      code: "display",
                    },
                    {
                      text: "주문상품명",
                      code: "title",
                    },

                    {
                      text: "수량",
                      code: "quantity",
                    },
                    {
                      text: "수령인",
                      code: "name",
                    },
                  ];
                  const style = {
                    header: {
                      alignment: { horizontal: "center" },
                      font: {
                        bold: true,
                      },
                      fill: {
                        fgColor: { rgb: "F0F0F0" },
                      },
                    },
                  };
                  const selected = table.current.getData();
                  if (selected?.length > 0) {
                    NiceModal.show("confirm", {
                      message: `${selected?.length}개의 택배양식을 다운로드하시겠습니까?`,
                      confirmText: "다운로드",
                      cancelText: "취소",
                      onConfirm: () => {
                        downloadExcelFile(
                          selected
                            .map((order: OrderData) => {
                              return order.items
                                .sort((i1, i2) =>
                                  (i1?.title || "")?.localeCompare(
                                    i2?.title || ""
                                  )
                                )
                                .map((item) => ({
                                  display: order.display,
                                  title: item.title,
                                  quantity:
                                    item.extra_quantity > 0
                                      ? `${item.quantity} + ${item.extra_quantity}`
                                      : item.quantity,
                                  name: order?.address?.name,
                                }));
                            })
                            .flat(),
                          `주문서_${new Date().toISOString()}`,
                          [],
                          header,
                          style
                        );
                      },
                    });
                  } else {
                    NiceModal.show("confirm", {
                      message: `${total}개의 택배양식을 다운로드하시겠습니까?`,
                      confirmText: "다운로드",
                      cancelText: "취소",
                      onConfirm: () => {
                        (async () => {
                          NiceModal.show("loading", {
                            ref,
                            message: "다운로드 진행중 0%",
                          });
                          const maxPage = table.current.getMaxPage();
                          const list: any[] = [];
                          if (maxPage === 0)
                            list.push(...(await table.current.getPageData(0)));
                          else
                            for (let i = 0; i <= maxPage; i++) {
                              if (i !== 0) await delay(3000);
                              const data = await table.current.getPageData(i);
                              list.push(...data);
                              ref.current.setMessage(
                                `다운로드 진행중 ${Math.round(
                                  (i / maxPage) * 100
                                )}%`
                              );
                            }

                          downloadExcelFile(
                            list
                              .map((order: OrderData) => {
                                return order.items
                                  .sort((i1, i2) =>
                                    (i1?.title || "")?.localeCompare(
                                      i2?.title || ""
                                    )
                                  )
                                  .map((item) => ({
                                    display: order.display,
                                    title: item.title,
                                    quantity:
                                      item.extra_quantity > 0
                                        ? `${item.quantity} + ${item.extra_quantity}`
                                        : item.quantity,
                                    name: order?.address?.name,
                                  }));
                              })
                              .flat(),
                            `주문서_${new Date().toISOString()}`,
                            [],
                            header,
                            style
                          );
                          ref.current.close();
                        })();
                      },
                    });
                  }
                }}
              >
                <FlexChild gap={5}>
                  <Image src={"/resources/icons/excel.png"} size={17} />
                  <P>주문서 엑셀</P>
                </FlexChild>
              </Button>
            </FlexChild>
          </>
        );
        break;
    }
  }, [status]);

  return <>{result}</>;
}
