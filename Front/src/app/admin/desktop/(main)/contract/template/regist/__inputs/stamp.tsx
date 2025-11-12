"use client";
import FlexChild from "@/components/flex/FlexChild";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import NiceModal from "@ebay/nice-modal-react";
import { JSX } from "react";
import ContractInput from "../class";

const key: string = "stamp";

export default class StampInput extends ContractInput {
  constructor() {
    super({
      key: key,
      icon: ({ size }) => (
        <Icon src="contract/" name="stamp" type="svg" size={size} />
      ),
      title: "회사 도장",
      width: 90,
      height: 90,
    });
  }

  public getWrite(props?: {
    url?: string;
    onChange?: (data: any) => void;
    width: number;
    height: number;
    list: string[];
  }): JSX.Element {
    return (
      <FlexChild
        onClick={() =>
          NiceModal.show("contract/stamp", {
            onConfirm: props?.onChange,
            list: props?.list || [],
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
  new StampInput();
