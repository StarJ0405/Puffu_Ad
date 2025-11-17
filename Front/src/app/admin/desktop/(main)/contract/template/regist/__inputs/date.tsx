"use client";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import DatePicker from "@/components/date-picker/DatePicker";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import { getDateDay } from "@/shared/utils/Functions";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ContractInput from "../class";

const key: string = "date";
export default class DateInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="date" type="svg" size={size} />
      ),
      title: "날짜 입력기",
      width: 150,
      height: 30,
      textable: true,
    });
  }
  public Float = forwardRef(
    (
      props: {
        name?: string;
        onChange?: (data: any) => void;
        data?: any;
      },
      ref: any
    ) => {
      const date = props?.data?.today
        ? new Date()
        : new Date(props?.data?.value);
      return (
        <FlexChild justifyContent="center">
          <FlexChild
            position="relative"
            width={"100%"}
            backgroundColor="transparent"
            textOverflow="clip"
            fontFamily="inherit"
            fontSize={"inherit"}
            fontWeight={"inherit"}
            textDecorationLine="inherit"
            fontStyle="inherit"
            color="inherit"
            textAlign="inherit"
            padding={5}
          >
            <P width={"100%"}>{this.dateToformat(date, props.data.format)}</P>
          </FlexChild>
        </FlexChild>
      );
    }
  );
  dateToformat(date: Date, format: string): string {
    switch (format) {
      case "yyyy년 mm월 dd일 D요일":
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}월 ${String(date.getDate()).padStart(2, "0")}일 ${getDateDay(
          date
        )}요일`;
      case "yyyy년 mm월 dd일":
        return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}월 ${String(date.getDate()).padStart(2, "0")}일`;
      case "yyyy-mm-dd":
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
      case "yyyy":
        return `${date.getFullYear()}`;
      case "mm":
        return `${date.getMonth() + 1}`;
      case "dd":
        return `${date.getDate()}`;
      case "D":
        return `${getDateDay(date)}`;
    }
    return "";
  }
  public isValid(data: any, value: any): boolean {
    return !!value?.value;
  }
  public Write = forwardRef(
    (
      props: {
        value?: any;
        data?: any;
        onChange?: (data: any) => void;
        name?: string;
        width: number;
        height: number;
      },
      ref: any
    ) => {
      useEffect(() => {
        if (props.onChange && !props.value && props.data.value)
          props.onChange({
            value: props?.data?.today
              ? new Date()
              : new Date(props?.data?.value),
          });
      }, []);

      return (
        <FlexChild justifyContent="center">
          <FlexChild
            position="relative"
            width={"100%"}
            backgroundColor="transparent"
            textOverflow="clip"
            fontFamily="inherit"
            fontSize={"inherit"}
            fontWeight={"inherit"}
            textDecorationLine="inherit"
            fontStyle="inherit"
            color="inherit"
            textAlign="inherit"
            padding={5}
            cursor="pointer"
          >
            <P
              width={"100%"}
              onClick={() => {
                const picker = document.getElementById("date__picker");
                const parent = picker?.parentNode as HTMLElement;
                parent.removeAttribute("hidden");
                picker?.click();
                parent.setAttribute("hidden", "true");
              }}
            >
              {props?.value &&
                this.dateToformat(props?.value, props.data.format)}
            </P>
            <DatePicker
              key={props?.value?.getTime?.()}
              hidden
              id="date__picker"
              defaultSelectedDate={props.value}
              onChange={(value) => {
                props?.onChange?.({
                  value,
                });
              }}
              min={props?.data?.min ? new Date(props?.data?.min) : undefined}
              max={props?.data?.max ? new Date(props?.data?.max) : undefined}
            />
          </FlexChild>
        </FlexChild>
      );
    }
  );
  public initData() {
    return {
      format: `yyyy년 mm월 dd일 D요일`,
    };
  }
  public Setting = forwardRef(
    (
      {
        name: pre_name,
        users,
        data = {},
      }: { name: string; users: ContractUserDataFrame[]; data: any },
      ref
    ) => {
      const [name, setName] = useState<string>(pre_name || "");
      const [assign, setAssign] = useState<string[]>([]);
      const [require, setRequire] = useState<string[]>([]);
      const [loaded, setLoaded] = useState<boolean>(false);
      const [icon, setIcon] = useState<boolean>(false);
      const [placeholder, setPlaceholder] = useState<string>(
        data?.placeholder || ""
      );
      const [tooltip, setTooltip] = useState<string>(data?.tooltip || "");
      const [value, setValue] = useState<string>(data?.value || "");
      const [today, setToday] = useState<boolean>(false);
      const [format, setForamt] = useState<string>(data?.format || "");
      const [min, setMin] = useState<Date | undefined>(
        data?.min ? new Date(data.min) : undefined
      );
      const [max, setMax] = useState<Date | undefined>(
        data?.max ? new Date(data.max) : undefined
      );
      useEffect(() => {
        if (data?.assign) {
          data?.assign?.forEach?.((assign: string) =>
            document.getElementById(`${assign}_assign`)?.click()
          );
        }
        if (data?.require) {
          data?.require?.forEach?.((require: string) =>
            document.getElementById(`${require}_require`)?.click()
          );
        }
        if (data?.icon) {
          document.getElementById("icon")?.click();
        }
        if (data?.limit) document.getElementById("limit")?.click();
        if (data?.today) document.getElementById("today")?.click();
        setLoaded(true);
      }, []);
      useImperativeHandle(ref, () => ({
        getValue() {
          return {
            data: {
              assign: assign.map((ass) => ass.replace("_assign", "")),
              require: require.map((req) => req.replace("_require", "")),
              icon,
              tooltip,
              placeholder,
              today,
              value: today ? undefined : value,
              format,
              max: today ? undefined : max,
              min: today ? undefined : min,
            },
            name,
          };
        },
        isValid() {
          return !!name;
        },
      }));
      return (
        <FlexChild>
          <HorizontalFlex alignItems="stretch">
            <FlexChild
              borderRight={"1px solid #d0d0d0"}
              paddingRight={6}
              marginRight={6}
            >
              <VerticalFlex width={400} padding={"0 20px"}>
                <FlexChild padding={"12px 0"}>
                  <P fontSize={20} fontWeight={700}>
                    ID
                  </P>
                </FlexChild>
                <FlexChild>
                  <Input
                    width={"100%"}
                    style={{ padding: "6px 12px" }}
                    value={name}
                    onChange={(value) => setName(value as string)}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    작성권한
                  </P>
                </FlexChild>
                <FlexChild>
                  <HorizontalFlex>
                    <FlexChild>
                      <VerticalFlex gap={6}>
                        <FlexChild />
                        {users.map((user) => (
                          <FlexChild key={user.name}>
                            <P fontSize={14}>{user.name}</P>
                          </FlexChild>
                        ))}
                      </VerticalFlex>
                    </FlexChild>
                    <FlexChild width={60}>
                      <CheckboxGroup
                        name="assign"
                        onChange={(values) => {
                          const removed = assign.filter(
                            (f) => !values.includes(f)
                          );
                          require
                            .filter((f) =>
                              removed.some((r) =>
                                r.startsWith(f.replace("_require", ""))
                              )
                            )
                            .forEach((req) =>
                              document.getElementById(req)?.click()
                            );
                          setAssign(values);
                        }}
                      >
                        <VerticalFlex gap={6}>
                          <P fontSize={14}>할당 대상</P>
                          {users.map((user) => (
                            <CheckboxChild
                              size={14}
                              width={14}
                              height={14}
                              key={user.name}
                              id={`${user.name}_assign`}
                            />
                          ))}
                        </VerticalFlex>
                      </CheckboxGroup>
                    </FlexChild>
                    <FlexChild width={60}>
                      <CheckboxGroup
                        name="require"
                        onChange={(values) => setRequire(values)}
                      >
                        <VerticalFlex gap={6}>
                          <P fontSize={14}>필수</P>
                          {users.map((user) => (
                            <CheckboxChild
                              size={14}
                              width={14}
                              height={14}
                              disabled={
                                loaded &&
                                !assign.some((f) => f.startsWith(user.name))
                              }
                              key={user.name}
                              id={`${user.name}_require`}
                            />
                          ))}
                        </VerticalFlex>
                      </CheckboxGroup>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    플레이스 홀더
                  </P>
                </FlexChild>
                <FlexChild>
                  <Input
                    width={"100%"}
                    onChange={(value) => setPlaceholder(value as string)}
                    value={data?.placeholder}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    툴팁 텍스트
                  </P>
                </FlexChild>
                <FlexChild>
                  <InputTextArea
                    width={"100%"}
                    onChange={(value) => setTooltip(value)}
                    value={data.tooltip}
                  />
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
            <FlexChild height={"100%"}>
              <VerticalFlex width={400} padding={"0 20px"}>
                <FlexChild padding={"12px 0"}>
                  <P fontSize={20} fontWeight={700}>
                    기본값
                  </P>
                </FlexChild>
                <FlexChild padding={"6px 0"}>
                  <CheckboxGroup
                    name="today"
                    onChange={(values) => setToday(values.includes("today"))}
                  >
                    <FlexChild gap={6}>
                      <CheckboxChild id="today" />
                      <P>오늘 날짜로 선택</P>
                    </FlexChild>
                  </CheckboxGroup>
                </FlexChild>
                <FlexChild paddingBottom={6} justifyContent="space-between">
                  <DatePicker
                    disabled={today}
                    min={min}
                    max={max}
                    zIndex={10080}
                    defaultSelectedDate={value ? new Date(value) : undefined}
                    onChange={(value) => setValue((value as Date)?.toString())}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    표시형식
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <Select
                    styles={{
                      display: {
                        color: "#111",
                      },
                    }}
                    value={format}
                    onChange={(value) => setForamt(value as string)}
                    zIndex={10080}
                    options={(() => {
                      const date = new Date();
                      return [
                        {
                          display: `${date.getFullYear()}년 ${String(
                            date.getMonth() + 1
                          ).padStart(2, "0")}월 ${String(
                            date.getDate()
                          ).padStart(2, "0")}일 ${getDateDay(date)}요일`,
                          value: "yyyy년 mm월 dd일 D요일",
                        },
                        {
                          display: `${date.getFullYear()}년 ${String(
                            date.getMonth() + 1
                          ).padStart(2, "0")}월 ${String(
                            date.getDate()
                          ).padStart(2, "0")}일`,
                          value: "yyyy년 mm월 dd일",
                        },
                        {
                          display: `${date.getFullYear()}-${String(
                            date.getMonth() + 1
                          ).padStart(2, "0")}-${String(date.getDate()).padStart(
                            2,
                            "0"
                          )}`,
                          value: "yyyy-mm-dd",
                        },
                        {
                          display: `${date.getFullYear()}(년)`,
                          value: "yyyy",
                        },
                        {
                          display: `${date.getMonth() + 1}(월)`,
                          value: "mm",
                        },
                        {
                          display: `${date.getDate()}(일)`,
                          value: "dd",
                        },
                        {
                          display: `${getDateDay(date)}(요일)`,
                          value: "D",
                        },
                      ];
                    })()}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    최소 날짜
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <DatePicker
                    key={min?.getTime()}
                    disabled={today}
                    zIndex={10080}
                    defaultSelectedDate={min}
                    max={max}
                    onChange={(date) => {
                      date = date as Date;
                      if (
                        date.toLocaleDateString() === min?.toLocaleDateString()
                      ) {
                        setMin(undefined);
                      } else setMin(date);
                    }}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    최대 날짜
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <DatePicker
                    key={max?.getTime()}
                    disabled={today}
                    zIndex={10080}
                    defaultSelectedDate={max}
                    min={min}
                    onChange={(date) => {
                      date = date as Date;
                      if (
                        date.toLocaleDateString() === max?.toLocaleDateString()
                      ) {
                        setMax(undefined);
                      } else setMax(date);
                    }}
                  />
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      );
    }
  );
}
if (!ContractInput.getList().some((input) => input.key === key))
  new DateInput();
