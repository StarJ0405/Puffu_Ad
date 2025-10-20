import {
  getCouponDate,
  getCouponType,
} from "@/app/admin/desktop/(main)/product/coupon/management/table";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Table, { Column } from "@/components/table/Table";
import { adminRequester } from "@/shared/AdminRequester";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef } from "react";
import ModalBase from "../../ModalBase";
import styles from "./CouponListModal.module.css";
const CouponListModal = NiceModal.create(
  ({ user, onSuccess }: { user: UserData; onSuccess?: () => void }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 1100px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = `${user.name}님의 쿠폰기록`;
    const buttonText = "close";
    const modal = useRef<any>(null);
    const table = useRef<any>(null);
    useEffect(() => {
      if (!user) {
        modal.current.close();
      }
    }, [user]);
    const columns: Column[] = [
      {
        label: "발급시간",
        code: "created_at",
        Cell: ({ cell }) => {
          const date = new Date(cell);
          return (
            <VerticalFlex gap={5}>
              <P>{date.toLocaleDateString()}</P>,
              <P notranslate fontSize={14}>
                (
                {`${String(date.getHours()).padStart(2, "0")} : ${String(
                  date.getMinutes()
                ).padStart(2, "0")} : ${String(date.getSeconds()).padStart(
                  2,
                  "0"
                )}`}
                )
              </P>
            </VerticalFlex>
          );
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
        label: "이름",
        code: "name",
      },
      {
        label: "사용기한",
        Cell: ({ row }) => (
          <VerticalFlex>
            <P>{new Date(row.starts_at).toLocaleString()}</P>
            <P>~</P>
            <P>{new Date(row.ends_at).toLocaleString()}</P>
          </VerticalFlex>
        ),
      },
      {
        label: "종류",
        Cell: ({ row }) =>
          `${getCouponType(row.type)}(${row.value}${
            row.calc === "percent" ? "%" : "원"
          })`,
      },
      {
        label: "사용가능",
        Cell: ({ row }) =>
          !row.item_id &&
          !row.order_id &&
          !row.shipping_method_id &&
          new Date(row.ends_at || 0).getTime() > new Date().getTime(),
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
        label: "관리",
        Cell: ({ row }) =>
          !row.item_id &&
          !row.order_id &&
          !row.shipping_method_id &&
          new Date(row.ends_at || 0).getTime() > new Date().getTime() ? (
            <Button
              className={styles.button}
              onClick={() =>
                NiceModal.show("confirm", {
                  confirmText: "삭제",
                  cancelText: "취소",
                  message: `${row.name}을 삭제하시겠습니까?`,
                  onConfirm: () =>
                    adminRequester.deleteCoupon(row.id, {}, () =>
                      table.current.research()
                    ),
                })
              }
            >
              삭제
            </Button>
          ) : (
            <></>
          ),
        styling: {
          common: {
            style: {
              width: 80,
              minWidth: 80,
            },
          },
        },
      },
    ];
    return (
      <ModalBase
        borderRadius={10}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={withCloseButton}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
      >
        <VerticalFlex
          padding={"10px 20px"}
          maxHeight={"80dvh"}
          overflow="scroll"
          overflowY="scroll"
          hideScrollbar
        >
          <FlexChild>
            <Table
              ref={table}
              name={`${user?.id}_coupon`}
              columns={columns}
              initLimit={10}
              initCondition={{}}
              onSearch={(condition) =>
                adminRequester.getCouponList(user.id, condition)
              }
              onMaxPage={(data) => Number(data?.totalPages)}
              onReprocessing={(data) => data?.content || []}
              selectable={false}
            />
          </FlexChild>
          <FlexChild
            position="sticky"
            bottom={0}
            marginTop={10}
            justifyContent="flex-end"
          >
            <Button
              className={styles.button}
              onClick={() =>
                NiceModal.show("table", {
                  confirmText: "발급",
                  name: "coupons",
                  indexing: false,
                  slideUp: false,
                  width: "60vw",
                  height: "60vh",
                  maxHeight: "60vh",
                  overflow: "auto",
                  limit: 10,
                  columns: [
                    {
                      label: "이름",
                      code: "name",
                    },
                    {
                      label: "사용기한",
                      Cell: ({ row }: any) => getCouponDate(row, true),
                    },
                    {
                      label: "종류",
                      Cell: ({ row }: any) =>
                        `${getCouponType(row.type)}(${row.value}${
                          row.calc === "percent" ? "%" : "원"
                        })`,
                    },
                  ],
                  initCondition: {
                    user_id: null,
                    target: "manual",
                    useable: true,
                  },
                  selectable: true,
                  search: true,
                  onMaxPage: (data: Pageable) => data?.totalPages || 0,
                  onReprocessing: (data: Pageable) => data?.content || [],
                  onSearch: (condition: any) =>
                    adminRequester.getCoupons(condition),
                  onSelect: (data: CouponData[]) =>
                    Promise.all(
                      data.map(async (coupon) =>
                        adminRequester.giveCoupon(coupon.id, {
                          user_id: user.id,
                        })
                      )
                    ).then(() => table.current.research()),
                })
              }
            >
              쿠폰 즉석발급
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default CouponListModal;
