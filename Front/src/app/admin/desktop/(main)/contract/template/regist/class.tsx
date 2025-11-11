import FlexChild from "@/components/flex/FlexChild";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import clsx from "clsx";
import { CSSProperties } from "react";
import styles from "./page.module.css";
import("@/app/admin/desktop/(main)/contract/template/regist/__inputs");
type IconComponent = (props: InputProps) => React.ReactNode;
interface Props {
  key: string;
  icon: string | IconComponent;
  title: string;
  width: number;
  height: number;
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
  selected?: boolean;
}
export default abstract class ContractInput {
  public readonly key: Props["key"];
  protected icon: Props["icon"];
  protected title: Props["title"];
  protected width: number;
  protected height: number;
  public readonly Input: (props: InputProps) => React.ReactNode;
  constructor({ key, icon, title, width, height }: Props) {
    this.key = key;
    this.icon = icon;
    this.title = title;
    this.width = width;
    this.height = height;
    this.Input = ({
      gap = 6,
      size = 24,
      fontSize,
      fontWeight,
      lineHeight,
      color,
      onClick,
      onMouseUp,
      selected = false,
    }: InputProps) => (
      <FlexChild
        gap={gap}
        className={clsx(styles.slot_input, { [styles.selected]: selected })}
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
  public getInput(): React.JSX.Element {
    return <FlexChild justifyContent="center">{this.getIcon(32)}</FlexChild>;
  }
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
  public getWrite(props?: { onChange?: (data: any) => void }) {
    return <FlexChild justifyContent="center">{this.getIcon(32)}</FlexChild>;
  }
  protected static map: Map<string, ContractInput> = new Map();
  public static getList(): readonly ContractInput[] {
    return Array.from(this.map.values());
  }
}
