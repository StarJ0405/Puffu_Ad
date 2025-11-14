"use client";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import("@/app/admin/desktop/(main)/contract/template/regist/__inputs");
type IconComponent = (props: InputProps) => React.ReactNode;
interface Props {
  key: string;
  icon: string | IconComponent;
  title: string;
  width: number;
  height: number;
  textable?: boolean;
}
interface InputProps {
  gap?: CSSProperties["gap"];
  size?: CSSProperties["width"] | CSSProperties["height"];
  fontSize?: CSSProperties["fontSize"];
  fontWeight?: CSSProperties["fontWeight"];
  lineHeight?: CSSProperties["lineHeight"];
  color?: CSSProperties["color"];
  onClick?: React.HTMLAttributes<HTMLEmbedElement>["onClick"];
  onMouseUp?: React.HTMLAttributes<HTMLEmbedElement>["onMouseUp"];
  className?: React.HTMLAttributes<HTMLElement>["className"];
}
export default abstract class ContractInput {
  public readonly key: Props["key"];
  protected icon: Props["icon"];
  protected title: Props["title"];
  protected width: number;
  protected height: number;
  protected textable: boolean;
  public readonly Input: (props: InputProps) => React.ReactNode;
  constructor({ key, icon, title, width, height, textable = false }: Props) {
    this.key = key;
    this.icon = icon;
    this.title = title;
    this.width = width;
    this.height = height;
    this.textable = textable;
    this.Input = ({
      gap = 6,
      size = 24,
      fontSize,
      fontWeight,
      lineHeight,
      color,
      onClick,
      onMouseUp,
      className,
    }: InputProps) => (
      <FlexChild
        gap={gap}
        className={className}
        onMouseDown={onClick}
        onMouseUp={onMouseUp}
      >
        {typeof icon === "string" ? (
          <Image src={icon} size={size} />
        ) : (
          icon({ size })
        )}
        <P
          fontSize={fontSize}
          fontWeight={fontWeight}
          lineHeight={lineHeight}
          color={color}
          transition="none"
        >
          {title}
        </P>
      </FlexChild>
    );
    ContractInput.map.set(key, this);
  }

  public getEmpty(): HTMLElement {
    const div = document.createElement("div");
    div.style.width = `${this.width}px`;
    div.style.height = `${this.height}px`;
    div.style.border = "1px dotted #111";
    div.style.position = "absolute";
    div.style.zIndex = "1";
    div.style.pointerEvents = "none";
    return div;
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
          {props?.data?.icon && this.getIcon(32)}
          {props?.data?.placeholder && <P>{props?.data?.placeholder}</P>}
        </FlexChild>
      );
    }
  );
  public getIcon(size: number) {
    return typeof this.icon === "string" ? (
      <Image src={this.icon} size={size} />
    ) : (
      this.icon({ size })
    );
  }
  public getTitle() {
    return this.title;
  }
  public getKey() {
    return this.key;
  }
  public getWidth(): number {
    return this.width;
  }
  public getHeight(): number {
    return this.height;
  }
  public isValid(data: any, value: any): boolean {
    return true;
  }
  public Write: any = forwardRef(
    (props: { onChange?: (data: any) => void; data: any }, ref: any) => {
      return (
        <FlexChild Ref={ref} justifyContent="center">
          {props?.data?.icon && this.getIcon(32)}
          {props?.data?.placeholder && <P>{props?.data?.placeholder}</P>}
        </FlexChild>
      );
    }
  );
  public getTextable() {
    return this.textable;
  }
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
      const [icon, setIcon] = useState<boolean>(false);
      const [placeholder, setPlaceholder] = useState<string>(
        data?.placeholder || ""
      );
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
        if (data?.icon) {
          document.getElementById("icon")?.click();
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
            },
            name,
          };
        },
        isValid() {
          return !!name;
        },
      }));
      return (
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
                      .forEach((req) => document.getElementById(req)?.click());
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
                          loaded && !assign.some((f) => f.startsWith(user.name))
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
                <CheckboxChild id="icon" size={14} width={14} height={14} />
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
      );
    }
  );
  protected static map: Map<string, ContractInput> = new Map();
  public static getList(): readonly ContractInput[] {
    return Array.from(this.map.values());
  }
}
