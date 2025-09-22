"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";
import mypage from "../mypage.module.css";

import useAddress from "@/shared/hooks/main/useAddress";
import { requester } from "@/shared/Requester";
import { log, maskPhone } from "@/shared/utils/Functions";
import DeliveryAddEdit, {
  DeliveryAddEditRef,
} from "@/modals/main/DeliveryAddEdit/DeliveryAddEdit";
import DeliveryListModal from "@/modals/main/DeliveryListModal/DeliveryListModal";
import NiceModal from "@ebay/nice-modal-react";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import clsx from "clsx";
import { useRef } from "react";

interface DummyAddress {
  address: string;
  name: string;
  defaultAdd: boolean;
}

export function DeliveryClient({ initAddresses }: { initAddresses: any }) {
  const { addresses, mutate } = useAddress(initAddresses);
  const formRef = useRef<DeliveryAddEditRef>(null);
  const deliveryTest = [
    {
      address: "대전광역시 관저중로 30-26(관저동)",
      name: "김철수",
      defaultAdd: true,
    },
    {
      address: "대전광역시 서구 둔산동 가람아파트 3단지 1207호",
      name: "안동형",
      defaultAdd: false,
    },
  ];

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
      // onclick: setPaswwordStep(1),
      withCloseButton: true,
      onConfirm: async () => {
        const formData = formRef.current?.getFormData();

        if (!formData) {
          console.error("폼 데이터를 가져올 수 없습니다.");
          return;
        }

        try {
          if (addressData?.id) {
            await Edit(addressData.id, formData);
          } else {
            await Create(formData);
          }
          NiceModal.hide(ConfirmModal);
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

  // const deliveryListModal = () => {
  //   NiceModal.show(ConfirmModal, {
  //       message: <DeliveryListModal />,
  //       confirmText: '저장',
  //       cancelText: "닫기",
  //       // onclick: setPaswwordStep(1),
  //       withCloseButton: true,
  //       onConfirm: async () => {

  //       },
  //       onCancel: () => {

  //     },
  //   });
  // };

  // 기본배송지가 위로 오도록.
  const addressDefaultChaning = addresses.sort(
    (a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0)
  );

  return (
    <VerticalFlex
      className={clsx(mypage.box_frame, styles.delivery_box)}
      gap={25}
    >
      <FlexChild className={mypage.box_header}>
        <P>배송지 관리</P>
      </FlexChild>

      <VerticalFlex className={styles.top_box}>
        <FlexChild className={styles.all_txt}>
          <P>전체 배송지</P>
          <Span>({addresses?.length || 0}건)</Span>
        </FlexChild>

        <FlexChild className={styles.add_btn}>
          <Button onClick={() => deliveryAddEditModal()}>배송지 추가</Button>
        </FlexChild>
      </VerticalFlex>

      {/* 테이블 안에 tbody 안에 map은 그 날짜에 시킨 주문내역 전부 불러오게 바꾸기 */}
      {addresses && addresses.length > 0 ? (
        <VerticalFlex className={styles.delivery_list}>
          {addressDefaultChaning.map((item, i) => (
            <VerticalFlex
              key={item.id}
              className={clsx(styles.item, item.default ? styles.default : "")}
              alignItems="start"
            >
              <HorizontalFlex gap={20}>
                {/* <FlexChild className={styles.number}>{i + 1}</FlexChild> */}

                <VerticalFlex className={styles.content}>
                  {item.default ? (
                    <FlexChild className={styles.default}>
                      <P>기본배송지</P>
                    </FlexChild>
                  ) : null}
                  <FlexChild className={styles.address}>
                    <P>{`(${item.postal_code}) ${item.address1} ${item.address2}`}</P>
                  </FlexChild>

                  <FlexChild gap={10}>
                    <FlexChild className={styles.user_pri}>
                      <Span>받는분</Span>
                      <P>{item.name}</P>
                    </FlexChild>

                    <FlexChild className={styles.user_pri}>
                      <P>{maskPhone(item.phone)}</P>
                    </FlexChild>
                  </FlexChild>
                </VerticalFlex>
              </HorizontalFlex>

              <FlexChild gap={10} justifyContent="end" width={"100%"}>
                <FlexChild
                  className={styles.edit_btn}
                  onClick={() => deliveryAddEditModal(item)}
                >
                  <Button>수정</Button>
                </FlexChild>

                <FlexChild
                  className={styles.edit_btn}
                  onClick={() => confirmDeleteModal(item)}
                >
                  <Button>삭제</Button>
                </FlexChild>
              </FlexChild>
            </VerticalFlex>
          ))}
        </VerticalFlex>
      ) : (
        <NoContent type="배송지" />
      )}
    </VerticalFlex>
  );
}
