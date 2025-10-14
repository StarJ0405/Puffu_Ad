"use client";

import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
import Div from "@/components/div/Div";
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
import { toast } from "@/shared/utils/Functions";
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
      label: "썸네일",
      Cell: ({ row }) => (
        <Tooltip
          disable={!row.thumbnail && !row.product.thumbnail}
          content={
            <Div backgroundColor="white" border={"0.5px solid #c0c0c0"}>
              <Image
                src={row.thumbnail || row.product.thumbnail}
                size={"min(30vw,30vh)"}
              />
            </Div>
          }
        >
          <Image
            src={row.thumbnail || row.product.thumbnail}
            size={90}
            padding={10}
          />
        </Tooltip>
      ),
      styling: {
        common: {
          style: {
            width: 90,
          },
        },
      },
    },
    {
      label: "상품명",
      Cell: ({ row }) => (
        <FlexChild width={300}>
          <P
            width={300}
            whiteSpace="break-spaces"
            textOverflow="clip"
            overflow="visible"
          >
            {row.title
              ? `${row.product.title} / ${row.title}`
              : `${row.product.title}`}
          </P>
        </FlexChild>
      ),
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
      label: "판매가",
      code: "discount_price",
      Cell: ({ cell, row }) => (
        <P>
          <Span>{cell}</Span>
          <Span>{row?.store?.currency_unit}</Span>
          {row.discount_rate !== 0 && (
            <>
              <Span
                paddingLeft={"0.5em"}
                color="#d9d9d9"
                textDecorationLine="line-through"
              >
                {row.price}
              </Span>
              <Span color="#d9d9d9" textDecorationLine="line-through">
                {row?.store?.currency_unit}
              </Span>
            </>
          )}
        </P>
      ),
    },
    {
      label: "옵션상태",
      Cell: ({ row }) =>
        `${row.buyable && row.product.buyable ? "판매중" : "구매불가"} / ${
          row.visible && row.product.visible ? "전시중" : "비전시중"
        }`,
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
      label: "재고수량",
      code: "stack",
    },
    // {
    //   label: "입고처리",
    //   Cell: ({ row }) => (
    //     <input
    //       type="checkbox"
    //       checked={!!row.warehousing}
    //       onClick={(e) => e.stopPropagation()}
    //       onChange={async (e) => {
    //         const warehousing = e.target.checked;
    //         await adminRequester.updateVaraint(
    //           row.id,
    //           {
    //             warehousing,
    //           },
    //           () => {
    //             table.current.research();
    //             toast({
    //               message: warehousing ? "입고예정으로 전환" : "입고 해제",
    //             });
    //           }
    //         );
    //       }}
    //     />
    //   ),
    //   styling: {
    //     common: {
    //       style: { width: 110, minWidth: 110 },
    //     },
    //   },
    // },
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
  const onSearchClick = () => {
    const data: any = {};
    const q = input.current.getValue();
    if (q) data.q = q;
    if (store) data.product = { store_id: store };
    table.current.setCondition(data);
  };
  const onResetClick = () => {
    input.current.empty();
    table.current.reset();
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
            NiceModal.show("productDetail", { product: row });
          },
        },
        {
          label: "편집",
          hotKey: "e",
          onClick: () => {
            NiceModal.show("variantDetail", {
              variant: row,
              edit: true,
              type:
                row.product.options?.legnth > 0
                  ? "multiple"
                  : row.product.variants.length > 1 ||
                    row.product.variants.some((v: VariantData) => !!v.title)
                  ? "simple"
                  : "single",
              options: row.product.options,
              onSuccess: () => table.current.research(),
            });
          },
        },
        {
          label: "재고수정",
          hotKey: "a",
          onClick: () =>
            NiceModal.show("input", {
              message: `${
                row.title
                  ? `${row.product.title} / ${row.title}`
                  : `${row.product.title}`
              }의 재고 수정`,
              input: [
                {
                  value: row.stack,
                  placeHolder: `기존 재고수 : ${row.stack || 0}`,
                },
              ],
              confirmText: "변경",
              cancelText: "취소",
              onConfirm: (value: any) => {
                adminRequester.updateVaraint(
                  row.id,
                  {
                    stack: value,
                  },
                  () => {
                    table.current.research();
                  }
                );
              },
            }),
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
                await adminRequester.deleteProduct(row.id);
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
    NiceModal.show("productDetail", { product: row });
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
          name="products"
          columns={columns}
          initCondition={initCondition}
          initLimit={20}
          initData={initData}
          onSearch={(condition) => {
            return adminRequester.getVariants(condition);
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
