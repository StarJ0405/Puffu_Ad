import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./CategorySelectModal.module.css";
const CategorySelectModal = NiceModal.create(
  ({
    categories,
    selected: initSelected,
    onSelect,
  }: {
    categories: CategoryData[];
    selected?: CategoryData[];
    onSelect?: (categories: CategoryData[]) => void;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = false;
    const clickOutsideToClose = true;
    const title = "카테고리 관리";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [total, setTotal] = useState<CategoryData[]>([]);
    const [selected, setSelected] = useState<CategoryData[]>(
      initSelected || []
    );
    const [isMounted, setMounted] = useState(false);
    const handleCancel = () => {
      modal.current.close();
    };
    const handleSave = () => {
      onSelect?.(selected);
      modal.current.close();
    };
    useEffect(() => {
      function flat(category: CategoryData): CategoryData[] {
        if (category?.children && category?.children?.length > 0) {
          return [
            category,
            ...category.children
              .map((category: CategoryData) => flat(category))
              .flat(),
          ];
        }
        return [category];
      }
      setTotal([...categories.map((category) => flat(category)).flat()]);
    }, [categories]);

    useEffect(() => {
      if (initSelected?.length)
        initSelected.forEach((category) =>
          document.getElementById(category.id)?.click()
        );
    }, [initSelected]);
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
        <CheckboxGroup
          name="categories"
          onChange={(values) =>
            setSelected(
              values
                .map((id) => total.find((f) => f.id === id))
                .filter(Boolean) as CategoryData[]
            )
          }
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
                      <FlexChild
                        className={clsx(styles.category, styles._1st)}
                        onClick={() =>
                          document.getElementById(cat1.id)?.click()
                        }
                      >
                        <CheckboxChild id={cat1.id} />
                        <P>{cat1.name}</P>
                      </FlexChild>
                      <FlexChild>
                        <P className={styles.category}>-</P>
                      </FlexChild>
                      <FlexChild>
                        <P className={styles.category}>-</P>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                  {cat1?.children?.map((cat2) => {
                    cat2.parent = cat1;
                    return (
                      <FlexChild key={cat2.id}>
                        <VerticalFlex>
                          <FlexChild className={styles.body}>
                            <HorizontalFlex>
                              <FlexChild>
                                <P className={styles.category}>-</P>
                              </FlexChild>
                              <FlexChild
                                className={clsx(styles.category, styles._2st)}
                                onClick={() =>
                                  document.getElementById(cat2.id)?.click()
                                }
                              >
                                <CheckboxChild id={cat2.id} />
                                <P>{cat2.name}</P>
                              </FlexChild>
                              <FlexChild>
                                <P className={styles.category}>-</P>
                              </FlexChild>
                            </HorizontalFlex>
                          </FlexChild>
                          {cat2?.children?.map((cat3) => {
                            cat2.parent = cat1;
                            cat3.parent = cat2;
                            return (
                              <FlexChild key={cat3.id} className={styles.body}>
                                <HorizontalFlex>
                                  <FlexChild>
                                    <P className={styles.category}>-</P>
                                  </FlexChild>
                                  <FlexChild>
                                    <P className={styles.category}>-</P>
                                  </FlexChild>
                                  <FlexChild
                                    className={clsx(
                                      styles.category,
                                      styles._3st
                                    )}
                                    onClick={() =>
                                      document.getElementById(cat3.id)?.click()
                                    }
                                  >
                                    <CheckboxChild id={cat3.id} />
                                    <P>{cat3.name}</P>
                                  </FlexChild>
                                </HorizontalFlex>
                              </FlexChild>
                            );
                          })}
                        </VerticalFlex>
                      </FlexChild>
                    );
                  })}
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
                padding={"6px 12px"}
                fontSize={18}
                styleType="admin"
                border={"1px solid var(--admin-color)"}
                onClick={handleSave}
              >
                저장
              </Button>
              <Button
                padding={"6px 12px"}
                fontSize={18}
                styleType="white"
                onClick={handleCancel}
              >
                취소
              </Button>
            </FlexChild>
          </VerticalFlex>
        </CheckboxGroup>
      </ModalBase>
    );
  }
);

export default CategorySelectModal;
