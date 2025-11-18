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
import NiceModal from "@ebay/nice-modal-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ContractInput from "../class";

const key: string = "record";
export default class RecordInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="record" type="svg" size={size} />
      ),
      title: "녹음",
      width: 60,
      height: 60,
      textable: true,
    });
  }
  public isValid(data: any, value: any): boolean {
    return !!value?.value?.audio;
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
        <FlexChild Ref={ref} justifyContent="center">
          <FlexChild
            width={"max-content"}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              NiceModal.show("contract/record", {
                onConfirm: props.onChange,
                audio: props?.value?.audio,
              });
            }}
          >
            {this.getIcon(32)}
          </FlexChild>
        </FlexChild>
      );
    }
  );
  public initData() {
    return {};
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

        setLoaded(true);
      }, []);
      useImperativeHandle(ref, () => ({
        getValue() {
          return {
            data: {
              assign: assign.map((ass) => ass.replace("_assign", "")),
              require: require.map((req) => req.replace("_require", "")),
              tooltip,
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
                      const removed = assign.filter((f) => !values.includes(f));
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
      );
    }
  );
}
if (!ContractInput.getList().some((input) => input.key === key))
  new RecordInput();
