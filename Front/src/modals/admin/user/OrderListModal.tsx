import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Table, { Column } from "@/components/table/Table";
import { adminRequester } from "@/shared/AdminRequester";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef } from "react";
import ModalBase from "../../ModalBase";
import { getOrderStatus } from "@/shared/utils/Functions";
import Tooltip from "@/components/tooltip/Tooltip";
import Image from "@/components/Image/Image";
import FlexGrid from "@/components/flex/FlexGrid";
const OrderListModal = NiceModal.create(({ user }: { user: UserData }) => {
  const [withHeader, withFooter] = [true, false];
  const [width, height] = ["min(95%, 1100px)", "auto"];
  const withCloseButton = true;
  const clickOutsideToClose = true;
  const title = `${user.name}님의 주문기록`;
  const buttonText = "close";
  const modal = useRef<any>(null);
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
          <VerticalFlex>
            <P>{date.toLocaleDateString()}</P>,
            <P notranslate>{`${String(date.getHours()).padStart(
              2,
              "0"
            )} : ${String(date.getMinutes()).padStart(2, "0")} : ${String(
              date.getSeconds()
            ).padStart(2, "0")}`}</P>
          </VerticalFlex>
        );
      },
    },
    {
      label: "주문번호",
      code: "display",
    },
    {
      label: "총구매금액",
      code: "total_discounted",
    },
    {
      label: "주문상태",
      Cell: ({ row }) => getOrderStatus(row),
    },
    {
      label: "배송정보",
      code: "address",
      Cell: ({ cell }) => (
        <Tooltip
          position="bottom_center"
          zIndex={10080}
          content={
            <VerticalFlex
              backgroundColor="#fff"
              border={"1px solid #dadada"}
              padding={15}
              gap={6}
            >
              <FlexChild alignItems="flex-start">
                <P width={70} paddingRight={10}>
                  수령인
                </P>
                <P maxWidth={300}>{cell.name}</P>
              </FlexChild>
              <FlexChild alignItems="flex-start">
                <P width={70} paddingRight={10}>
                  전화번호
                </P>
                <P maxWidth={300}>{cell.phone}</P>
              </FlexChild>
              <FlexChild alignItems="flex-start">
                <P width={70} paddingRight={10}>
                  주소
                </P>
                <P maxWidth={300}>
                  {cell.address1} {cell.address2} ({cell.postal_code})
                </P>
              </FlexChild>
              {cell.message && (
                <FlexChild alignItems="flex-start">
                  <P width={70} paddingRight={10}>
                    배송메모
                  </P>
                  <P maxWidth={300}>{cell.message}</P>
                </FlexChild>
              )}
            </VerticalFlex>
          }
        >
          <VerticalFlex overflow="hidden" maxWidth={130}>
            <P>{cell.name}</P>
            <P>{cell.phone}</P>
            <P>
              {cell.address1} {cell.address2} ({cell.postal_code})
            </P>
            <P>{cell.message}</P>
          </VerticalFlex>
        </Tooltip>
      ),
      styling: {
        common: {
          style: {
            width: 130,
          },
        },
      },
    },
    {
      label: "상품",
      code: "items",
      Cell: ({ cell }) => (
        <Tooltip
          position="left"
          zIndex={10080}
          content={
            <FlexGrid
              columns={`min(3,${cell?.length})`}
              rows={Math.round(cell?.length / 4)}
              padding={10}
              backgroundColor="white"
              border={"1px solid #dadada"}
              gap={5}
            >
              {cell.map((item: LineItemData) => (
                <FlexChild key={item.id}>
                  <Image size={60} src={item.thumbnail} />
                  <P width={150}>
                    {item.title} X {item.total_quantity}
                    {item.extra_quantity > 0
                      ? `(${item.quantity} + ${item.extra_quantity})`
                      : ""}{" "}
                  </P>
                </FlexChild>
              ))}
            </FlexGrid>
          }
        >
          <P>{cell?.length}개의 상품</P>
        </Tooltip>
      ),
    },
  ];
  return (
    <ModalBase
      borderRadius={10}
      headerStyle
      zIndex={10055}
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
        maxHeight={"60dvh"}
        overflow="scroll"
        hideScrollbar
      >
        <FlexChild>
          <Table
            name={`${user?.id}_order`}
            columns={columns}
            initCondition={{
              user_id: user.id,
              order: { display: "asc" },
              relations: ["items", "address", "shipping_method", "store"],
            }}
            initLimit={20}
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

export default OrderListModal;
