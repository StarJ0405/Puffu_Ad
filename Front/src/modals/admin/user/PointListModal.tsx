import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Table, { Column } from "@/components/table/Table";
import { adminRequester } from "@/shared/AdminRequester";
import { getOrderStatus } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef } from "react";
import ModalBase from "../../ModalBase";

const PointListModal = NiceModal.create(({ user }: { user: UserData }) => {
  const [withHeader, withFooter] = [true, false];
  const [width, height] = ["min(95%, 1100px)", "auto"];
  const withCloseButton = true;
  const clickOutsideToClose = true;
  const title = `${user.name}님의 주문기록`;
  const buttonText = "close";
  const modal = useRef<any>(null);
  const onRowClick = (row: OrderData) => {
    NiceModal.show("orderDetail", { order: row });
  };
  useEffect(() => {
    if (!user) {
      modal.current.close();
    }
  }, [user]);
  const columns: Column[] = [
    {
      label: "스토어",
      code: "store",
      Cell: ({ cell }) => cell.name,
    },
    {
      label: "주문일",
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
      label: "주문번호",
      code: "display",
    },
    {
      label: "구매내역",
      Cell: ({ row }) => (
        <VerticalFlex>
          <P hidden={row.total_final === 0}>
            <Span>{row?.total_final || 0}</Span>
            <Span>원</Span>
          </P>
          <P hidden={row.point === 0}>
            <Span>{row?.point || 0}</Span>
            <Span>P</Span>
          </P>
        </VerticalFlex>
      ),
    },
    {
      label: "주문상태",
      Cell: ({ row }) => getOrderStatus(row),
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
        paddingBottom={40}
      >
        <FlexChild>
          <Table
            onRowClick={(e, row) => onRowClick?.(row)}
            name={`${user?.id}_order`}
            columns={columns}
            initCondition={{
              user_id: user.id,
              order: { display: "asc" },
              relations: [
                "items.coupons",
                "address",
                "shipping_method.coupons",
                "store",
                "coupons",
                "refunds",
                "exchanges",
              ],
            }}
            initLimit={10}
            onSearch={(condition) => adminRequester.getOrders(condition)}
            onMaxPage={(data) => Number(data?.totalPages)}
            onReprocessing={(data) => data?.content || []}
            selectable={false}
            indexing={false}
          />
        </FlexChild>
      </VerticalFlex>
    </ModalBase>
  );
});

export default PointListModal;
