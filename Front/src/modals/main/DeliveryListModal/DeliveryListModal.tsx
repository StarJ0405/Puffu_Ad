"use client";
import Button from "@/components/buttons/Button";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import useAddress from "@/shared/hooks/main/useAddress";
import { requester } from "@/shared/Requester";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import DeliveryAddEdit, {
  DeliveryAddEditRef,
} from "../DeliveryAddEdit/DeliveryAddEdit";
import styles from "./DeliveryListModal.module.css";

interface DeliveryListProps {
  selectable?: boolean;
  address?: AddressData;
}
export interface DeliveryListRef {
  getSelect: () => AddressData | undefined;
}
const DeliveryListModal = forwardRef<DeliveryListRef, DeliveryListProps>(
  ({ address, selectable }, ref) => {
    const { addresses, mutate } = useAddress();
    const Delete = (addr: AddressData) => {
      requester.deleteAddresses(addr.id, {}, () => mutate());
    };
    const Create = (data: AddressDataFrame) => {
      requester.createAddress(data, () => mutate());
    };
    const Edit = (id: string, data: Partial<AddressDataFrame>) => {
      requester.updateAddresses(id, data, () => mutate());
    };

    const { isMobile } = useBrowserEvent();
    const [select, setSelect] = useState(
      address?.id || addresses.find((f) => f.default)?.id
    );
    const formRef = useRef<DeliveryAddEditRef>(null);

    useImperativeHandle(ref, () => ({
      getSelect: () => addresses.find((f) => f.id === select),
    }));

    const deliveryAddEditModal = (addressData?: AddressDataFrame) => {
      NiceModal.show(ConfirmModal, {
        message: <DeliveryAddEdit ref={formRef} address={addressData} />,
        width: '100%',
        confirmText: "저장",
        cancelText: "닫기",
        preventable: true,
        // onclick: setPaswwordStep(1),
        withCloseButton: true,
        onConfirm: async () => {
          const formData = formRef.current?.getFormData();

          if (!formData) {
            console.error("폼 데이터를 가져올 수 없습니다.");
            return;
          }
          if (
            !formData.name ||
            !formData.phone ||
            !formData.postal_code ||
            !formData.address1 ||
            !formData.address2
          ) {
            toast({ message: "정보를 전부 기입해주세요." });
            return false;
          }

          try {
            if (addressData?.id) {
              await Edit(addressData.id, formData);
            } else {
              await Create(formData);
            }
            NiceModal.hide(ConfirmModal);
            return true;
          } catch (error) {
            console.error("저장 중 오류가 발생했습니다.", error);
            // 여기에 사용자에게 오류를 알리는 토스트 메시지 등을 추가할 수 있습니다.
          }
        },
        onCancel: () => {
          NiceModal.hide(ConfirmModal);
        },
      });
    };

    const Content =
      addresses.length > 0 ? (
        <VerticalFlex className={styles.delivery_list}>
          <P color="#fff">1211</P>
          {addresses.map((addr, i) => (
            <VerticalFlex gap={10} className={styles.container} key={addr.id}>
              <HorizontalFlex key={i} className={styles.item}>
                {selectable ? (
                  <FlexChild>
                    <VerticalFlex width={"max-content"} gap={20}>
                      <FlexChild className={styles.number}>{i + 1}</FlexChild>
                      <RadioChild id={addr.id} />
                    </VerticalFlex>
                  </FlexChild>
                ) : (
                  <FlexChild className={styles.number}>{i + 1}</FlexChild>
                )}

                <VerticalFlex className={styles.content}>
                  {addr.default ? (
                    <FlexChild className={styles.default}>
                      <P>기본배송지</P>
                    </FlexChild>
                  ) : null}

                  <FlexChild className={styles.address}>
                    <P>
                      ({addr.postal_code}) {addr.address1} {addr.address2}
                    </P>
                  </FlexChild>

                  <FlexChild className={styles.name}>
                    <Span>받는 사람</Span>
                    <P>{addr.name}</P>
                  </FlexChild>
                </VerticalFlex>
              </HorizontalFlex>

              <FlexChild gap={10} justifyContent="end">
                <FlexChild className={styles.edit_btn}>
                  <Button onClick={() => deliveryAddEditModal(addr)}>
                    배송지 수정
                  </Button>
                </FlexChild>

                <FlexChild className={styles.edit_btn}>
                  <Button
                    onClick={() =>
                      NiceModal.show("confirm", {
                        message: "삭제하시겠습니까?",
                        confirmText: "삭제",
                        cancelText: "취소",
                        onConfirm: () => Delete(addr),
                      })
                    }
                  >
                    삭제
                  </Button>
                </FlexChild>
              </FlexChild>
            </VerticalFlex>
          ))}
        </VerticalFlex>
      ) : (
        <NoContent type="배송지" />
      );

    return (
      <VerticalFlex>
        <FlexChild className="title" justifyContent="center">
          <P size={!isMobile ? 25 : 20} weight={600} color="#fff">
            배송지 목록
          </P>
        </FlexChild>
        {selectable ? (
          <RadioGroup
            name="select"
            value={select}
            onValueChange={(value) => setSelect(value)}
          >
            {Content}
          </RadioGroup>
        ) : (
          Content
        )}
        <Button className={styles.add_btn} onClick={() => deliveryAddEditModal()}>배송지 추가</Button>
      </VerticalFlex>
    );
  }
);

export default DeliveryListModal;
