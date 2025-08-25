import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputImage from "@/components/inputs/InputImage";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./BrandModal.module.css";
const BrandModal = NiceModal.create(
  ({
    brand,
    edit = false,
    onSuccess,
  }: {
    brand: any;
    edit?: boolean;
    onSuccess?: () => void;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "입점사 " + (edit ? "편집" : "상세정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [thumbnail] = useState(brand.thumbnail ? [brand.thumbnail] : []);
    const inputs = useRef<any[]>([]);
    const image = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const handleSave = () => {
      setIsLoading(true);
      try {
        const name = inputs.current[0].getValue();
        if (!name) {
          return setError("입점사명이 입력되지 않았습니다.");
        }
        validateInputs([...inputs.current, image.current])
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return;
            const thumbnail = image.current.getValue();
            const description = inputs.current[1].getValue();

            const _data: BrandDataFrame = {
              name,
            };
            _data.thumbnail = thumbnail;
            if (description) _data.description = description;
            adminRequester.updateBrand(
              brand.id,
              _data,
              ({ message, error }: { message?: string; error?: string }) => {
                setIsLoading(false);
                if (message) {
                  onSuccess?.();
                  modal.current.close();
                } else if (error) setError(error);
              }
            );
          })
          .catch(() => {
            toast({ message: "오류가 발생했습니다." });
            setIsLoading(false);
          });
      } catch (error) {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      if (!brand) {
        modal.current.close();
      }
    }, [brand]);
    useClientEffect(() => {
      if (error) {
        setIsLoading(false);
        toast({ message: error });
      }
    }, [error]);
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
            {edit ? (
              <Div width={300}>
                <InputImage
                  ref={image}
                  value={thumbnail}
                  placeHolder="1:1 비율의 이미지를 권장합니다."
                />
              </Div>
            ) : (
              <Image
                className={styles.image}
                src={brand?.thumbnail || "/resources/images/no-img.png"}
                size={200}
              />
            )}
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>입점사명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={brand.name}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[0] = el;
                    }}
                  />
                ) : (
                  <P>{brand.name}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>간단설명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={brand.description}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[1] = el;
                    }}
                  />
                ) : (
                  <P>{brand.description || "없음"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {edit ? (
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
          ) : (
            <FlexChild justifyContent="center" gap={5}>
              <Button
                styleType="white"
                padding={"12px 20px"}
                fontSize={18}
                onClick={() => modal.current.close()}
              >
                닫기
              </Button>
            </FlexChild>
          )}
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default BrandModal;
