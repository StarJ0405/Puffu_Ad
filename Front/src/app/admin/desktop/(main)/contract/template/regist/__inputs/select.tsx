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
import Select from "@/components/select/Select";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ContractInput from "../class";

const key: string = "select";
export default class SelectInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="select" type="svg" size={size} />
      ),
      title: "선택 상자",
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
      return (
        <FlexChild justifyContent="center">
          <FlexChild
            position="relative"
            width={"100%"}
            backgroundColor="transparent"
            border={"1px solid #d0d0d0"}
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
            <P width={"100%"}>
              {props?.data?.value || props?.data?.placeholder || "선택하세요.."}
            </P>
            <Image
              src={"/resources/icons/down_arrow.png"}
              width={10}
              height={"auto"}
            />
          </FlexChild>
        </FlexChild>
      );
    }
  );
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
      const [fold, setFold] = useState(true);
      useEffect(() => {
        if (props.onChange && !props.value && props.data.value)
          props.onChange({ value: props.data.value });
      }, []);
      useEffect(() => {
        if (!fold) {
          const handelMouseDown = () => {
            setFold(true);
          };
          window.addEventListener("mousedown", handelMouseDown);
          return () => window.removeEventListener("mousedown", handelMouseDown);
        }
      }, [fold]);
      return (
        <FlexChild
          position="relative"
          width={"100%"}
          backgroundColor="transparent"
          border={"1px solid #d0d0d0"}
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFold(false);
          }}
        >
          <P width={"100%"}>
            {props?.value ||
              props?.data?.value ||
              props?.data?.placeholder ||
              "선택하세요.."}
          </P>
          <Image
            src={"/resources/icons/down_arrow.png"}
            width={10}
            height={"auto"}
          />
          <FlexChild
            position="absolute"
            top={"100%"}
            left={0}
            transform="translate(0, 0)"
            hidden={fold}
          >
            <VerticalFlex
              backgroundColor="#fff"
              maxHeight={28 * 8}
              overflowY="auto"
            >
              {props.data.items.map((item: any) => (
                <FlexChild
                  key={`${item.display}_${item.index}`}
                  backgroundColor="transparent"
                  border={"1px solid #d0d0d0"}
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
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.onChange?.({ value: item.display });
                    setFold(true);
                  }}
                >
                  <P>{item.display}</P>
                </FlexChild>
              ))}
            </VerticalFlex>
          </FlexChild>
        </FlexChild>
      );
    }
  );
  public initData() {
    return {
      items: [
        {
          display: "아이템1",
          index: 0,
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
      const [icon, setIcon] = useState<boolean>(false);
      const [placeholder, setPlaceholder] = useState<string>(
        data?.placeholder || ""
      );
      const [tooltip, setTooltip] = useState<string>(data?.tooltip || "");
      const [value, setValue] = useState<string>(data?.value || "");
      const [items, setItems] = useState<{ display: string; index: number }[]>(
        data?.items || []
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
              items,
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
                <FlexChild padding={"12px 0"} gap={5}>
                  <P fontSize={20} fontWeight={700}>
                    아이템리스트
                  </P>
                  <Image
                    src="/resources/images/plus.png"
                    size={20}
                    cursor="pointer"
                    onClick={() => {
                      let number = 1;
                      while (true) {
                        if (
                          items.some(
                            (item) => item.display === `아이템${number}`
                          )
                        ) {
                          number++;
                          continue;
                        } else {
                          break;
                        }
                      }
                      setItems([
                        ...items,
                        {
                          display: `아이템${number}`,
                          index: items.length,
                        },
                      ]);
                    }}
                  />
                </FlexChild>
                <FlexChild>
                  <HorizontalFlex>
                    <FlexChild width={110}>
                      <VerticalFlex>
                        <FlexChild
                          justifyContent="center"
                          padding={5}
                          border={"1px solid #111"}
                          borderBottom={"3px double #111"}
                        >
                          <P
                            fontWeight={600}
                            fontSize={16}
                            lineHeight={1.3}
                            color="#111"
                          >
                            순서
                          </P>
                        </FlexChild>
                        {items
                          .sort((i1, i2) => i1.index - i2.index)
                          .map((item) => (
                            <FlexChild
                              key={`${item.index}_${item.display}`}
                              justifyContent="center"
                              padding={5}
                              border={"1px solid #d0d0d0"}
                              height={28}
                              gap={5}
                            >
                              <Image
                                src="/resources/images/minus.png"
                                size={14}
                                cursor={
                                  item.index > 0 ? "pointer" : "not-allowed"
                                }
                                onClick={() => {
                                  if (item.index > 0) {
                                    const index = item.index;
                                    const pre = items[index - 1];
                                    pre.index = index;
                                    item.index = index - 1;
                                    items[index] = pre;
                                    items[index - 1] = item;
                                    setItems([...items]);
                                  }
                                }}
                              />
                              <input
                                defaultValue={item.index}
                                type="number"
                                style={{
                                  textAlign: "center",
                                  fontWeight: 500,
                                  fontSize: 14,
                                  lineHeight: 1.1,
                                  color: "#111",
                                  outline: "none",
                                  border: "none",
                                  width: 40,
                                }}
                                max={items.length - 1}
                                min={0}
                                onBlur={(e) => {
                                  let changedIndex = Number(e.target.value);
                                  changedIndex = Math.min(
                                    Math.max(0, changedIndex),
                                    items.length - 1
                                  );
                                  e.target.value = changedIndex.toString();
                                  const nowIndex = item.index;
                                  const changed = items[changedIndex];
                                  changed.index = nowIndex;
                                  item.index = changedIndex;
                                  items[nowIndex] = changed;
                                  items[changedIndex] = item;
                                  setItems([...items]);
                                }}
                              />
                              <Image
                                src="/resources/images/plus.png"
                                size={14}
                                cursor={
                                  item.index < items.length - 1
                                    ? "pointer"
                                    : "not-allowed"
                                }
                                onClick={() => {
                                  if (item.index < items.length - 1) {
                                    const index = item.index;
                                    const next = items[index + 1];
                                    next.index = index;
                                    item.index = index + 1;
                                    items[index] = next;
                                    items[index + 1] = item;
                                    setItems([...items]);
                                  }
                                }}
                              />
                            </FlexChild>
                          ))}
                      </VerticalFlex>
                    </FlexChild>
                    <FlexChild>
                      <VerticalFlex>
                        <FlexChild
                          justifyContent="center"
                          padding={5}
                          border={"1px solid #111"}
                          borderBottom={"3px double #111"}
                        >
                          <P
                            fontWeight={600}
                            fontSize={16}
                            lineHeight={1.3}
                            color="#111"
                          >
                            아이템값
                          </P>
                        </FlexChild>
                        {items
                          .sort((i1, i2) => i1.index - i2.index)
                          .map((item) => (
                            <FlexChild
                              key={`${item.index}_${item.display}`}
                              justifyContent="center"
                              padding={5}
                              border={"1px solid #d0d0d0"}
                              height={28}
                            >
                              <input
                                defaultValue={item.display}
                                style={{
                                  textAlign: "center",
                                  fontWeight: 500,
                                  fontSize: 14,
                                  lineHeight: 1.1,
                                  color: "#111",
                                  outline: "none",
                                  border: "none",
                                  width: "100%",
                                }}
                                onBlur={(e) => {
                                  if (value == item.display) {
                                    setValue(e.target.value);
                                  }
                                  item.display = e.target.value;
                                  setItems([...items]);
                                }}
                              />
                            </FlexChild>
                          ))}
                      </VerticalFlex>
                    </FlexChild>
                    <FlexChild width={50}>
                      <VerticalFlex>
                        <FlexChild
                          justifyContent="center"
                          padding={5}
                          border={"1px solid #111"}
                          borderBottom={"3px double #111"}
                        >
                          <P
                            height={"100%"}
                            fontWeight={600}
                            fontSize={16}
                            lineHeight={1.3}
                            color="#111"
                          >
                            제거
                          </P>
                        </FlexChild>
                        {items
                          .sort((i1, i2) => i1.index - i2.index)
                          .map((item) => (
                            <FlexChild
                              key={`${item.index}_${item.display}`}
                              justifyContent="center"
                              padding={5}
                              border={"1px solid #d0d0d0"}
                              height={28}
                            >
                              <Image
                                src="/resources/images/minus.png"
                                size={16}
                                cursor={
                                  items.length > 1 ? "pointer" : "not-allowed"
                                }
                                onClick={() => {
                                  if (items.length > 1) {
                                    setItems(
                                      items
                                        .sort((i1, i2) => i1.index - i2.index)
                                        .filter((f) => f.index !== item.index)
                                        .map((item, index) => ({
                                          display: item.display,
                                          index,
                                        }))
                                    );
                                  }
                                }}
                              />
                            </FlexChild>
                          ))}
                      </VerticalFlex>
                    </FlexChild>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    기본값
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6} justifyContent="space-between">
                  <Select
                    styles={{
                      display: {
                        color: "#111",
                      },
                    }}
                    value={value}
                    zIndex={10080}
                    options={[
                      {
                        display: "없음",
                        value: "",
                      },
                      ...items.map((item) => ({
                        display: item.display,
                        value: item.display,
                      })),
                    ]}
                    onChange={(value) => setValue(value as string)}
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
  new SelectInput();
