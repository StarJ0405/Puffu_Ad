import P from "@/components/P/P";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import ModalBase from "@/modals/ModalBase";
import { isSame } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useRef } from "react";
import styles from "./SelectModal.module.css";

const SelectModal = NiceModal.create(
  ({
    header,
    selected,
    list = [],
    onSelect,
    width = "100vw",
    height = "auto",
  }: {
    header: React.ReactNode;
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
        topModal
        baseAnimation={false}
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
        <FlexChild backgroundColor={"#FFF"}>
          <VerticalFlex>
            {header}

            {list.map((l, index) => (
              <FlexChild
                key={`items_${index}`}
                onClick={() => onSelectClick(l)}
                className={clsx(styles.item, {
                  [styles.select]: isSame(selected, l),
                })}
              >
                {typeof l.label === "string" ? <P>{l.label}</P> : l.label}
              </FlexChild>
            ))}
          </VerticalFlex>
        </FlexChild>
      </ModalBase>
    );
  }
);

export default SelectModal;
