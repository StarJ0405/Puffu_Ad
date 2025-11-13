"use client";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import {
  forwardRef,
  JSX,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ContractInput from "../class";

const key: string = "text";
export default class TextInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="text" type="svg" size={size} />
      ),
      title: "텍스트",
      width: 150,
      height: 60,
      textable: true,
    });
  }
  public getInput(props?: {
    onChange?: (data: any) => void;
    data?: any;
  }): React.JSX.Element {
    return (
      <FlexChild justifyContent="center">
        <input
          placeholder="(텍스트)"
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
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            (e.target as HTMLInputElement).focus();
          }}
          onChange={(e) => props?.onChange?.({ value: e.target.value })}
          defaultValue={props?.data?.value}
        />
      </FlexChild>
    );
  }
  public getWrite(props?: {
    data?: any;
    onChange?: (data: any) => void;
    name?: string;
    width: number;
    height: number;
  }): JSX.Element {
    return (
      <input
        placeholder="(텍스트)"
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
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          (e.target as HTMLInputElement).focus();
        }}
        onChange={(e) => props?.onChange?.({ value: e.target.value })}
        defaultValue={props?.data?.value}
      />
    );
  }
  public initData() {
    return {
      inputMode: "text",
      inputType: "text",
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
      const [inputMode, setInputMode] = useState<string>(data?.inputMode || "");
      const [inputType, setInputType] = useState<string>(data?.inputType || "");
      const [limitCount, setLimitCount] = useState<boolean>(data?.limit > 0);
      const [limit, setLimit] = useState<number>(data?.limit || 0);

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
              inputMode,
              inputType,
              limit: limitCount ? limit : 0,
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
                <FlexChild paddingBottom={6}>
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
                </FlexChild>
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
                    style={{ padding: "6px 12px" }}
                    value={value}
                    onChange={(value) => setValue(value as string)}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    입력 타입
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6} justifyContent="space-between">
                  <Select
                    styles={{
                      display: {
                        color: "#111",
                      },
                    }}
                    zIndex={10080}
                    value={inputType}
                    options={[
                      { display: "일반 텍스트", value: "text" },
                      {
                        display: "우편번호",
                        value: "postalcode",
                      },
                      {
                        display: "주소",
                        value: "address",
                      },
                      {
                        display: "(우편번호) 주소",
                        value: "postaladdress",
                      },
                    ]}
                    onChange={(value) => setInputType(value as string)}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    입력 가능 글자 수
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <CheckboxGroup
                    name="limit"
                    onChange={(values) => {
                      setLimitCount(values.includes("limit"));
                      setLimit(values.includes("limit") ? 1000 : 0);
                    }}
                  >
                    <FlexChild gap={6}>
                      <CheckboxChild id="limit" />
                      <P>글자수 제한</P>
                    </FlexChild>
                  </CheckboxGroup>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <InputNumber
                    disabled={!limitCount}
                    value={limit}
                    onChange={(value) => setLimit(value)}
                    min={limitCount ? 1 : 0}
                    max={1000}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    키패드 타입 (모바일 전용)
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <Select
                    styles={{
                      display: {
                        color: "#111",
                      },
                    }}
                    zIndex={10080}
                    value={inputMode}
                    options={[
                      {
                        display: "기본",
                        value: "text",
                      },
                      {
                        display: "이메일",
                        value: "email",
                      },
                      {
                        display: "전화번호",
                        value: "tel",
                      },
                      {
                        display: "URL",
                        value: "url",
                      },
                      {
                        display: "숫자",
                        value: "numeric",
                      },
                    ]}
                    onChange={(value) => setInputMode(value as string)}
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
  new TextInput();
