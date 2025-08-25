import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputImage from "@/components/inputs/InputImage";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./CategoryModal.module.css";
const CategoryModal = NiceModal.create(
  ({
    category,
    onSuccess,
    store,
    categories,
    selected,
  }: {
    category: any;
    onSuccess?: () => void;
    store: StoreData;
    categories: CategoryData[];
    selected: CategoryData;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "카테고리 " + (category ? "편집" : "상세정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [thumbnail] = useState(
      category?.thumbnail ? [category.thumbnail] : []
    );
    const [parent, setParent] = useState<CategoryData | null>(selected || null);
    const [max, setMax] = useState(0);
    const inputs = useRef<any[]>([]);
    const image = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const handleSave = () => {
      setIsLoading(true);
      try {
        const name = inputs.current[0].getValue();
        if (!name) {
          return setError("카테고리명이 입력되지 않았습니다.");
        }
        validateInputs([...inputs.current, image.current])
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return;
            const thumbnail = image.current.getValue();
            const index = inputs.current[1].getValue();

            const _data: CategoryDataFrame = {
              name,
              store_id: store.id,
              index,
              parent_id: parent?.id,
            };
            _data.thumbnail = thumbnail;
            if (category) {
              adminRequester.updateCategory(
                category.id,
                _data,
                ({ message, error }: { message?: string; error?: string }) => {
                  setIsLoading(false);
                  if (message) {
                    onSuccess?.();
                    modal.current.close();
                  } else if (error) setError(error);
                }
              );
            } else {
              adminRequester.createCategory(
                _data,
                ({ message, error }: { message?: string; error?: string }) => {
                  setIsLoading(false);
                  if (message) {
                    onSuccess?.();
                    modal.current.close();
                  } else if (error) setError(error);
                }
              );
            }
          })
          .catch(() => {
            toast({ message: "오류가 발생했습니다." });
            setIsLoading(false);
          });
      } catch (error) {
        setIsLoading(false);
      }
    };
    const handleList = () => {
      if (categories?.length === 0) {
        toast({ message: "생성된 카테고리 목록이 없습니다." });
        return;
      }
      NiceModal.show("categoryList", {
        categories,
        onSelect: (category: CategoryData) => setParent(category),
        selected: parent,
        category,
      });
    };
    useEffect(() => {
      if (!category) {
        modal.current.close();
      }
    }, [category]);
    useClientEffect(() => {
      if (error) {
        setIsLoading(false);
        toast({ message: error });
      }
    }, [error]);
    useEffect(() => {
      if (parent) {
        setMax(
          Math.max(
            (parent.children?.length || 0) +
              (category?.parent_id === parent.id ? -1 : 0),
            0
          )
        );
      } else {
        setMax(
          Math.max(
            categories?.length + (category?.parent_id === null ? -1 : 0),
            0
          )
        );
      }
    }, [parent]);

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
        <VerticalFlex padding={"10px 20px"}>
          <FlexChild justifyContent="center">
            <Div width={300}>
              <InputImage
                ref={image}
                value={thumbnail}
                placeHolder="1:1 비율의 이미지를 권장합니다."
              />
            </Div>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>스토어</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{store.name}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>상위 카테고리</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <Button styleType="white" onClick={handleList}>
                  <P>{parent?.name || "최상단"}</P>
                </Button>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>카테고리명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <Input
                  value={category?.name}
                  width={"100%"}
                  ref={(el) => {
                    inputs.current[0] = el;
                  }}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>순서</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <InputNumber
                  value={category?.index || max}
                  width={"100%"}
                  ref={(el) => {
                    inputs.current[1] = el;
                  }}
                  min={0}
                  max={max}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild justifyContent="center" gap={5}>
            <Button
              styleType="admin"
              padding={"12px 20px"}
              fontSize={18}
              isLoading={isLoading}
              onClick={handleSave}
            >
              등록
            </Button>
            <Button
              styleType="white"
              padding={"12px 20px"}
              fontSize={18}
              onClick={() => modal.current.close()}
            >
              취소
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default CategoryModal;
