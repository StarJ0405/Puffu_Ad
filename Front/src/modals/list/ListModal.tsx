import P from "@/components/P/P";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import NiceModal from "@ebay/nice-modal-react";
import { useRef } from "react";
import ModalBase from "../ModalBase";

const ListModal = NiceModal.create(
  ({
    selected,
    list = [],
    onSelect,
    slideUp = true,
    width = "100vw",
    height = "auto",
  }: {
    selected: { label: React.ReactNode; value: string };
    list: { label: React.ReactNode; value: string }[];
    onSelect: (item: { label: React.ReactNode; value: string }) => void;
    onCancel?: () => void;
    slideUp?: boolean;
    width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
  }) => {
    const [withHeader, withFooter] = [false, false];
    const withCloseButton = false;
    const clickOutsideToClose = true;
    const title = "";
    const buttonText = "close";

    const modal = useRef<any>(null);

    const onSelectClick = (item: any) => {
      if (onSelect) onSelect(item);
      modal.current.close();
    };
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
        <FlexChild backgroundColor={"#FFF"}>
          <VerticalFlex padding={16}>
            <FlexChild justifyContent="center">
              <Div
                height={0}
                width={60}
                borderBottom={"3px solid #D9D9D9"}
                borderRadius={50}
              />
            </FlexChild>
            {list.map((l, index) => (
              <FlexChild
                key={`items_${index}`}
                onClick={() => onSelectClick(l)}
                padding={"20px 10px"}
                borderBottom={
                  list.length === index + 1 ? undefined : "1px solid #EAEAEA"
                }
              >
                <HorizontalFlex>
                  {typeof l.label === "string" ? <P>{l.label}</P> : l.label}
                  {selected?.value === l.value && (
                    <Icon name="check" type="svg" size={16} />
                  )}
                </HorizontalFlex>
              </FlexChild>
            ))}
          </VerticalFlex>
        </FlexChild>
      </ModalBase>
    );
  }
);

export default ListModal;
