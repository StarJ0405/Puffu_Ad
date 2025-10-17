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
import styles from "./PointListModal.module.css";
const PointListModal = NiceModal.create(({ user }: { user: UserData }) => {
  const [withHeader, withFooter] = [true, false];
  const [width, height] = ["min(95%, 1100px)", "auto"];
  const withCloseButton = true;
  const clickOutsideToClose = true;
  const title = `${user.name}님의 포인트기록`;
  const buttonText = "close";
  const modal = useRef<any>(null);

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
      label: "타입",
      code: "name",
    },
    {
      label: "포인트",
      code: "data",
      Cell: ({ cell }) =>
        cell?.point > 0
          ? `${Number(cell?.point || 0).toLocaleString("ko")}P 획득`
          : `${Number(-cell?.point || 0).toLocaleString("ko")}P 사용`,
    },
    {
      label: "누적포인트",
      code: "data",
      Cell: ({ cell }) => `${Number(cell?.total || 0).toLocaleString("ko")}P`,
    },
    {
      label: "메모",
      code: "metadata",
      Cell: ({ cell }) => cell?.memo || "없음",
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
            name={`${user?.id}_point`}
            columns={columns}
            initLimit={10}
            initCondition={{ order: { created_at: "desc" } }}
            onSearch={(condition) =>
              adminRequester.getPointList(user.id, condition)
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
          <Button
            className={styles.button}
            onClick={() =>
              NiceModal.show("input", {
                message: `${user.name}님에게 포인트를 지급합니다.`,
                cancelText: "취소",
                confirmText: "지급",
                input: [
                  {
                    label: "포인트",
                    type: "number",
                    min: 0,
                    max: 99999999999,
                    value: 0,
                  },
                  {
                    label: "메모",
                    type: "textarea",
                    placeHolder: "관리자용 메모",
                  },
                ],
                preventable: true,
                onConfirm: (values: any[]) => {
                  const point = Number(values[0] || 0);
                  const memo = values[1] || "";
                  if (point <= 0) {
                    toast({ message: "포인트는 최소 0보다 커야합니다" });
                    return false;
                  }
                  return true;
                },
              })
            }
          >
            포인트 지급
          </Button>
        </FlexChild>
      </VerticalFlex>
    </ModalBase>
  );
});

export default PointListModal;
