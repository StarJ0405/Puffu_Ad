import Button from "@/components/buttons/Button";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Tooltip from "@/components/tooltip/Tooltip";
import { adminRequester } from "@/shared/AdminRequester";
import useData from "@/shared/hooks/data/useData";
import useClientEffect from "@/shared/hooks/useClientEffect";
import NiceModal from "@ebay/nice-modal-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./CategoriesModal.module.css";
const CategoriesModal = NiceModal.create(
  ({ stores }: { stores: StoreData[] }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "카테고리 관리";
    const buttonText = "close";
    const [selected, setSelected] = useState<CategoryData[]>([]);
    const modal = useRef<any>(null);
    const [store, setStore] = useState<string>(stores?.[0]?.id);
    const { categories, mutate } = useData(
      "categories",
      { parent_id: null, store_id: store, tree: "descendants" },
      (condition) => adminRequester.getCategories(condition),
      { onReprocessing: (data) => data?.content || [] }
    );
    const handleAdd = () => {
      NiceModal.show("categoryDetail", {
        store: stores.find((f) => f.id === store),
        categories,
        onSuccess: () => {
          mutate();
        },
        selected: selected?.[selected?.length - 1],
      });
    };
    const handleEdit = (
      category: CategoryData | null,
      parent: CategoryData | null
    ) => {
      NiceModal.show("categoryDetail", {
        store: stores.find((f) => f.id === store),
        categories,
        onSuccess: () => {
          mutate();
        },
        selected: parent,
        category,
      });
    };
    const handleClose = () => {
      modal.current.close();
    };
    const handleSelect = useCallback(
      (cat: CategoryData, index: number) => {
        if (selected.some((s) => s.id === cat.id)) {
          const _index = selected.findIndex((f) => f.id === cat.id);
          setSelected([...selected.slice(0, _index)]);
        } else {
          selected[index] = cat;
          setSelected([...selected]);
        }
      },
      [selected, setSelected]
    );
    useClientEffect(() => {
      setSelected(
        selected
          .reduce((acc: CategoryData[], cat: CategoryData) => {
            if (acc.length > 0) {
              const parent = acc[acc.length - 1];
              if (parent.children && parent.children?.length > 0) {
                const child = parent.children.find((f) => f.id === cat.id);
                if (child) {
                  return [...acc, child];
                }
              }
              return [...acc];
            } else {
              return [categories.find((f: CategoryData) => f.id === cat.id)];
            }
          }, [])
          .filter(Boolean)
      );
    }, [categories]);

    const Category = ({
      cat,
      index = 0,
    }: {
      cat: CategoryData;
      index?: number;
    }) => {
      return (
        <FlexChild>
          <HorizontalFlex>
            <FlexChild
              className={styles.category}
              gap={5}
              onClick={() => handleSelect(cat, index)}
            >
              <RadioChild id={cat.id} />
              <Tooltip
                click={true}
                hover={false}
                zIndex={10070}
                content={
                  <Image
                    src={cat.thumbnail || "/resources/images/noImage2x.png"}
                    size={"min(30vw,30vh)"}
                    border={"1px solid #111"}
                  />
                }
              >
                <Image
                  src={cat.thumbnail || "/resources/images/noImage2x.png"}
                  size={24}
                />
              </Tooltip>
              <P>{cat.name}</P>
            </FlexChild>
            <FlexChild
              width={"max-content"}
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleEdit(cat, selected?.[index - 1]);
              }}
            >
              <Image src={"/resources/images/editing.png"} size={16} />
            </FlexChild>
            <FlexChild
              width={"max-content"}
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                NiceModal.show("confirm", {
                  confirmText: "삭제",
                  cancelText: "취소",
                  message: `카테고리를 삭제하시겠습니까?${
                    cat?.children?.length || 0 > 0
                      ? " 하위 카테고리도 같이 삭제됩니다."
                      : ""
                  }`,
                  onConfirm: () => {
                    adminRequester.deleteCategory(cat.id).then(() => {
                      mutate();
                    });
                  },
                  admin: true,
                });
              }}
            >
              <Image src={"/resources/images/closeBtn2x.png"} size={24} />
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      );
    };
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
        <VerticalFlex padding={"10px 20px"} gap={10}>
          <FlexChild justifyContent="flex-end">
            <Select
              value={store}
              options={stores.map((store) => ({
                display: store.name,
                value: store.id,
              }))}
              zIndex={10056}
              onChange={(value) => {
                setSelected([]);
                setStore(value as string);
              }}
            />
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={10}>
              <FlexChild>
                <RadioGroup name="1st" value={selected?.[0]?.id}>
                  <VerticalFlex gap={10}>
                    <P className={styles.header}>대분류</P>
                    <VerticalFlex className={styles.box}>
                      {categories
                        .sort((c1: CategoryData, c2: CategoryData) =>
                          c1.name.localeCompare(c2.name)
                        )
                        .map((cat: CategoryData) => (
                          <Category key={cat.id} cat={cat} />
                        ))}
                    </VerticalFlex>
                  </VerticalFlex>
                </RadioGroup>
              </FlexChild>
              <FlexChild>
                <RadioGroup name="2st" value={selected?.[1]?.id}>
                  <VerticalFlex gap={10}>
                    <P className={styles.header}>중분류</P>
                    <VerticalFlex className={styles.box}>
                      {selected?.[0]?.children
                        ?.sort((c1: CategoryData, c2: CategoryData) =>
                          c1.name.localeCompare(c2.name)
                        )
                        ?.map((cat: CategoryData) => (
                          <Category key={cat.id} cat={cat} index={1} />
                        ))}
                    </VerticalFlex>
                  </VerticalFlex>
                </RadioGroup>
              </FlexChild>
              <FlexChild>
                <RadioGroup name="3st" value={selected?.[2]?.id}>
                  <VerticalFlex gap={10}>
                    <P className={styles.header}>소분류</P>
                    <VerticalFlex className={styles.box}>
                      {selected?.[1]?.children
                        ?.sort((c1: CategoryData, c2: CategoryData) =>
                          c1.name.localeCompare(c2.name)
                        )
                        ?.map((cat: CategoryData) => (
                          <Category key={cat.id} cat={cat} index={2} />
                        ))}
                    </VerticalFlex>
                  </VerticalFlex>
                </RadioGroup>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild justifyContent="center" gap={5}>
            <Button
              fontSize={18}
              styleType="admin"
              onClick={handleAdd}
              disabled={selected?.length === 3}
            >
              추가
            </Button>
            <Button fontSize={18} styleType="white" onClick={handleClose}>
              닫기
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default CategoriesModal;
