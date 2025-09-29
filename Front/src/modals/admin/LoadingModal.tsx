import Center from "@/components/center/Center";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import NiceModal from "@ebay/nice-modal-react";
import { RefObject, useImperativeHandle, useRef, useState } from "react";
import ModalBase from "../ModalBase";
import P from "@/components/P/P";
const LoadingModal = NiceModal.create(
  ({
    ref,
    message: props_message,
  }: {
    ref: RefObject<any>;
    message?: React.ReactNode;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const [width, height] = ["100%", "100%"];
    const withCloseButton = false;
    const clickOutsideToClose = false;
    const title = "";
    const buttonText = "";
    const modal = useRef<any>(null);
    const [message, setMessage] = useState<React.ReactNode>(props_message);
    useImperativeHandle<any, any>(ref, () => ({
      close() {
        modal.current.close();
      },
      setMessage(message: React.ReactNode) {
        setMessage(message);
      },
    }));
    return (
      <ModalBase
        zIndex={10055}
        ref={modal}
        // ref={ref}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={withCloseButton}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        buttonText={buttonText}
        borderRadius={0}
        backgroundColor={"#00000000"}
      >
        <Center>
          <FlexChild>
            <VerticalFlex>
              <LoadingSpinner width={200} height={200} />
              {message &&
                (typeof message === "object" ? (
                  message
                ) : (
                  <P marginTop={16} color="#fff" fontSize={20}>
                    {message}
                  </P>
                ))}
            </VerticalFlex>
          </FlexChild>
        </Center>
      </ModalBase>
    );
  }
);

export default LoadingModal;
