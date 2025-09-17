"use client";

import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Table, { Column } from "@/components/table/Table";
import { RowInterface } from "@/modals/context/ContextMenuModal";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import { dateToString, toast } from "@/shared/utils/Functions";
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
  const columns: Column[] = [
    {
      label: "스토어",
      code: "store",
      Cell: ({ cell }) => cell?.name || "오류",
      styling: {
        common: {
          style: {
            width: 120,
            minWidth: 120,
          },
        },
      },
    },
    {
      label: "타입",
      code: "type",
      Cell: ({ cell }) => (
        <FlexChild>
          <P
            width={100}
            whiteSpace="break-spaces"
            textOverflow="clip"
            overflow="visible"
          >
            {cell}
          </P>
        </FlexChild>
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
      label: "제목",
      code: "title",
      // Cell: ({ cell }) => (
      //   <FlexChild>
      //     <P
      //       width={300}
      //       whiteSpace="break-spaces"
      //       textOverflow="clip"
      //       overflow="visible"
      //     >
      //       {cell}
      //     </P>
      //   </FlexChild>
      // ),
      // styling: {
      //   common: {
      //     style: {
      //       width: 300,
      //       minWidth: 300,
      //     },
      //   },
      // },
    },
    {
      label: "기간설정",
      Cell: ({ row }) =>
        row?.starts_at && row?.ends_at
          ? `${dateToString(row.starts_at)} ~ ${dateToString(row.ends_at)}`
          : "무제한",
      styling: {
        common: {
          style: {
            width: 300,
            minWidth: 300,
          },
        },
      },
    },
    {
      label: "공개 상태",
      code: "visible",
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
      onReprocessing: (data) => data?.content,
      fallbackData: initStores,
    }
  );
  const [store, setStore] = useState<string>("");
  const [total, setTotal] = useState(initData.NumberOfTotalElements);
  const table = useRef<any>(null);
  const input = useRef<any>(null);
  const [type, setType] = useState<"전체" | "일반" | "이벤트">("전체");
  const onSearchClick = () => {
    const data: any = {};
    const q = input.current.getValue();
    if (q) data.q = q;
    if (store) data.store_id = store;
    if (type !== "전체") data.type = type;
    table.current.setCondition(data);
  };
  const onResetClick = () => {
    input.current.empty();
    table.current.reset();
    setType("전체");
    setStore("");
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
            NiceModal.show("noticeDetail", { notice: row });
          },
        },
        {
          label: "편집",
          hotKey: "e",
          onClick: () => {
            NiceModal.show("noticeDetail", {
              notice: row,
              edit: true,
              onSuccess: () => table.current.research(),
            });
          },
        },
        {
          label: "삭제",
          hotKey: "d",
          onClick: () => {
            NiceModal.show("confirm", {
              confirmText: "삭제",
              cancelText: "취소",
              message: `${row.title} 을 삭제하시겠습니까?`,
              onConfirm: async () => {
                await adminRequester.deleteNotice(row.id);
                table.current.research();
              },
              admin: true,
            });
          },
        }
      );
    }
    return { x, y, rows };
  };
  const onDetailClick = (e: React.MouseEvent, row: any) => {
    e.preventDefault();
    e.stopPropagation();
    NiceModal.show("noticeDetail", { notice: row });
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
                    name="type"
                    value={type}
                    onValueChange={(value) => setType(value as any)}
                  >
                    <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                      <FlexChild
                        width={"10%"}
                        backgroundColor={"var(--admin-table-bg-color)"}
                      >
                        <div className={styles.titleWrap}>
                          <Center>
                            <P size={16} weight={"bold"}>
                              타입
                            </P>
                          </Center>
                        </div>
                      </FlexChild>
                      <FlexChild>
                        <HorizontalFlex justifyContent="flex-start" gap={14}>
                          {["전체", "일반", "이벤트"].map((str) => (
                            <FlexChild key={str} width={"max-content"} gap={5}>
                              <RadioChild id={str} />
                              <P>{str}</P>
                            </FlexChild>
                          ))}
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
          <FlexChild></FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild>
        <Table
          indexing={false}
          ref={table}
          onRowClick={(e, row) => onDetailClick(e, row)}
          name="notices"
          columns={columns}
          initCondition={initCondition}
          initLimit={20}
          initData={initData}
          onSearch={(condition) => {
            return adminRequester.getNotices(condition);
          }}
          onMaxPage={(data) => {
            return Number(data?.totalPages);
          }}
          onReprocessing={(data) => data.content}
          onChange={({ origin }) => setTotal(origin.NumberOfTotalElements)}
          ContextMenu={ContextMenu}
        />
      </FlexChild>
    </VerticalFlex>
  );
}
