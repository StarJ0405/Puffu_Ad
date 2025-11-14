"use client";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Input from "@/components/inputs/Input";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ContractInput from "../class";

const key: string = "number";
export default class NumberInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="number" type="svg" size={size} />
      ),
      title: "숫자",
      width: 150,
      height: 60,
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
      return (
        <FlexChild justifyContent="center">
          <input
            placeholder={props?.data?.placeholder || "(숫자)"}
            type="number"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              textOverflow: "clip",
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              textDecorationLine: "inherit",
              fontStyle: "inherit",
              color: "inherit",
              textAlign: "inherit",
            }}
            min={props?.data?.min}
            max={props?.data?.max}
            inputMode={props?.data?.inputMode}
            maxLength={props?.data?.limit ? props?.data?.limit : undefined}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              (e.target as HTMLInputElement).focus();
            }}
            onBlur={(e) => {
              let value = Number(e.target.value);

              if (props?.data?.min) {
                value = Math.max(Number(props.data.min), value);
              }
              if (props?.data?.max) {
                value = Math.min(Number(props.data.max), value);
              }
              e.target.value = String(value);
              props?.onChange?.({ value });
            }}
            defaultValue={props?.data?.value}
          />
        </FlexChild>
      );
    }
  );
  public isValid(data: any): boolean {
    return !!data?.value;
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
          props.onChange({ value: props.data.value });
      }, []);

      return (
        <input
          ref={ref}
          type="number"
          placeholder={props?.data?.placeholder || "(숫자)"}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            textOverflow: "clip",
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            textDecorationLine: "inherit",
            fontStyle: "inherit",
            color: "inherit",
            textAlign: "inherit",
          }}
          min={props?.data?.min}
          max={props?.data?.max}
          maxLength={props?.data?.limit ? props?.data?.limit : undefined}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const target = e.target as HTMLInputElement;
            target.focus();
          }}
          onBlur={(e) => {
            let value = Number(e.target.value);
            if (props.data?.min) {
              value = Math.max(Number(props.data.min), value);
            }
            if (props.data?.max) {
              value = Math.min(Number(props.data.max), value);
            }
            props?.onChange?.({ value });
          }}
          value={props?.value || props?.data?.value}
        />
      );
    }
  );
  public initData() {
    return {
      limit: 0,
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
      const [min, setMin] = useState<number>(data?.min);
      const [max, setMax] = useState<number>(data?.max);

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
              value,
              min: min ? min : undefined,
              max: max ? max : undefined,
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
                {/* <FlexChild paddingBottom={6}>
                  <CheckboxGroup
                    name="icon"
                    onChange={(values) => setIcon(values.includes("icon"))}
                  >
                    <FlexChild gap={6}>
                      <CheckboxChild
                        id="icon"
                        size={14}
                        width={14}
                        height={14}
                      />
                      <P fontSize={14}>아이콘 표시</P>
                    </FlexChild>
                  </CheckboxGroup>
                </FlexChild> */}
                <FlexChild>
                  <InputTextArea
                    width={"100%"}
                    onChange={(value) => setPlaceholder(value)}
                    value={data.placeholder}
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
                <FlexChild>
                  <Input
                    type="number"
                    style={{ padding: "6px 12px" }}
                    value={value}
                    onChange={(value) => setValue(value as string)}
                    min={min ? min : -99999999999}
                    max={max ? max : 99999999999}
                  />
                </FlexChild>

                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    최솟값
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <Input
                    type="number"
                    value={min}
                    onChange={(value) => setMin(Number(value))}
                    min={-99999999999}
                    max={max ? max : 99999999999}
                  />
                </FlexChild>

                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    최댓값
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <Input
                    type="number"
                    value={max}
                    onChange={(value) => setMax(Number(value))}
                    min={min ? min : -99999999999}
                    max={99999999999}
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
  new NumberInput();
