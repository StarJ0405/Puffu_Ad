"use client";
import Icon from "@/components/icons/Icon";
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
}
if (!ContractInput.getList().some((input) => input.key === key))
  new StampInput();
