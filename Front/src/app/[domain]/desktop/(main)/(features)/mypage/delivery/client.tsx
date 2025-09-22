"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import mypage from "../mypage.module.css";
import styles from "./page.module.css";

import ConfirmModal from "@/modals/confirm/ConfirmModal";
import DeliveryAddEdit, {
  DeliveryAddEditRef,
} from "@/modals/main/DeliveryAddEdit/DeliveryAddEdit";
import DeliveryListModal from "@/modals/main/DeliveryListModal/DeliveryListModal";
import useAddress from "@/shared/hooks/main/useAddress";
import { requester } from "@/shared/Requester";
import { log, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useRef } from "react";

export function DeliveryClient({ initAddresses }: { initAddresses: any }) {
  const { addresses, mutate } = useAddress(initAddresses?.content || []);
  const formRef = useRef<DeliveryAddEditRef>(null);

  const Delete = (addr: AddressData) => {
    requester.deleteAddresses(addr.id, {}, () => mutate());
  };
  const Create = (data: Partial<AddressDataFrame>) => {
    requester.createAddress(data, () => mutate());
  };
  const Edit = (id: string, data: Partial<AddressDataFrame>) => {
    requester.updateAddresses(id, data, () => mutate());
  };

  const deliveryAddEditModal = (addressData?: AddressDataFrame) => {
    NiceModal.show(ConfirmModal, {
      message: <DeliveryAddEdit ref={formRef} address={addressData} />,
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

  const confirmDeleteModal = (address: AddressData) => {
    NiceModal.show(ConfirmModal, {
      message: "이 배송지를 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          await Delete(address);
          NiceModal.hide(ConfirmModal);
        } catch (error) {
          console.error("삭제 중 오류가 발생했습니다.", error);
          // 여기에 사용자에게 오류를 알리는 토스트 메시지 등을 추가할 수 있습니다.
        }
      },
    });
  };

  return (
    <VerticalFlex
      className={clsx(mypage.box_frame, styles.delivery_box)}
      gap={35}
    >
      <FlexChild className={mypage.box_header}>
        <P>배송지 관리</P>
      </FlexChild>

      <HorizontalFlex className={styles.top_box}>
        <FlexChild className={styles.all_txt}>
          <P>전체 배송지</P>
          <Span>({addresses?.length || 0}건)</Span>
        </FlexChild>

        <FlexChild className={styles.add_btn}>
          <Button onClick={() => deliveryAddEditModal()}>배송지 추가</Button>
        </FlexChild>
      </HorizontalFlex>

      {/* 테이블 안에 tbody 안에 map은 그 날짜에 시킨 주문내역 전부 불러오게 바꾸기 */}
      {addresses && addresses.length > 0 ? (
        <VerticalFlex className={styles.delivery_list}>
          {addresses.map((item, i) => (
            <HorizontalFlex key={item.id} className={styles.item}>
              <FlexChild className={styles.number}>{i + 1}</FlexChild>

              <VerticalFlex className={styles.content}>
                {item.default ? (
                  <FlexChild className={styles.default}>
                    <P>[기본배송지]</P>
                  </FlexChild>
                ) : null}

                <FlexChild className={styles.address}>
                  <P>{`(${item.postal_code}) ${item.address1} ${item.address2}`}</P>
                </FlexChild>

                <FlexChild className={styles.name}>
                  <Span>받는 사람</Span>
                  <P>{item.name}</P>
                </FlexChild>
              </VerticalFlex>

              <FlexChild gap={10}>
                <FlexChild
                  className={styles.edit_btn}
                  onClick={() => deliveryAddEditModal(item)}
                >
                  <Button>배송지 수정</Button>
                </FlexChild>

                <FlexChild
                  className={styles.edit_btn}
                  onClick={() => confirmDeleteModal(item)}
                >
                  <Button>삭제</Button>
                </FlexChild>
              </FlexChild>
            </HorizontalFlex>
          ))}
        </VerticalFlex>
      ) : (
        <NoContent type="배송지" />
      )}
    </VerticalFlex>
  );
}
