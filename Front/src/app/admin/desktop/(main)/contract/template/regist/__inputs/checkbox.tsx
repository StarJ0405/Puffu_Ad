"use client";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ContractInput from "../class";

const key: string = "checkbox";
export default class CheckboxInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="checkbox" type="svg" size={size} />
      ),
      title: "체크 그룹",
      width: 60,
      height: 60,
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
        <FlexChild justifyContent="center" padding={20}>
          <input
            id={`${props?.name}_checkbox`}
            name={props?.data?.group}
            hidden
            type="checkbox"
          />
          <Image
            src={
              props?.data?.disabled
                ? props?.data?.style?.disabled
                : props?.data?.checked
                ? props?.data?.style?.on
                : props?.data?.style?.off
            }
            width={"100%"}
            height={"100%"}
          />
        </FlexChild>
      );
    }
  );

  public isValid(data: any): boolean {
    if (data?.value?.disabed) return true;

    return false;
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
      const [disabled, setDisabled] = useState(
        props?.value?.disabled || props.data?.disabled
      );
      const [checked, setChecked] = useState(
        props?.value?.checked || props?.data?.checked
      );
      useEffect(() => {
        if (props.onChange) {
          const _data = { checked: false, disabled: false };
          _data.checked = props?.value?.checked || props?.data?.value;
          _data.disabled = props?.value?.disabled || props?.data?.disabled;
          props.onChange(_data);
        }
      }, []);

      return (
        <FlexChild padding={20}>
          <input
            ref={ref}
            id={`${props?.name}_checkbox`}
            hidden
            type="checkbox"
          />
          <Image
            onClick={() => {
              if (!props.data?.disabled) {
                setChecked(!checked);
                props?.onChange?.({ disabled, checked: !checked });
              }
            }}
            src={
              disabled
                ? props?.data?.style?.disabled
                : checked
                ? props?.data?.style?.on
                : props?.data?.style?.off
            }
            width={"100%"}
            height={"100%"}
          />
        </FlexChild>
      );
    }
  );
  public initData() {
    return {
      style: {
        on: "/resources/contract/checkbox_on1.png",
        off: "/resources/contract/checkbox_off1.png",
      },
      group: [
        {
          checked: false,
          text: "",
          value: "체크1",
        },
      ],
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
      const [tooltip, setTooltip] = useState<string>(data?.tooltip || "");
      const [checkList, setCheckList] = useState<string[]>([]);
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
        if (data?.checked) document.getElementById("checked")?.click();
        if (data?.disabled) document.getElementById("disabled")?.click();
        setLoaded(true);
      }, []);
      useImperativeHandle(ref, () => ({
        getValue() {
          return {
            data: {
              assign: assign.map((ass) => ass.replace("_assign", "")),
              require: require.map((req) => req.replace("_require", "")),
              tooltip,
              checked: checkList.includes("checked"),
              disabled: checkList.includes("disabled"),
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
              <CheckboxGroup
                name="status"
                onChange={(values) => setCheckList(values)}
              >
                <VerticalFlex width={400} padding={"0 20px"}>
                  <FlexChild padding={"12px 0"}>
                    <P fontSize={20} fontWeight={700}>
                      그룹명
                    </P>
                  </FlexChild>
                  <FlexChild>
                    <Input style={{ padding: "6px 12px" }} />
                  </FlexChild>

                  <FlexChild
                    padding={"12px 0"}
                    borderTop={"1px solid #d0d0d0"}
                    marginTop={12}
                  >
                    <P fontSize={20} fontWeight={700}>
                      기본 체크
                    </P>
                  </FlexChild>
                  <FlexChild paddingBottom={6} gap={12}>
                    <CheckboxChild id="checked" />
                    <P>체크됨</P>
                  </FlexChild>
                  <FlexChild paddingBottom={6} gap={12}>
                    <CheckboxChild id="disabled" />
                    <P>비활성화</P>
                  </FlexChild>
                </VerticalFlex>
              </CheckboxGroup>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      );
    }
  );
}
if (!ContractInput.getList().some((input) => input.key === key))
  new CheckboxInput();
