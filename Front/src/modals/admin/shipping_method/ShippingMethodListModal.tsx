import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Table, { Column } from "@/components/table/Table";
import { adminRequester } from "@/shared/AdminRequester";
import { getShippingType } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef } from "react";
import ModalBase from "../../ModalBase";

const ShippingMethodListModal = NiceModal.create(
  ({ store, brand }: { store: any; brand: any }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "배송방법 목록";
    const buttonText = "close";
    const modal = useRef<any>(null);
    useEffect(() => {
      if (!store && !brand) {
        modal.current.close();
      }
    }, [store, brand]);
    const tableRef = useRef<any>(null);
    const columns: Column[] = [
      {
        label: "방법",
        Cell: ({ row }) => getShippingType(row),
      },
      {
        label: "이름",
        code: "name",
      },
      {
        label: "배송비",
        code: "amount",
      },
      { label: "최소 금액", code: "min" },
      {
        label: "최대금액",
        code: "max",
        Cell: ({ cell }) => (cell === -1 ? "제한없음" : cell),
      },
      {
        label: " ",
        Cell: ({ row }) => (
          <FlexChild gap={5} justifyContent="center">
            <Button
              styleType="white"
              onClick={() =>
                NiceModal.show("shippingMethodDetail", {
                  method: row,
                  onSuccess: () => tableRef.current.research(),
                })
              }
            >
              편집
            </Button>
            <Button
              styleType="admin"
              onClick={() => {
                NiceModal.show("confirm", {
                  message: `${row.name}을 삭제하시겠습니까?`,
                  confirmText: "삭제",
                  cancelText: "취소",
                  onConfirm: () =>
                    adminRequester
                      .deleteShippingMethods(row.id, {})
                      .then(() => {
                        tableRef.current.research();
                      }),
                });
              }}
            >
              삭제
            </Button>
          </FlexChild>
        ),
      },
    ];
    return (
      <ModalBase
        borderRadius={10}
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
          gap={10}
        >
          <FlexChild>
            <Table
              ref={tableRef}
              name="shipping_method"
              columns={columns}
              initLimit={20}
              initCondition={
                store
                  ? { store_id: store?.id }
                  : brand
                  ? { brand_id: brand?.id }
                  : {}
              }
              onSearch={(condition) =>
                adminRequester.getShippingMethods(condition)
              }
              onReprocessing={(data) => data?.content || []}
              selectable={false}
            />
          </FlexChild>
          <FlexChild justifyContent="center" gap={5}>
            <Button
              styleType="admin"
              padding={"12px 20px"}
              fontSize={18}
              onClick={() =>
                NiceModal.show("shippingMethodDetail", {
                  method: { store_id: store?.id, brand_id: brand?.id },
                  onSuccess: () => tableRef.current.research(),
                })
              }
            >
              추가
            </Button>
            <Button
              styleType="white"
              padding={"12px 20px"}
              fontSize={18}
              onClick={() => modal.current.close()}
            >
              닫기
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default ShippingMethodListModal;
