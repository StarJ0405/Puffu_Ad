import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import Table, { Column } from "@/components/table/Table";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";

import _ from "lodash";
import React, { useRef } from "react";
import ModalBase from "../ModalBase";
import styles from "./TableModal.module.css";

const TableModal = NiceModal.create(
  ({
    name = "modal",
    indexing = true,
    slideUp = true,
    width = "100vw",
    height = "100%",
    maxHeight,
    overflow,
    scrollbarWidth,
    columns = [],
    initCondition = {},
    limit = 20,
    initData,
    selectable = false,
    clickOutsideToClose = true,
    search,
    withCloseButton = false,
    onMaxPage,
    onReprocessing,
    onSearch,
    onSelect,
    onInput = (q) => {
      if (q) return { q };
      return {};
    },
  }: {
    name?: string;
    indexing?: boolean;
    slideUp?: boolean;
    width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
    maxHeight?: React.CSSProperties["maxHeight"];
    overflow?: React.CSSProperties["overflow"];
    scrollbarWidth?: React.CSSProperties["scrollbarWidth"];
    columns?: Column[];
    initCondition?: any;
    limit?: number;
    initData?: any;
    selectable: boolean;
    clickOutsideToClose?: boolean;
    withCloseButton?: boolean;
    search: boolean;
    onMaxPage?: (data: any) => number;
    onReprocessing?: (data: any) => any;
    onSearch?: (condition: any) => any;
    onSelect?: (data: any) => void;
    onInput?: (q: string) => any;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const title = "";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const { isMobile } = useBrowserEvent();
    const tableRef = useRef<any>(null);
    const uuid = _.uniqueId();
    return (
      <ModalBase
        zIndex={10055}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={false}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
        borderRadius={6}
        slideUp={slideUp}
        maxHeight={maxHeight}
        overflow={overflow}
        scrollbarWidth={scrollbarWidth}
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

        {withCloseButton && (
          <Image
            src="/resources/icons/closeBtn_white.png"
            size={18}
            position="absolute"
            top={15}
            right={15}
            zIndex={10}
            cursor="pointer"
            onClick={() => modal.current.close()}
          />
        )}

        <Table
          indexing={indexing}
          ref={tableRef}
          name={name}
          columns={columns}
          initCondition={initCondition}
          initLimit={limit}
          initData={initData}
          onMaxPage={onMaxPage}
          onReprocessing={onReprocessing}
          selectable={selectable}
          onSearch={onSearch}
        />
        {search && (
          <FlexChild padding={5}>
            <HorizontalFlex>
              <FlexChild></FlexChild>
              <FlexChild justifyContent="center" gap={6}>
                <Button
                  className={styles.cancel}
                  onClick={() => modal.current.close()}
                >
                  취소
                </Button>
                <Button
                  className={styles.confirm}
                  onClick={() => {
                    onSelect?.(tableRef.current.getData());
                    modal.current.close();
                  }}
                >
                  등록
                </Button>
              </FlexChild>
              <FlexChild justifyContent="flex-end" position="relative">
                <Input
                  id={`${uuid}_table_input`}
                  width={300}
                  className={styles.input}
                  placeHolder="검색어를 입력하세요"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const q = e.currentTarget.value;
                      const data: any = onInput(q);

                      tableRef.current.setCondition(data, true);
                    }
                  }}
                />
                <Image
                  src="/resources/icons/search_gray.png"
                  size={17}
                  position="absolute"
                  right={8}
                  top={8}
                  cursor="pointer"
                  onClick={() => {
                    const q = (
                      document.getElementById(
                        `${uuid}_table_input`
                      ) as HTMLInputElement
                    ).value;
                    const data: any = onInput(q);
                    tableRef.current.setCondition(data, true);
                  }}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
        )}
      </ModalBase>
    );
  }
);

export default TableModal;
