import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputImage from "@/components/inputs/InputImage";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./GroupModal.module.css";
import { adminRequester } from "@/shared/AdminRequester";
const GroupModal = NiceModal.create(
  ({ group, onSuccess }: { group: any; onSuccess?: () => void }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "멤버쉽 " + (group ? "편집" : "추가");
    const buttonText = "close";
    const modal = useRef<any>(null);
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
            const _data: GroupDataFrame = {
              name,
              min: inputs.current[1].getValue(),
              percent: inputs.current[2].getValue(),
            };
            _data.thumbnail = thumbnail;
            if (group?.id) {
              adminRequester.updateGroup(
                group.id,
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
              adminRequester.createGroup(
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
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>등급명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <Input
                  value={group?.name}
                  width={"100%"}
                  ref={(el) => {
                    inputs.current[0] = el;
                  }}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex alignItems="stretch">
              <FlexChild className={styles.head}>
                <P>아이콘</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <InputImage
                  ref={image}
                  value={group?.thumbnail}
                  placeHolder="1:1 비율의 이미지를 권장합니다."
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>최소 누적금액</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <InputNumber
                  hideArrow
                  suffix="원"
                  value={group?.min || 0}
                  max={9999999999}
                  width={"100%"}
                  ref={(el) => {
                    inputs.current[1] = el;
                  }}
                />
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>적립 퍼센트</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <InputNumber
                  value={group?.percent || 0}
                  width={"100%"}
                  ref={(el) => {
                    inputs.current[2] = el;
                  }}
                  max={100}
                  suffix="%"
                  hideArrow
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

export default GroupModal;
