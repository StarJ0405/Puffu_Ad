"use client";
import FlexChild from "@/components/flex/FlexChild";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import NiceModal from "@ebay/nice-modal-react";
import { JSX } from "react";
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
            textOverflow: "ellipsis",
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
    url?: string;
    onChange?: (data: any) => void;
    name?: string;
    width: number;
    height: number;
  }): JSX.Element {
    return (
      <FlexChild
        onClick={() =>
          NiceModal.show("contract/text", {
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
}
if (!ContractInput.getList().some((input) => input.key === key))
  new TextInput();
