import Button from "@/components/buttons/Button";
import style from "./ModalBase.module.css";
import Image from "@/components/Image/Image";

function ModalBaseMain(props: any) {
  return (
    <div
      className={style.main}
      style={{ padding: props?.padding ? props.padding + "px" : undefined }}
    >
      {props.withCloseButton ? (
        <Button className={style.closeButton} onClick={props.modalClose}>
          <Image src="/resources/icons/closeBtn.png" size={props.size || 12} />
        </Button>
      ) : null}

      {props.children}
    </div>
  );
}

export default ModalBaseMain;
