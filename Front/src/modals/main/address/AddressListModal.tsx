import Button from "@/components/buttons/Button";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import useAddress from "@/shared/hooks/main/useAddress";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./AddressListModal.module.css";

const AddressListModal = NiceModal.create(
  ({
    selected,
    addresses: fallback,
    onSuccess,
  }: {
    selected: AddressData;
    addresses: AddressData[];
    onSuccess?: (addr: AddressData | undefined) => void;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const [width, height] = ["100vw", "100dvh"];
    const withCloseButton = false;
    const clickOutsideToClose = false;
    const title = "배송지 관리";
    const buttonText = "close";
    const modal = useRef<any>(null);
    const { addresses, mutate } = useAddress(fallback);
    const [select, setSelect] = useState(selected?.id);
    return (
      <ModalBase
        borderRadius={10}
        headerStyle
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
        <RadioGroup
          name="select"
          defaultValue={selected?.id}
          onValueChange={(value) => setSelect(value)}
        >
          <VerticalFlex
            height={"100dvh"}
            maxHeight={"100dvh"}
            overflowY="scroll"
            overflow="scroll"
          >
            <FlexChild gap={15} className={styles.header}>
              <Image
                src="/resources/images/left_arrow.png"
                size={20}
                onClick={() => modal.current.close()}
              />
              <P>{title}</P>
            </FlexChild>
            {addresses
              .sort((addr1, addr2) => {
                // if (addr1.default) return -1;
                // if (addr2.default) return 1;
                return String(
                  `${new Date(addr1.created_at).getTime()} ${addr1.id}`
                ).localeCompare(
                  `${new Date(addr2.created_at).getTime()} ${addr2.id}`
                );
              })
              .map((addr) => (
                <FlexChild key={addr.id} padding={15}>
                  <VerticalFlex
                    className={styles.addressWrapper}
                    position="relative"
                  >
                    {selected && (
                      <FlexChild position="absolute" left={0}>
                        <RadioChild id={addr.id} />
                      </FlexChild>
                    )}
                    <FlexChild
                      className={styles.addressName}
                      paddingBottom={12}
                    >
                      <P paddingRight={6}>{addr.name}</P>
                      {addr.default && (
                        <P className={styles.addressDefault}>기본 배송지</P>
                      )}
                    </FlexChild>
                    <FlexChild
                      className={styles.addressPhone}
                      paddingBottom={6}
                    >
                      <P>{addr.phone}</P>
                    </FlexChild>
                    <FlexChild
                      className={styles.addressAddress}
                      paddingBottom={20}
                    >
                      <P>
                        {addr.address1} {addr.address2} ({addr.postal_code})
                      </P>
                    </FlexChild>
                    <FlexChild>
                      <P>
                        <Span
                          className={styles.addressButton}
                          onClick={() => {
                            NiceModal.show("address", {
                              onSuccess: () => mutate(),
                              default: addresses.length === 0,
                              address: addr,
                            });
                          }}
                        >
                          수정
                        </Span>
                        <Span className={styles.lineV} padding={"0 5px"}>
                          |
                        </Span>
                        <Span
                          className={styles.addressButton}
                          onClick={() =>
                            NiceModal.show("confirm", {
                              message: "배송지를 삭제하시겠습니까?",
                              cancelText: "취소",
                              confirmText: "삭제",
                              onConfirm: () =>
                                requester.deleteAddresses(addr.id, {}, () =>
                                  mutate()
                                ),
                            })
                          }
                        >
                          삭제
                        </Span>
                      </P>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              ))}

            <FlexChild
              className={styles.buttonWrapper}
              onClick={() =>
                NiceModal.show("address", {
                  onSuccess: () => mutate(),
                  default: addresses.length === 0,
                })
              }
              paddingBottom={30}
            >
              <Button className={styles.button}>새 배송지 추가</Button>
            </FlexChild>
            {selected && (
              <FlexChild className={styles.selectButtonWrapper}>
                <Button
                  className={styles.selectButton}
                  onClick={() => {
                    onSuccess?.(addresses.find((f) => f.id === select));
                    modal.current.close();
                  }}
                >
                  선택하기
                </Button>
              </FlexChild>
            )}
          </VerticalFlex>
        </RadioGroup>
      </ModalBase>
    );
  }
);

export default AddressListModal;
