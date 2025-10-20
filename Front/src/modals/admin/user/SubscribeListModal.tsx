import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Table, { Column } from "@/components/table/Table";
import { adminRequester } from "@/shared/AdminRequester";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef } from "react";
import ModalBase from "../../ModalBase";
import styles from "./SubscribeListModal.module.css";
const SubscribeListModal = NiceModal.create(
  ({ user, onSuccess }: { user: UserData; onSuccess?: () => void }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 1100px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = `${user.name}님의 구독기록`;
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
        label: "기간",
        Cell: ({ row }) => {
          return (
            <VerticalFlex gap={5}>
              <P>{new Date(row.starts_at).toLocaleString()}</P>
              <P>~</P>
              <P>{new Date(row.ends_at).toLocaleString()}</P>
            </VerticalFlex>
          );
        },
      },
      {
        label: "이름",
        code: "name",
      },
      {
        label: "혜택",
        Cell: ({ row }) => (
          <VerticalFlex>
            <P>상시 {row.percent}% 할인</P>
            <P>매월 {Number(row.value).toLocaleString("ko")}원 쿠폰</P>
          </VerticalFlex>
        ),
      },
      {
        label: "혜택금액",
        Cell: ({ row }) =>
          row?.canceled_at
            ? "취소"
            : `${Number(row.used).toLocaleString("ko")} / ${Number(
                row.price
              ).toLocaleString("ko")}`,
      },
      {
        label: "관리",
        Cell: ({ row }) =>
          row.canceled_at ? (
            <></>
          ) : (
            <Button
              className={styles.button}
              onClick={() =>
                NiceModal.show("input", {
                  message: "구독을 환불하시겠습니까?",
                  confirmText: "환불진행",
                  cancelText: "취소",
                  preventable: true,
                  input: [
                    {
                      label: "환불금액",
                      type: "number",
                      min: 0,
                      max: Math.max(0, (row.price || 0) - (row.used || 0)),
                      placeHolder: `최대 환불가능 금액은 ${Math.max(
                        0,
                        (row.price || 0) - (row.used || 0)
                      ).toLocaleString("ko")}원 입니다.`,
                    },
                  ],
                  onConfirm: (value: number) => {
                    if (!value) {
                      toast({ message: "최소 0원보다 커야합니다." });
                      return false;
                    }
                    adminRequester.refundSubscribe(
                      user.id,
                      row.id,
                      {
                        refund: value,
                      },
                      () => table.current.research()
                    );

                    return true;
                  },
                })
              }
            >
              환불
            </Button>
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
              name={`${user?.id}_subscribe`}
              columns={columns}
              initLimit={5}
              initCondition={{
                order: { created_at: "desc" },
                relations: [
                  "orders.shipping_method.coupons",
                  "orders.coupons",
                  "orders.items.coupons",
                ],
              }}
              onSearch={(condition) =>
                adminRequester.getSubscribeList(user.id, condition)
              }
              onMaxPage={(data) => Number(data?.totalPages)}
              onReprocessing={(data) => data?.content || []}
              selectable={false}
              indexing={false}
            />
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default SubscribeListModal;
