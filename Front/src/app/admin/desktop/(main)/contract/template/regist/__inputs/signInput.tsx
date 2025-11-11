"use client";
import FlexChild from "@/components/flex/FlexChild";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import NiceModal from "@ebay/nice-modal-react";
import { JSX } from "react";
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
}
if (!ContractInput.getList().some((input) => input.key === key))
  new SignatureInput();
