import { getCouponDate } from "@/app/admin/desktop/(main)/product/coupon/management/table";
import Button from "@/components/buttons/Button";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import DatePicker from "@/components/date-picker/DatePicker";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { adminRequester } from "@/shared/AdminRequester";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { toast, validateInputs } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./CouponModal.module.css";
import Select from "@/components/select/Select";
const getInitDate = (): [Date, Date] => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return [start, end];
};
const options: { display: string; value: DateUnit; suffix: string }[] = [
  { display: "년", value: "year", suffix: "년" },
  { display: "개월", value: "month", suffix: "개월" },
  { display: "일", value: "date", suffix: "일" },
  { display: "시간", value: "hours", suffix: "시간" },
];
const CouponModal = NiceModal.create(
  ({
    coupon,
    edit = false,
    onSuccess,
  }: {
    coupon: any;
    edit?: boolean;
    onSuccess?: () => void;
  }) => {
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["min(95%, 900px)", "auto"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "쿠폰 " + (edit ? "편집" : "정보");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const inputs = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [type, setType] = useState<CouponType>(coupon.type);
    const [calc, setCalc] = useState<CalcType>(coupon.calc);
    const [date, setDate] = useState<DateType>(coupon.date);
    const [dates, setDates] = useState<[Date, Date]>(
      coupon.starts_at && coupon.ends_at
        ? [new Date(coupon.starts_at), new Date(coupon.ends_at)]
        : getInitDate()
    );
    const [unit, setUnit] = useState<DateUnit>(coupon.date_unit);

    const handleSave = () => {
      setIsLoading(true);
      try {
        const name = inputs.current[0].getValue();
        if (!name) return setError("쿠폰명이 입력되지 않았습니다.");
        const value = inputs.current[1].getValue();
        if (!value) return setError("할인가는 0이 될 수 없습니다.");
        let range = inputs.current?.[2]?.getValue?.();
        if (date === "range" && range === 0)
          return setError("기간을 설정해주세요.");

        validateInputs(inputs.current.filter(Boolean))
          .then(({ isValid }: { isValid: boolean }) => {
            if (!isValid) return;

            const _data: CouponDataFrame = {
              store_id: coupon.store_id,
              name,
              type,
              calc,
              date,
              value,
            };
            if (date === "fixed") {
              _data.starts_at = dates[0];
              _data.ends_at = dates[1];
              _data.date_unit = null;
              _data.range = 0;
            } else if (date === "range") {
              _data.starts_at = null;
              _data.ends_at = null;
              _data.date_unit = unit;
              _data.range = range;
            } else {
              _data.starts_at = null;
              _data.ends_at = null;
              _data.date_unit = null;
              _data.range = 0;
            }

            adminRequester.updateCoupon(
              coupon.id,
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
      if (!coupon) {
        modal.current.close();
      }
    }, [coupon]);
    useClientEffect(() => {
      if (error) {
        setIsLoading(false);
        toast({ message: error });
      }
    }, [error]);

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
                <P>{coupon?.store?.name}</P>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>쿠폰명</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <Input
                    value={coupon.name}
                    width={"100%"}
                    ref={(el) => {
                      inputs.current[0] = el;
                    }}
                  />
                ) : (
                  <P>{coupon.name}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>할인방식</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <RadioGroup
                    name="calc"
                    value={calc}
                    onValueChange={(value) => setCalc(value as CalcType)}
                  >
                    <HorizontalFlex justifyContent="flex-start" gap={12}>
                      {(
                        [
                          {
                            display: "고정값",
                            value: "fix",
                          },
                          {
                            display: "퍼센트",
                            value: "percent",
                          },
                        ] as { display: string; value: CalcType }[]
                      ).map((calc) => (
                        <FlexChild
                          key={calc.value}
                          gap={6}
                          width={"max-content"}
                        >
                          <RadioChild id={calc.value} />
                          <P>{calc.display}</P>
                        </FlexChild>
                      ))}
                    </HorizontalFlex>
                  </RadioGroup>
                ) : (
                  <P>{calc === "fix" ? "고정값" : "퍼센트"}</P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>할인가</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                {edit ? (
                  <InputNumber
                    ref={(el) => {
                      inputs.current[1] = el;
                    }}
                    value={coupon.value}
                    name={"할인가"}
                    min={0}
                    max={calc === "percent" ? 100 : 99999999}
                    width={250 - 80}
                    suffix={calc === "percent" ? "%" : ""}
                  />
                ) : (
                  <P>
                    <Span>{coupon.value}</Span>
                    <Span>{calc === "percent" ? "%" : "원"}</Span>
                  </P>
                )}
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild hidden={!edit}>
            <HorizontalFlex>
              <FlexChild className={styles.head}>
                <P>날짜적용방식</P>
              </FlexChild>
              <FlexChild className={styles.content}>
                <RadioGroup
                  name="date"
                  value={date}
                  onValueChange={(value) => setDate(value as DateType)}
                >
                  <HorizontalFlex justifyContent="flex-start" gap={12}>
                    {[
                      {
                        display: "지정일",
                        value: "fixed",
                      },
                      {
                        display: "기간",
                        value: "range",
                      },
                      {
                        display: "당일",
                        value: "day",
                      },
                      {
                        display: "해당주",
                        value: "week",
                      },
                      {
                        display: "해당월",
                        value: "month",
                      },
                      {
                        display: "해당년도",
                        value: "year",
                      },
                    ].map((date) => (
                      <FlexChild key={date.value} gap={6} width={"max-content"}>
                        <RadioChild id={date.value} />
                        <P>{date.display}</P>
                      </FlexChild>
                    ))}
                  </HorizontalFlex>
                </RadioGroup>
              </FlexChild>
            </HorizontalFlex>
          </FlexChild>
          <FlexChild hidden={date !== "fixed" && date !== "range"}>
            <HorizontalFlex justifyContent="flex-start">
              <FlexChild className={styles.head}>
                <P>적용기간</P>
              </FlexChild>

              {edit ? (
                date === "fixed" ? (
                  <DatePicker
                    showTimePicker
                    selectionMode="range"
                    defaultSelectedRange={dates}
                    onChange={(dates) => setDates(dates as [Date, Date])}
                  />
                ) : (
                  date === "range" && (
                    <FlexChild gap={6} width={"max-content"} color="#111">
                      <Select
                        zIndex={10080}
                        classNames={{
                          header: styles.select,
                        }}
                        value={unit}
                        width={100}
                        maxWidth={100}
                        options={options}
                        onChange={(value) => setUnit(value as DateUnit)}
                      />
                      <InputNumber
                        hideArrow
                        value={coupon.range}
                        ref={(el) => {
                          inputs.current[2] = el;
                        }}
                        min={0}
                        max={999999}
                        width={100}
                        suffix={options.find((f) => f.value === unit)?.suffix}
                      />
                    </FlexChild>
                  )
                )
              ) : (
                <FlexChild className={styles.content}>
                  <P>{getCouponDate(coupon)}</P>
                </FlexChild>
              )}
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

export default CouponModal;
