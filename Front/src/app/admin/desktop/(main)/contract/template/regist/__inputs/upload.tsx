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
import NiceModal from "@ebay/nice-modal-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ContractInput from "../class";
import Div from "@/components/div/Div";

const key: string = "upload";

export default class UploadInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="upload" type="svg" size={size} />
      ),
      title: "첨부",
      width: 90,
      height: 90,
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
        <FlexChild Ref={ref} justifyContent="center">
          <FlexChild position="relative" width={"max-content"}>
            {this.getIcon(32)}
          </FlexChild>
        </FlexChild>
      );
    }
  );
  public isValid(data: any, value: any): boolean {
    return value?.files?.length >= data?.min;
  }
  public initData() {
    return {
      min: 0,
      max: 9,
      fileSize: 10,
    };
  }
  public Write = forwardRef(
    (
      props: {
        data: any;
        value?: any;
        onChange?: (data: any) => void;
        width: number;
        height: number;
        list: string[];
      },
      ref: any
    ) => {
      return (
        <FlexChild
          Ref={ref}
          onClick={() =>
            NiceModal.show("contract/upload", {
              onConfirm: props?.onChange,
              files: props?.value?.files || [],
              min: props?.data?.min,
              max: props?.data?.max,
              fileSize: props?.data?.fileSize,
            })
          }
          justifyContent="center"
        >
          <FlexChild position="relative" width={"max-content"}>
            {this.getIcon(32)}
            <Div
              position="absolute"
              display="flex"
              top={"-50%"}
              right={"0"}
              transform="translate(25%, 25%)"
              backgroundColor="var(--admin-color)"
              borderRadius={"100%"}
              textAlign="center"
              color="#fff"
              width={24}
              height={24}
              fontSize={14}
              hidden={!props.value?.files?.length}
              justifyContent="center"
              alignItems="center"
            >
              <P>{props.value?.files?.length}</P>
            </Div>
          </FlexChild>
        </FlexChild>
      );
    }
  );

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
      const [min, setMin] = useState<number>(data?.min || 0);
      const [max, setMax] = useState<number>(data?.max || 0);
      const [fileSize, setFileSize] = useState<number>(data?.fileSize || 0);
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
              min,
              max,
              fileSize,
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
              height={"100%"}
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
              <VerticalFlex width={400} padding={"0 20px"}>
                <FlexChild padding={"12px 0"}>
                  <P fontSize={20} fontWeight={700}>
                    최소 파일 업로드 수
                  </P>
                </FlexChild>
                <FlexChild>
                  <InputNumber
                    value={min}
                    onChange={(value) => setMin(value)}
                    max={max}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    최대 파일 업로드 수
                  </P>
                </FlexChild>
                <FlexChild>
                  <InputNumber
                    value={max}
                    onChange={(value) => setMax(value)}
                    min={min}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    파일당 용량 제한(MB)
                  </P>
                </FlexChild>
                <FlexChild>
                  <InputNumber
                    value={fileSize}
                    onChange={(value) => setFileSize(value)}
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
  new UploadInput();
