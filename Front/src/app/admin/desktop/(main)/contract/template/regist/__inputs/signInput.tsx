import Icon from "@/components/icons/Icon";
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
}
if (!ContractInput.getList().some((input) => input.key === key))
  new SignatureInput();
