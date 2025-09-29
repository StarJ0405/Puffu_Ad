import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import NiceModal from "@ebay/nice-modal-react";
import { useRef } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import ModalBase from "../../ModalBase";
import styles from "./PostaCodelModal.module.css";

const PostalCodeModal = NiceModal.create(
  ({
    onSuccess,
  }: {
    onSuccess?: ({
      postal_code,
      address1,
    }: {
      postal_code: string;
      address1: string;
    }) => void;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const [width, height] = ["100vw", "100dvh"];
    const withCloseButton = false;
    const clickOutsideToClose = false;
    const title = "";
    const buttonText = "close";
    const modal = useRef<any>(null);

    const complete = (data: any) => {
      let fullAddress = data.address;
      let extraAddress = "";

      if (data.addressType === "R") {
        if (data.bname !== "") {
          extraAddress += data.bname;
        }
        if (data.buildingName !== "") {
          extraAddress +=
            extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
      }

      onSuccess?.({ postal_code: data.zonecode, address1: fullAddress });
      modal.current.close();
    };
    return (
      <ModalBase
        borderRadius={10}
        zIndex={10055}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={withCloseButton}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
      >
        <VerticalFlex maxHeight={"60dvh"} overflow="scroll" gap={10}>
          <FlexChild className={styles.header}>
            <P>우편번호 찾기</P>
            <Image
              marginLeft={"auto"}
              src="/resources/icons/closeBtn_black.png"
              size={14}
              onClick={() => modal.current.close()}
            />
          </FlexChild>

          <DaumPostcodeEmbed
            style={{
              height: "calc(100dvh - 48px)",
              minHeight: "calc(100dvh - 48px)",
            }}
            autoClose
            onComplete={complete}
          />
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default PostalCodeModal;
