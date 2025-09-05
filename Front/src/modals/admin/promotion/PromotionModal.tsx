import Button from "@/components/buttons/Button";
import DatePicker from "@/components/date-picker/DatePicker";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { dateToString, toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./PromotionModal.module.css";

const PromotionModal = NiceModal.create(
  ({
    promotion,
    edit = false,
    onSuccess,
  }: {
    promotion: any;
    edit?: boolean;
    onSuccess?: () => void;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "프로모션 " + (edit ? "편집" : "기본 정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const inputs = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [dates, setDates] = useState<Date[]>(
      promotion.starts_at && promotion.ends_at
        ? [new Date(promotion.starts_at), new Date(promotion.ends_at)]
        : []
    );

    const handleSave = () => {
      setIsLoading(true);
      try {
        const title = inputs.current[0].getValue();
        if (!title) {
          return setError("프로모션이 입력되지 않았습니다.");
        }
        validateInputs([...inputs.current])
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return;

            const _data: EventDataFrame = {
              store_id: promotion.store_id,
              starts_at: dates[0],
              ends_at: dates[1],
              title,
            };

            adminRequester.updatePromotion(
              promotion.id,
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
      if (!promotion) {
        modal.current.close();
      }
    }, [promotion]);
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
        <VerticalFlex
          padding={"10px 20px"}
          maxHeight={"80vh"}
          overflow="scroll"
          overflowY="scroll"
          position="relative"
          hideScrollbar
        >
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>스토어</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <P>{promotion?.store?.name}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>프로모션명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={promotion.title}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[0] = el;
                    }}
                  />
                ) : (
                  <P>{promotion.title}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>기간설정</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <DatePicker
                    selectionMode="range"
                    defaultSelectedRange={dates as any}
                    onChange={(values) => setDates(values as any)}
                  />
                ) : (
                  <P>
                    {promotion.starts_at && promotion.ends_at
                      ? `${dateToString(promotion.starts_at)} ~ ${dateToString(
                          promotion.ends_at
                        )}`
                      : ""}
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          {edit ? (
            <FlexChild
              justifyContent="center"
              gap={5}
              position="sticky"
              bottom={0}
            >
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
            <FlexChild
              justifyContent="center"
              gap={5}
              position="sticky"
              bottom={0}
            >
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

export default PromotionModal;
