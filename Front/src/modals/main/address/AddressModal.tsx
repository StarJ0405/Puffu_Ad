import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import P from "@/components/P/P";
import useClientEffect from "@/shared/hooks/useClientEffect";
import { mobileNoFormat, numberOnlyFormat } from "@/shared/regExp";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import { useRef, useState } from "react";
import ModalBase from "../../ModalBase";
import styles from "./AddressModal.module.css";

const AddressModal = NiceModal.create(
  ({
    address,
    onSuccess,
    default: _default = false,
  }: {
    address: AddressData;
    onSuccess?: () => void;
    default: boolean;
  }) => {
    const [withHeader, withFooter] = [false, false];
    const [width, height] = ["100vw", "100dvh"];
    const withCloseButton = false;
    const clickOutsideToClose = false;
    const title = "배송지 " + (address?.id ? "편집" : "추가");
    const buttonText = "close";
    const modal = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(address?.name || "");
    const [phone, setPhone] = useState(address?.phone || "");
    const [postalCode, setPostalCode] = useState(address?.postal_code || "");
    const [address1, setAddress1] = useState(address?.address1 || "");
    const [address2, setAddress2] = useState(address?.address2 || "");
    const [defaultAddress, setDefaultAddress] = useState(
      address?.default || false
    );
    const handleSave = () => {
      setIsLoading(true);
      const data: AddressDataFrame = {
        name,
        phone,
        postal_code: postalCode,
        address1,
        address2,
        default: defaultAddress,
      };
      if (address?.id) {
        requester.updateAddresses(address.id, data, () => {
          onSuccess?.();
          modal.current.close();
        });
      } else
        requester.createAddress(data, () => {
          onSuccess?.();
          modal.current.close();
        });
    };
    useClientEffect(() => {
      if (_default) {
        setDefaultAddress(_default);
      }
    }, [defaultAddress]);
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
        <VerticalFlex maxHeight={"60dvh"} overflow="scroll" gap={10}>
          <FlexChild gap={15} className={styles.header}>
            <Image
              src="/resources/images/left_arrow.png"
              size={20}
              onClick={() => modal.current.close()}
            />
            <P>{title}</P>
          </FlexChild>
          <FlexChild>
            <CheckboxGroup
              name="default"
              initialValues={defaultAddress ? ["default"] : []}
              values={defaultAddress ? ["default"] : []}
              onChange={(values) =>
                setDefaultAddress(values.includes("default"))
              }
            >
              <VerticalFlex padding={"13px 15px"} minHeight={"100dvh"}>
                <FlexChild className={styles.label} paddingBottom={9}>
                  <P>이름</P>
                </FlexChild>
                <FlexChild paddingBottom={20}>
                  <Input
                    id="name"
                    className={styles.input}
                    width={"100%"}
                    onChange={(value) => setName(value as string)}
                    value={name}
                    placeHolder="받는 분의 이름을 입력해주세요"
                  />
                </FlexChild>
                <FlexChild className={styles.label} paddingBottom={9}>
                  <P>휴대폰 번호</P>
                </FlexChild>
                <FlexChild paddingBottom={20}>
                  <Input
                    id="phone"
                    className={styles.input}
                    width={"100%"}
                    value={phone}
                    onChange={(value) => setPhone(value as string)}
                    maxLength={11}
                    placeHolder="휴대폰 번호를 입력해주세요"
                    regExp={[mobileNoFormat]}
                    onFilter={(value) =>
                      String(value).replace(numberOnlyFormat.exp, "")
                    }
                    feedbackHide
                  />
                </FlexChild>
                <FlexChild paddingBottom={9}>
                  <P className={styles.label}>주소</P>
                </FlexChild>
                <FlexChild gap={10} paddingBottom={10}>
                  <Input
                    id="postal_code"
                    readOnly
                    className={styles.input}
                    width={"100%"}
                    placeHolder="우편번호"
                    value={postalCode}
                    onChange={(value) => setPostalCode(value as string)}
                  />
                  <FlexChild width={"max-content"}>
                    <Button
                      className={styles.findPostal}
                      onClick={() =>
                        NiceModal.show("postalcode", {
                          onSuccess: ({
                            postal_code,
                            address1,
                          }: {
                            postal_code: string;
                            address1: string;
                          }) => {
                            setPostalCode(postal_code);
                            setAddress1(address1);
                            document.getElementById("address2")?.focus();
                          },
                        })
                      }
                    >
                      <P>우편번호 찾기</P>
                    </Button>
                  </FlexChild>
                </FlexChild>
                <FlexChild paddingBottom={10}>
                  <Input
                    id="address1"
                    readOnly
                    className={styles.input}
                    width={"100%"}
                    placeHolder="주소"
                    value={address1}
                  />
                </FlexChild>
                <FlexChild paddingBottom={12}>
                  <Input
                    id="address2"
                    className={styles.input}
                    width={"100%"}
                    placeHolder="상세 주소"
                    value={address2}
                    onChange={(value) => setAddress2(value as string)}
                  />
                </FlexChild>
                <FlexChild gap={8} className={styles.default}>
                  <CheckboxChild id="default" />
                  <P
                    onClick={() =>
                      setDefaultAddress(!defaultAddress || _default)
                    }
                  >
                    기본 배송지로 설정
                  </P>
                </FlexChild>
              </VerticalFlex>
            </CheckboxGroup>
          </FlexChild>

          <FlexChild className={styles.buttonWrapper}>
            <Button
              isLoading={isLoading}
              className={styles.button}
              onClick={handleSave}
              disabled={
                !name ||
                !phone ||
                !postalCode ||
                !address1 ||
                !address2 ||
                !mobileNoFormat.exp.test(phone)
              }
            >
              저장하기
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default AddressModal;
