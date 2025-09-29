import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useRef } from "react";
import ModalBase from "../../ModalBase";
import styles from "./CategoryListModal.module.css";
const CategoryListModal = NiceModal.create(
  ({
    category,
    categories,
    selected,
    onSelect,
    disable = true,
  }: {
    category?: CategoryData;
    categories: CategoryData[];
    selected: CategoryData;
    onSelect?: (
      category: CategoryData | null,
      parents?: CategoryData[]
    ) => void;
    disable?: boolean;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = false;
    const clickOutsideToClose = true;
    const title = "카테고리 관리";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const handleSelect = (
      category: CategoryData | null,
      parents: CategoryData[] = []
    ) => {
      if (category?.id == selected?.id) return;
      onSelect?.(category, parents);
      modal.current.close();
    };
    const handleCancel = () => {
      modal.current.close();
    };
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
          overflow="scroll"
          overflowY="scroll"
          hideScrollbar
          minHeight={600}
          height={600}
          maxHeight={600}
        >
          <FlexChild className={styles.headerLine} position="sticky" top={0}>
            <HorizontalFlex>
              <FlexChild>
                <P className={styles.header}>대분류</P>
              </FlexChild>
              <FlexChild>
                <P className={styles.header}>중분류</P>
              </FlexChild>
              <FlexChild>
                <P className={styles.header}>소분류</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {categories.map((cat1) => (
            <FlexChild key={cat1.id}>
              <VerticalFlex>
                <FlexChild className={styles.body}>
                  <HorizontalFlex>
                    <FlexChild>
                      <P
                        onClick={() => handleSelect(cat1, [])}
                        className={clsx(styles.category, styles._1st, {
                          [styles.selected]: selected?.id === cat1.id,
                          [styles.disabled]: cat1.id === category?.id,
                        })}
                      >
                        {cat1.name}
                      </P>
                    </FlexChild>
                    <FlexChild>
                      <P className={styles.category}>-</P>
                    </FlexChild>
                    <FlexChild>
                      <P className={styles.category}>-</P>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                {cat1?.children?.map((cat2) => (
                  <FlexChild key={cat2.id}>
                    <VerticalFlex>
                      <FlexChild className={styles.body}>
                        <HorizontalFlex>
                          <FlexChild>
                            <P className={styles.category}>-</P>
                          </FlexChild>
                          <FlexChild>
                            <P
                              onClick={() =>
                                cat1.id !== category?.id &&
                                cat2?.id !== category?.id &&
                                handleSelect(cat2, [cat1])
                              }
                              className={clsx(styles.category, styles._2st, {
                                [styles.selected]: selected?.id === cat2.id,
                                [styles.disabled]:
                                  cat1.id === category?.id ||
                                  cat2?.id === category?.id,
                              })}
                            >
                              {cat2.name}
                            </P>
                          </FlexChild>
                          <FlexChild>
                            <P className={styles.category}>-</P>
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                      {cat2?.children?.map((cat3) => (
                        <FlexChild key={cat3.id} className={styles.body}>
                          <HorizontalFlex>
                            <FlexChild>
                              <P className={styles.category}>-</P>
                            </FlexChild>
                            <FlexChild>
                              <P className={styles.category}>-</P>
                            </FlexChild>
                            <FlexChild>
                              <P
                                className={clsx(styles.category, styles._3st, {
                                  [styles.disabled]: disable,
                                })}
                                onClick={() =>
                                  !disable && handleSelect(cat3, [cat1, cat2])
                                }
                              >
                                {cat3.name}
                              </P>
                            </FlexChild>
                          </HorizontalFlex>
                        </FlexChild>
                      ))}
                    </VerticalFlex>
                  </FlexChild>
                ))}
              </VerticalFlex>
            </FlexChild>
          ))}

          <FlexChild
            justifyContent="center"
            gap={5}
            position="sticky"
            bottom={10}
            paddingTop={15}
          >
            <Button
              fontSize={18}
              styleType="admin"
              onClick={() => handleSelect(null)}
            >
              최상단
            </Button>
            <Button fontSize={18} styleType="white" onClick={handleCancel}>
              닫기
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default CategoryListModal;
