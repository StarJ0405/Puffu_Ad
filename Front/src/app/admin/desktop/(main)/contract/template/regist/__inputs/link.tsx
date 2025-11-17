"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Input from "@/components/inputs/Input";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ContractInput from "../class";

const key: string = "link";
export default class LinkInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="link" type="svg" size={size} />
      ),
      title: "하이퍼링크",
      width: 150,
      height: 60,
      textable: true,
      assignanble: false,
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
      const [hover, setHover] = useState<boolean>(false);
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
            <a
              href={props?.data?.url}
              target="_blank"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                color: hover ? "blue" : undefined,
                textDecorationLine: hover ? "underline" : undefined,
              }}
            >
              <P width={"100%"}>
                {props?.data?.display || "링크를 입력해주세요.."}
              </P>
            </a>
          </FlexChild>
        </FlexChild>
      );
    }
  );
  public isValid(data: any, value: any): boolean {
    return !!value?.display && !!value?.url;
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
      const [hover, setHover] = useState<boolean>(false);
      useEffect(() => {
        if (
          props.onChange &&
          !props.value &&
          (props?.data?.display || props?.data?.url)
        )
          props.onChange({
            value: {
              display: props?.data?.display || "",
              url: props.data?.url || "",
            },
          });
      }, []);

      return (
        <a
          href={props?.data?.url}
          target="_blank"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            color: hover ? "blue" : undefined,
            textDecorationLine: hover ? "underline" : undefined,
          }}
        >
          <P width={"100%"}>
            {props?.data?.display || "링크를 입력해주세요.."}
          </P>
        </a>
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
      const [loaded, setLoaded] = useState<boolean>(false);
      const [icon, setIcon] = useState<boolean>(false);
      const [tooltip, setTooltip] = useState<string>(data?.tooltip || "");
      const [display, setDisplay] = useState<string>(data?.display || "");
      const [url, setUrl] = useState<string>(data?.url || "");

      useEffect(() => {
        setLoaded(true);
      }, []);
      useImperativeHandle(ref, () => ({
        getValue() {
          return {
            data: {
              icon,
              tooltip,
              display,
              url,
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
                    표시할 텍스트
                  </P>
                </FlexChild>
                <FlexChild>
                  <Input
                    style={{ padding: "6px 12px" }}
                    value={display}
                    onChange={(value) => setDisplay(value as string)}
                  />
                </FlexChild>
                <FlexChild
                  padding={"12px 0"}
                  borderTop={"1px solid #d0d0d0"}
                  marginTop={12}
                >
                  <P fontSize={20} fontWeight={700}>
                    URL
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6} justifyContent="space-between">
                  <Input
                    style={{ padding: "6px 12px" }}
                    value={url}
                    onChange={(value) => setUrl(value as string)}
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
  new LinkInput();
