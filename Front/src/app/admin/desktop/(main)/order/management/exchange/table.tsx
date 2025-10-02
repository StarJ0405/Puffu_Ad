"use client";

import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Table, { Column } from "@/components/table/Table";
import Tooltip from "@/components/tooltip/Tooltip";
import { RowInterface } from "@/modals/context/ContextMenuModal";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import { openTrackingNumber, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import styles from "./page.module.css";
export default function ({
  initCondition,
  initData,
  initStores,
}: {
  initCondition: any;
  initData: Pageable;
  initStores: any;
}) {
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
  const [total, setTotal] = useState(initData.NumberOfTotalElements);
  const [status, setStatus] = useState<"all" | "not" | "completed" | "cancel">(
    "not"
  );
  const [columns, setColumns] = useState<Column[]>(getColumns(status));
  const table = useRef<any>(null);
  const input = useRef<any>(null);
  const onSearchClick = () => {
    const data: any = { ...initCondition };
    const q = input.current.getValue();
    if (q) data.q = q;

    if (store) data.store_id = store;
    switch (status) {
      case "not":
        data.completed_at = null;
        data.deleted_at = null;
        break;
      case "completed":
        data.completed_at = new Date();
        data.deleted_at = null;
        break;
      // case "cancel":
      //   data.deleted_at = new Date();
      //   delete data.completed_at;
      //   break;
      case "all":
        delete data.deleted_at;
        delete data.completed_at;
        break;
    }
    setColumns(getColumns(status));
    table.current.setCondition(data, false);
  };
  const onResetClick = () => {
    input.current.empty();
    setStore("");
    setStatus("not");
    setColumns(getColumns("not"));
    table.current.reset();
  };
  const ContextMenu = ({
    x,
    y,
    row,
  }: {
    x: number;
    y: number;
    row?: ExchangeData;
  }) => {
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
      rows.push({
        label: "상세보기",
        hotKey: "i",
        onClick: () => {
          NiceModal.show("exchangeDetail", {
            exchange: row,
            onSuccess: () => table.current.research(),
          });
        },
      });
      if (!row.completed_at && !row.deleted_at) {
        rows.push(
          {
            label: "편집",
            hotKey: "e",
            onClick: () => {
              NiceModal.show("exchangeDetail", {
                exchange: row,
                edit: true,
                onSuccess: () => table.current.research(),
              });
            },
          },
          {
            label: "철회",
            hotKey: "d",
            onClick: () =>
              NiceModal.show("confirm", {
                message: (
                  <VerticalFlex>
                    <P>교환 신청을 철회하시겠습니까?</P>
                    <P>수정이 필요한 경우 반드시 [편집 기능]을 이용해주세요</P>
                  </VerticalFlex>
                ),
                confirmText: "철회",
                cancelText: "그만두기",
                onConfirm: () =>
                  adminRequester.cancelExchange(row.id, {}, () => {
                    table.current.research();
                  }),
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
    NiceModal.show("exchangeDetail", {
      exchange: row,
      onSuccess: () => table.current.research(),
    });
  };

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
                <FlexChild borderBottom={"1px solid #e9e9e9"}>
                  <RadioGroup
                    name="status"
                    value={status}
                    onValueChange={(value) => setStatus(value as any)}
                  >
                    <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                      <FlexChild
                        width={"10%"}
                        backgroundColor={"var(--admin-table-bg-color)"}
                      >
                        <div className={styles.titleWrap}>
                          <Center>
                            <P size={16} weight={"bold"}>
                              상태
                            </P>
                          </Center>
                        </div>
                      </FlexChild>
                      <FlexChild>
                        <HorizontalFlex justifyContent="flex-start" gap={12}>
                          <FlexChild gap={6} width={"max-content"}>
                            <RadioChild id="all" />
                            <P>전체</P>
                          </FlexChild>
                          <FlexChild gap={6} width={"max-content"}>
                            <RadioChild id="not" />
                            <P>진행중</P>
                          </FlexChild>
                          <FlexChild gap={6} width={"max-content"}>
                            <RadioChild id="completed" />
                            <P>완료</P>
                          </FlexChild>
                          {/* <FlexChild gap={6} width={"max-content"}>
                            <RadioChild id="cancel" />
                            <P>철회</P>
                          </FlexChild> */}
                        </HorizontalFlex>
                      </FlexChild>
                    </HorizontalFlex>
                  </RadioGroup>
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
            return adminRequester.getExchanges(condition);
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

function getColumns(status: string) {
  let columns: Column[] = [
    {
      label: "주문번호",
      code: "order",
      styling: {
        common: {
          style: {
            width: 130,
            minWidth: 130,
          },
        },
      },
      Cell: ({ cell }) => cell.display,
    },
    {
      label: "주문자",
      code: "order",
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
                <P>{cell.user.name}</P>
              </FlexChild>
              <FlexChild>
                <P width={80}>아이디</P>
                <P>{cell.user.username}</P>
              </FlexChild>
              <FlexChild>
                <P width={80}>전화번호</P>
                <P>{cell.user.phone}</P>
              </FlexChild>
            </VerticalFlex>
          }
        >
          <P width={60}>{cell.user.name}</P>
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
      label: "상태",
      Cell: ({ row }) =>
        row.completed_at
          ? "완료"
          : row?.tracking_number
          ? row.pickup_at
            ? "배송중"
            : "배송대기"
          : "진행중",
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
      label: "상품",
      code: "items",
      Cell: ({ cell }) => (
        <VerticalFlex gap={10}>
          {cell
            ?.sort((i1: ExchangeItemData, i2: ExchangeItemData) =>
              String(
                `${i1.item?.brand_id} ${i1.item?.product_title} ${new Date(
                  i1.created_at
                ).getTime()}`
              ).localeCompare(
                String(
                  `${i2.item?.brand_id} ${i2.item?.product_title} ${new Date(
                    i2.created_at
                  ).getTime()}`
                )
              )
            )
            ?.map((item: ExchangeItemData) => (
              <FlexChild key={item.id}>
                <VerticalFlex>
                  <FlexChild>
                    <Tooltip
                      position="right"
                      content={
                        <Image
                          src={item.item?.thumbnail}
                          size={"min(30vw,30vh)"}
                        />
                      }
                    >
                      <Image src={item.item?.thumbnail} size={50} />
                    </Tooltip>
                    <P
                      width={"max-content"}
                      textOverflow="clip"
                      overflow="visible"
                    >
                      ({item.item?.brand?.name})
                    </P>
                    <P whiteSpace="wrap">{item.item?.title}</P>
                    <P
                      width={"max-content"}
                      textOverflow="clip"
                      overflow="visible"
                    >{`X ${item.quantity}`}</P>
                  </FlexChild>

                  {item?.swaps?.map((swap) => (
                    <FlexChild key={swap.id}>
                      <Image
                        src="/resources/images/bottom-right-arrow.png"
                        size={50}
                      />
                      <Tooltip
                        position="right"
                        content={
                          <Image src={swap.thumbnail} size={"min(30vw,30vh)"} />
                        }
                      >
                        <Image src={swap?.thumbnail} size={50} />
                      </Tooltip>
                      <P
                        width={"max-content"}
                        textOverflow="clip"
                        overflow="visible"
                      >
                        ({swap?.brand?.name})
                      </P>
                      <P whiteSpace="wrap">{swap?.title}</P>
                      <P
                        width={"max-content"}
                        textOverflow="clip"
                        overflow="visible"
                      >{`X ${swap.quantity}`}</P>
                    </FlexChild>
                  ))}
                </VerticalFlex>
              </FlexChild>
            ))}
        </VerticalFlex>
      ),
    },
    {
      label: "운송장번호",
      code: "tracking_number",
      Cell: ({ cell }) =>
        cell ? (
          <P
            cursor="pointer"
            width={200}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              openTrackingNumber(cell);
            }}
          >
            {cell}
          </P>
        ) : (
          "없음"
        ),
      styling: {
        common: {
          style: {
            width: 200,
            minWidth: 200,
          },
        },
      },
    },
  ];

  return columns;
}
