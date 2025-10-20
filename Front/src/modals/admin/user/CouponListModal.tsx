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
    const title = `${user.name}님의 포인트기록`;
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
        label: "일자",
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
      },
      {
        label: "이름",
        code: "name",
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
              initCondition={{ order: { created_at: "desc" } }}
              onSearch={(condition) =>
                adminRequester.getCouponList(user.id, condition)
              }
              onMaxPage={(data) => Number(data?.totalPages)}
              onReprocessing={(data) => data?.content || []}
              selectable={false}
              indexing={false}
            />
          </FlexChild>
          <FlexChild
            position="sticky"
            bottom={0}
            marginTop={10}
            justifyContent="flex-end"
          >
            <Button className={styles.button}>포인트 지급/회수</Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default CouponListModal;
