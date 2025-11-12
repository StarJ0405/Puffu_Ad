"use client";

import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import { ChromePicker } from "react-color";
import styles from "./ColorModal.module.css";
const colors = [
  [
    "rgb(255, 235, 238)",
    "rgb(239, 154, 154)",
    "rgb(239, 83, 80)",
    "rgb(229, 57, 53)",
    "rgb(198, 40, 40)",
    "rgb(183, 28, 28)",
  ],
  [
    "rgb(251, 233, 231)",
    "rgb(255, 171, 145)",
    "rgb(255, 138, 101)",
    "rgb(244, 81, 30)",
    "rgb(216, 67, 21)",
    "rgb(191, 54, 12)",
  ],
  [
    "rgb(255, 253, 231)",
    "rgb(255, 245, 157)",
    "rgb(255, 238, 88)",
    "rgb(255, 235, 59)",
    "rgb(249, 168, 37)",
    "rgb(245, 127, 23)",
  ],
  [
    "rgb(241, 248, 233)",
    "rgb(197, 225, 165)",
    "rgb(156, 204, 101)",
    "rgb(124, 179, 66)",
    "rgb(85, 139, 47)",
    "rgb(51, 105, 30)",
  ],
  [
    "rgb(224, 242, 241)",
    "rgb(128, 203, 196)",
    "rgb(38, 166, 154)",
    "rgb(0, 137, 123)",
    "rgb(0, 105, 92)",
    "rgb(0, 77, 64)",
  ],
  [
    "rgb(227, 242, 253)",
    "rgb(144, 202, 249)",
    "rgb(66, 165, 245)",
    "rgb(30, 136, 229)",
    "rgb(21, 101, 192)",
    "rgb(13, 71, 161)",
  ],
  [
    "rgb(237, 231, 246)",
    "rgb(179, 157, 219)",
    "rgb(126, 87, 194)",
    "rgb(94, 53, 177)",
    "rgb(69, 39, 160)",
    "rgb(49, 27, 146)",
  ],
  [
    "rgb(236, 239, 241)",
    "rgb(176, 190, 197)",
    "rgb(120, 144, 156)",
    "rgb(84, 110, 122)",
    "rgb(55, 71, 79)",
    "rgb(38, 50, 56)",
  ],
];
const ColorModal = NiceModal.create(
  ({
    onConfirm,
    background = false,
    width = "auto",
    height = "auto",
    slideUp = false,
    clickOutsideToClose = true,
    classNames,
    preventable = false, // true시 onConfirm false면 캔슬됨,
  }: any) => {
    const [withHeader, withFooter] = [false, false];
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [custom, setCustom] = useState(false);
    const { isMobile } = useBrowserEvent();
    const [color, setColor] = useState<string>("");
    const onConfirmClick = async (color: string) => {
      if (isBlocked) return;
      setIsBlocked(true);

      if (onConfirm) {
        let isAsyncFn =
          onConfirm.constructor.name === "AsyncFunction" ? true : false;
        if (isAsyncFn) {
          const result = await onConfirm({ color });
          if (!preventable || result) modal.current.close();
        } else {
          const result = onConfirm({ color });
          if (!preventable || result) modal.current.close();
        }
      } else {
        modal.current.close();
      }
      setIsBlocked(false);
    };

    return (
      <ModalBase
        zIndex={10055}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={false}
        clickOutsideToClose={clickOutsideToClose}
        title={"서명"}
        buttonText={buttonText}
        borderRadius={6}
        slideUp={slideUp}
        backgroundColor={"#fff"}
        className={styles.confirmModal}
      >
        <FlexChild
          padding={!isMobile ? "50px 15px 24px" : "40px 10px 20px"}
          height={"100%"}
          position="relative"
        >
          <VerticalFlex
            gap={20}
            // height="calc(min(100%,100dvh) - 48px)"
            maxHeight="calc(min(100%,100dvh) - 48px)"
            overflowY="scroll"
            hideScrollbar
          >
            {custom ? (
              <>
                <FlexChild>
                  <ChromePicker
                    disableAlpha
                    color={color}
                    onChange={(value) =>
                      setColor(
                        `rgb(${value.rgb.r},${value.rgb.b},${value.rgb.g})`
                      )
                    }
                  />
                </FlexChild>
                <FlexChild
                  position="sticky"
                  bottom={0}
                  justifyContent="flex-end"
                >
                  <Button
                    className={styles.button}
                    onClick={() => modal.current.close()}
                  >
                    취소
                  </Button>

                  <Button
                    className={styles.button2}
                    onClick={() => onConfirmClick(color)}
                  >
                    <P>확인</P>
                  </Button>
                </FlexChild>
              </>
            ) : (
              <>
                <FlexChild
                  width={"min(80%, 380px)"}
                  height={"100%"}
                  className={classNames?.message}
                  backgroundColor={"#fff"}
                >
                  <FlexChild>
                    <HorizontalFlex gap={10} justifyContent="center">
                      {colors.map((color, index) => (
                        <FlexChild key={index} width={"max-content"}>
                          <VerticalFlex gap={10}>
                            {color.map((c, index) => (
                              <FlexChild
                                key={index}
                                width={30}
                                height={30}
                                backgroundColor={c}
                                borderRadius={"100%"}
                                cursor="pointer"
                                onClick={() => onConfirmClick(c)}
                              />
                            ))}
                          </VerticalFlex>
                        </FlexChild>
                      ))}
                    </HorizontalFlex>
                  </FlexChild>
                </FlexChild>
                <FlexChild position="sticky" bottom={0}>
                  {background && (
                    <Button
                      className={styles.button}
                      onClick={() => onConfirmClick("transparent")}
                    >
                      초기화
                    </Button>
                  )}
                  <Button
                    className={styles.button}
                    onClick={() => setCustom(true)}
                  >
                    <P>다른 색</P>
                  </Button>
                </FlexChild>
              </>
            )}
          </VerticalFlex>
        </FlexChild>
      </ModalBase>
    );
  }
);

export default ColorModal;
