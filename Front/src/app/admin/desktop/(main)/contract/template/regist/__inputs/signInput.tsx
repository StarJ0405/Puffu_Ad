"use client";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputColor from "@/components/inputs/InputColor";
import InputNumber from "@/components/inputs/InputNumber";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import NiceModal from "@ebay/nice-modal-react";
import {
  forwardRef,
  JSX,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ContractInput from "../class";

const key: string = "signature";
export default class SignatureInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="signature" type="svg" size={size} />
      ),
      title: "서명",
      width: 150,
      height: 60,
    });
  }
  public getWrite(props?: {
    url?: string;
    onChange?: (data: any) => void;
    name?: string;
    width: number;
    height: number;
  }): JSX.Element {
    return (
      <FlexChild
        onClick={() =>
          NiceModal.show("contract/signature", {
            onConfirm: props?.onChange,
            name: props?.name,
          })
        }
        justifyContent="center"
      >
        {props?.url ? (
          <Image
            src={props.url}
            width={"100%"}
            height={"auto"}
            maxHeight={props.height}
            maxWidth={props.width}
          />
        ) : (
          this.getIcon(32)
        )}
      </FlexChild>
    );
  }
  public initData() {
    return {
      tabs: ["그리기", "텍스트"],
      penSize: 1,
      penColor: "#000000",
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
      const [tabs, setTabs] = useState<string[]>([]);
      const [require, setRequire] = useState<string[]>([]);
      const [loaded, setLoaded] = useState<boolean>(false);
      const [icon, setIcon] = useState<boolean>(false);
      const [placeholder, setPlaceholder] = useState<string>(
        data?.placeholder || ""
      );
      const [tooltip, setTooltip] = useState<string>(data?.tooltip || "");
      const [penSize, setPenSize] = useState<number>(
        Number(data?.penSize || 1)
      );
      const [penColor, setPenColor] = useState<string>(data?.penColor || "");
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
        if (data?.tabs) {
          data?.tabs.forEach?.((tab: string) =>
            document.getElementById(tab)?.click()
          );
        }
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
              tabs,
              penSize,
              penColor,
            },
            name,
          };
        },
        isValid() {
          return !!name && tabs.length > 0;
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
                    서명유형
                  </P>
                </FlexChild>
                <FlexChild>
                  <CheckboxGroup name="tabs" onChange={(tabs) => setTabs(tabs)}>
                    <VerticalFlex gap={6}>
                      {["그리기", "텍스트"].map((tab) => (
                        <FlexChild key={tab} gap={6}>
                          <CheckboxChild
                            id={tab}
                            size={14}
                            width={14}
                            height={14}
                          />
                          <P fontSize={14}>{tab}</P>
                        </FlexChild>
                      ))}
                    </VerticalFlex>
                  </CheckboxGroup>
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    펜 설정
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6} justifyContent="space-between">
                  <P>서명펜 두께</P>
                  <InputNumber
                    width={50}
                    hideArrow
                    value={penSize}
                    onChange={(value) => setPenSize(value)}
                  />
                </FlexChild>
                <FlexChild paddingBottom={6} justifyContent="space-between">
                  <P>서명펜 색</P>
                  <InputColor
                    displayType="bar"
                    zIndex={10080}
                    value={penColor}
                    onChange={(color) => {
                      const rgb = color.rgb;
                      setPenColor(
                        `#${Number(rgb.r).toString(16)}${Number(rgb.g).toString(
                          16
                        )}${Number(rgb.b).toString(16)}`
                      );
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
  new SignatureInput();
