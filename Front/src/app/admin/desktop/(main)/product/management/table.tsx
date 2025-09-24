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
      label: "옵션종류",
      Cell: ({ row }) => {
        if (row?.options?.length > 0) return "멀티옵션";
        if (row?.variants?.length === 1) return "단일 옵션";
        else if (row?.variants?.length > 1) return "단순옵션";
        return "오류";
      },
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
      label: "썸네일",
      code: "thumbnail",
      Cell: ({ cell }) => (
        <Tooltip
          disable={!cell}
          content={
            <Div backgroundColor="white" border={"0.5px solid #c0c0c0"}>
              <Image src={cell} size={"min(30vw,30vh)"} />
            </Div>
          }
        >
          <Image src={cell} size={60} />
        </Tooltip>
      ),
      styling: {
        common: {
          style: {
            width: 60,
          },
        },
      },
    },
    {
      label: "상품명",
      code: "title",
      Cell: ({ cell }) => (
        <FlexChild width={300}>
          <P
            width={300}
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
          {cell !== row.price && (
            <>
              <Span> </Span>
              <Span color="#d9d9d9" textDecorationLine="line-through">
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
      label: "상품상태",
      Cell: ({ row }) =>
        `${row.buyable ? "판매중" : "구매불가"} / ${
          row.visible ? "전시중" : "비전시중"
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
      label: "옵션명",
      code: "variants",
      Cell: ({ cell, row }) => {
        if (row?.options?.length > 0) {
          return (
            <VerticalFlex>
              {cell?.map((variant: VariantData) => (
                <FlexChild key={variant.id}>
                  <P>
                    {/* <Span paddingRight={2}>
                      [
                      {variant.values
                        .sort((v1, v2) =>
                          v1.option_id.localeCompare(v2.option_id)
                        )
                        .map((value) => value.value)
                        .join(", ")}
                      ]
                    </Span> */}
                    <Span>{variant.title}</Span>
                  </P>
                </FlexChild>
              ))}
            </VerticalFlex>
          );
        }
        if (cell?.length > 1) {
          return (
            <VerticalFlex>
              {cell?.map((variant: VariantData) => (
                <FlexChild key={variant.id}>
                  <P>{variant.title}</P>
                </FlexChild>
              ))}
            </VerticalFlex>
          );
        } else if (cell.length === 1) {
          return "단일 옵션";
        }

        return "오류";
      },
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
      label: "옵션가",
      code: "variants",
      Cell: ({ cell, row }) => {
        if (row?.options?.length > 0) {
          return (
            <VerticalFlex>
              {cell?.map((variant: VariantData) => (
                <FlexChild key={variant.id}>
                  <P>
                    <Span>{variant.discount_price}</Span>
                    <Span>{row?.store?.currency_unit}</Span>

                    {variant.price !== variant.discount_price && (
                      <>
                        <Span> </Span>
                        <Span color="#d9d9d9" textDecorationLine="line-through">
                          {variant.price}
                        </Span>
                        <Span color="#d9d9d9" textDecorationLine="line-through">
                          {row?.store?.currency_unit}
                        </Span>
                      </>
                    )}
                  </P>
                </FlexChild>
              ))}
            </VerticalFlex>
          );
        }
        if (cell?.length > 1) {
          return (
            <VerticalFlex>
              {cell?.map((variant: VariantData) => (
                <FlexChild key={variant.id}>
                  <P>
                    <Span>{variant.price}</Span>
                    <Span>{row?.store?.currency_unit}</Span>
                    {variant.price !== variant.discount_price && (
                      <>
                        <Span> </Span>
                        <Span color="#d9d9d9" textDecorationLine="line-through">
                          {variant.price}
                        </Span>
                        <Span color="#d9d9d9" textDecorationLine="line-through">
                          {row?.store?.currency_unit}
                        </Span>
                      </>
                    )}
                  </P>
                </FlexChild>
              ))}
            </VerticalFlex>
          );
        } else if (cell.length === 1) {
          return "단일 옵션";
        }

        return "오류";
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
  const [total, setTotal] = useState(initData.NumberOfTotalElements);
  const table = useRef<any>(null);
  const input = useRef<any>(null);
  const onSearchClick = () => {
    const data: any = {};
    const q = input.current.getValue();
    if (q) data.q = q;
    if (store) data.store_id = store;
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
            NiceModal.show("productDetail", {
              product: row,
              edit: true,
              onSuccess: () => table.current.research(),
            });
          },
        },
        {
          label: "옵션 수정",
          hotKey: "v",
          onClick: () =>
            NiceModal.show("variantList", {
              product: row,
              onSuccess: () => table.current.research(),
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
            return adminRequester.getProducts(condition);
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
