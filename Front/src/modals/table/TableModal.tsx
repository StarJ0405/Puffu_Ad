import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Table, { Column } from "@/components/table/Table";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import { useRef } from "react";
import ModalBase from "../ModalBase";

const TableModal = NiceModal.create(
  ({
    name = "modal",
    slideUp = true,
    width = "100vw",
    height = "auto",
    columns = [],
    initCondition = {},
    limit = 20,
    initData,
    onMaxPage,
    onReprocessing,
    onSearch,
  }: {
    name?: string;
    slideUp?: boolean;
    width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
    columns?: Column[];
    initCondition?: any;
    limit?: number;
    initData?: any;
    onMaxPage?: (data: any) => number;
    onReprocessing?: (data: any) => any;
    onSearch?: (condition: any) => any;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const withCloseButton = false;
    const clickOutsideToClose = true;
    const title = "";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const { isMobile } = useBrowserEvent();
    return (
      <ModalBase
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
        borderRadius={6}
        slideUp={slideUp}
      >
        <FlexChild backgroundColor={"#FFF"} hidden={!isMobile}>
          <VerticalFlex padding={16}>
            <FlexChild justifyContent="center">
              <Div
                height={0}
                width={60}
                borderBottom={"3px solid #D9D9D9"}
                borderRadius={50}
              />
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
        <Table
          name={name}
          columns={columns}
          initCondition={initCondition}
          initLimit={limit}
          initData={initData}
          onMaxPage={onMaxPage}
          onReprocessing={onReprocessing}
          selectable={false}
          onSearch={onSearch}
        />
      </ModalBase>
    );
  }
);

export default TableModal;
