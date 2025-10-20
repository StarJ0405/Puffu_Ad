"use client";

import Button from "@/components/buttons/Button";
import Center from "@/components/center/Center";
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
export const getCouponDate = (
  coupon: CouponData,
  node: boolean = false
): string | React.ReactNode => {
  switch (coupon.date) {
    case "fixed": {
      return node ? (
        <VerticalFlex>
          <P>{dateToString(coupon.starts_at || new Date())}</P>
          <P>~</P>
          <P>{dateToString(coupon.ends_at || new Date())}</P>
        </VerticalFlex>
      ) : (
        `${dateToString(coupon.starts_at || new Date())} ~ ${dateToString(
          coupon.ends_at || new Date()
        )}`
      );
    }
    case "range":
      switch (coupon.date_unit) {
        case "date":
          return `${coupon.range}일`;
        case "hours":
          return `${coupon.range}시간`;
        case "month":
          return `${coupon.range}개월`;
        case "year":
          return `${coupon.range}년`;
      }
    case "day":
      return "당일";
    case "month":
      return "당월";
    case "week":
      return "해당 주";
    case "year":
      return "해당 년도";
  }
  return "알 수 없는 오류";
};
export const getCouponTarget = (target: Target, coupon: CouponData) => {
  switch (target) {
    case "manual":
      return "수동발급";
    case "condition":
      switch (coupon.condition) {
        case "signup":
          return "조건부 발급[회원가입]";
        case "birthday":
          return "조건부 발급[생일]";
        case "date":
          return "조건부 발급[특정기념일]";
        case "review":
          return "조건부 발급[리뷰 작성]";
        case "delivery":
          return "조건부 발급[배송 완료]";
        case "order":
          return "조건부 발급[주문 완료]";
        case "first":
          return "조건부 발급[회원가입 후 첫 구매]";
        case "purchase":
          return "조건부 발급[구매 수량 충족시]";

        default:
          return "조건부 발급";
      }
    case "interval":
      return "정규자동발급";
    case "link":
      return "고객 다운로드 발급";
  }
  return "알 수 없음";
};
export const getCouponType = (type: CouponType) => {
  switch (type) {
    case "order":
      return "주문서 할인";
    case "shipping":
      return "배송비 할인";
    case "item":
      return "상품 할인";
  }
};
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
      label: "발급구분",
      code: "target",
      Cell: ({ cell, row }) => getCouponTarget(cell, row),
      styling: {
        common: {
          style: {
            width: 200,
            minWidth: 200,
          },
        },
      },
    },
    {
      label: "쿠폰명",
      code: "name",
      Cell: ({ cell }) => (
        <FlexChild>
          <P
            width={200}
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
            width: 200,
            minWidth: 200,
          },
        },
      },
    },
    {
      label: "사용기간",
      Cell: ({ row }) => getCouponDate(row),
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
      label: "발급수",
      code: "quantity",
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
      label: "상태",
      Cell: ({ row }) =>
        row.deleted_at
          ? "삭제(발급 불가)"
          : row.ends_at &&
            new Date(row.ends_at).getTime() < new Date().getTime()
          ? "만료(발급 불가)"
          : "발급중",
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
      label: "적용 범위",
      code: "type",
      Cell: ({ cell }) => getCouponType(cell),
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
      label: "할인",
      code: "value",
      Cell: ({ cell, row }) =>
        `${Number(cell).toLocaleString("ko-kr")}${
          row.calc === "percent" ? "%" : "원"
        }`,
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
  const [target, setTarget] = useState<string>("all");
  const [condition, setCondition] = useState<string>("all");
  const [scope, setScope] = useState<string>("all");
  const [deleted, setDeleted] = useState<string>("not_deleted");
  const table = useRef<any>(null);
  const input = useRef<any>(null);
  const onSearchClick = () => {
    const data: any = {};
    const q = input.current.getValue();
    if (q) data.q = q;
    if (store) data.store_id = store;
    if (target !== "all") data.target = target;
    if (target === "condition" && condition !== "all")
      data.condition = condition;
    if (deleted === "deleted") data.deleted_at = true;
    else if (deleted === "not_deleted") data.deleted_at = false;
    if (scope !== "all") data.type = scope;
    table.current.setCondition(data);
  };
  const onResetClick = () => {
    input.current.empty();
    table.current.reset();
    setStore("");
    setTarget("all");
    setCondition("all");
    setScope("all");
    setDeleted("all");
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
            NiceModal.show("couponDetail", { coupon: row });
          },
        },
        {
          label: "규칙 수정",
          hotKey: "v",
          onClick: () => {
            NiceModal.show("couponOptionList", {
              coupon: row,
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
              message: `[${row.name}] 을 삭제하시겠습니까?`,
              onConfirm: async () => {
                await adminRequester.deleteCoupon(row.id);
                table.current.research();
              },
              admin: true,
            });
          },
        }
      );
      if (
        row.target === "manual" &&
        row.deleted_at === null &&
        (!row.ends_at || new Date(row.ends_at).getTime() > new Date().getTime())
      )
        rows.push({
          label: "발급하기",
          hotKey: "g",
          onClick: () =>
            NiceModal.show("couponIssue", {
              message: `[${row.name}] 발급할 회원/조건 선택`,
              confirmText: "발급하기",
              cancelText: "취소",
              onConfirm: async (data: any) => {
                const limit = 3;
                if (data.users) {
                  const users = data.users;
                  if (users.length > limit) {
                    const max = Math.ceil(users.length / limit);
                    await Promise.all(
                      Array.from({ length: max }).map(
                        async (_, page) =>
                          await adminRequester.giveCoupon(row.id, {
                            ...data,
                            users: users.slice(
                              page * 100,
                              Math.min((page + 1) * 100, users.length)
                            ),
                          })
                      )
                    );
                    return table.current.research();
                  }
                }
                await adminRequester.giveCoupon(row.id, data);
                return table.current.research();
              },
            }),
        });
    }
    return { x, y, rows };
  };
  const onDetailClick = (e: React.MouseEvent, row: any) => {
    e.preventDefault();
    e.stopPropagation();
    NiceModal.show("couponDetail", { coupon: row });
  };
  return (
    <VerticalFlex>
      <FlexChild>
        <div className={styles.search_ontainer}>
          <VerticalFlex>
            <FlexChild>
              <VerticalFlex>
                <FlexChild
                  borderBottom={"1px solid #e9e9e9"}
                  hidden={stores.length === 1}
                >
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
                        classNames={{ header: styles.selection }}
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
                        width={600}
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
                  <HorizontalFlex>
                    <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                      <FlexChild
                        width={"20%"}
                        backgroundColor={"var(--admin-table-bg-color)"}
                      >
                        <div className={styles.titleWrap}>
                          <Center>
                            <P size={16} weight={"bold"}>
                              발급구분
                            </P>
                          </Center>
                        </div>
                      </FlexChild>
                      <FlexChild>
                        <Select
                          value={target}
                          onChange={(value) => {
                            setTarget(value as string);
                            setCondition("all");
                          }}
                          classNames={{ header: styles.selection }}
                          options={[
                            {
                              display: "전체",
                              value: "all",
                            },
                            {
                              display: "수동발급",
                              value: "manual",
                            },
                            {
                              display: "조건부 발급",
                              value: "condition",
                            },
                            {
                              display: "고객 다운로드 발급",
                              value: "link",
                            },
                            {
                              display: "정규자동발급",
                              value: "interval",
                            },
                          ]}
                        />
                      </FlexChild>
                    </HorizontalFlex>
                    <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                      <FlexChild
                        hidden={target !== "condition"}
                        width={"20%"}
                        backgroundColor={"var(--admin-table-bg-color)"}
                      >
                        <div className={styles.titleWrap}>
                          <Center>
                            <P size={16} weight={"bold"}>
                              조건
                            </P>
                          </Center>
                        </div>
                      </FlexChild>
                      <FlexChild hidden={target !== "condition"}>
                        <Select
                          value={condition}
                          onChange={(value) => setCondition(value as string)}
                          classNames={{ header: styles.selection }}
                          options={[
                            {
                              display: "전체",
                              value: "all",
                            },
                            {
                              display: "회원 가입",
                              value: "signup",
                            },
                            {
                              display: "생일",
                              value: "birthday",
                            },
                            {
                              display: "특정 기념일",
                              value: "date",
                            },
                            {
                              display: "리뷰 작성",
                              value: "review",
                            },
                            {
                              display: "배송 완료",
                              value: "delivery",
                            },
                            {
                              display: "주문 완료",
                              value: "order",
                            },
                            {
                              display: "회원가입 후 첫 구매",
                              value: "first",
                            },
                            {
                              display: "구매 수량 충족시",
                              value: "purchase",
                            },
                          ]}
                        />
                      </FlexChild>
                    </HorizontalFlex>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild borderBottom={"1px solid #e9e9e9"}>
                  <HorizontalFlex>
                    <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                      <FlexChild
                        width={"20%"}
                        backgroundColor={"var(--admin-table-bg-color)"}
                      >
                        <div className={styles.titleWrap}>
                          <Center>
                            <P size={16} weight={"bold"}>
                              적용범위
                            </P>
                          </Center>
                        </div>
                      </FlexChild>
                      <FlexChild>
                        <Select
                          value={scope}
                          onChange={(value) => setScope(value as string)}
                          classNames={{ header: styles.selection }}
                          options={[
                            {
                              display: "전체",
                              value: "all",
                            },
                            {
                              display: "주문서",
                              value: "order",
                            },
                            {
                              display: "배송비",
                              value: "shipping",
                            },
                            {
                              display: "상품",
                              value: "item",
                            },
                          ]}
                        />
                      </FlexChild>
                    </HorizontalFlex>
                    <HorizontalFlex gap={20} justifyContent={"flex-start"}>
                      <FlexChild
                        width={"20%"}
                        backgroundColor={"var(--admin-table-bg-color)"}
                      >
                        <div className={styles.titleWrap}>
                          <Center>
                            <P size={16} weight={"bold"}>
                              삭제여부
                            </P>
                          </Center>
                        </div>
                      </FlexChild>
                      <FlexChild>
                        <Select
                          value={deleted}
                          onChange={(value) => setDeleted(value as string)}
                          classNames={{ header: styles.selection }}
                          options={[
                            {
                              display: "전체",
                              value: "all",
                            },
                            {
                              display: "삭제",
                              value: "deleted",
                            },
                            {
                              display: "미삭제",
                              value: "not_deleted",
                            },
                          ]}
                        />
                      </FlexChild>
                    </HorizontalFlex>
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
          name="coupons"
          columns={columns}
          initCondition={initCondition}
          initLimit={20}
          initData={initData}
          onSearch={(condition) => {
            return adminRequester.getCoupons(condition);
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
