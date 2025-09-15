"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./DeliveryListModal.module.css";
import DeliveryAddEdit from "../DeliveryAddEdit/DeliveryAddEdit";
import NiceModal from "@ebay/nice-modal-react";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";



export default function DeliveryListModal() {
  // 모달에서 받을 데이터 임시 주석 해놓음
  // { initAddresses }: { initAddresses: any }

  // const { addresses, mutate } = useAddress(initAddresses?.content || []);
  // log(addresses);
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

  // const Delete = (addr: AddressData) => {
  //   requester.deleteAddresses(addr.id, {}, () => mutate());
  // };
  // const Create = (data: AddressDataFrame) => {
  //   requester.createAddress(data, () => mutate());
  // };
  // const Edit = (addr: AddressData, data: AddressDataFrame) => {
  //   requester.updateAddresses(addr.id, data, () => mutate());
  // };

  const { isMobile } = useBrowserEvent();
  

  const deliveryAddEditModal = () => {
     NiceModal.show(ConfirmModal, {
        message: <DeliveryAddEdit/>,
        confirmText: '저장',
        cancelText: "닫기",
        // onclick: setPaswwordStep(1),
        withCloseButton: true,
        onConfirm: async () => {
         console.log("저장하기");
        },
        onCancel: () => {
         console.log("닫기");
       },
     });
  };

   return (
      <VerticalFlex className="modal_edit_info">
         <FlexChild className="title" justifyContent="center">
           <P size={!isMobile ? 25 : 20} weight={600}>
              배송지 목록
           </P>
         </FlexChild>

          {deliveryTest.length > 0 ? (
            <VerticalFlex className={styles.delivery_list}>
              {deliveryTest.map((item, i) => (
                <VerticalFlex gap={10} className={styles.container}>
                  <HorizontalFlex key={i} className={styles.item}>
                    <FlexChild className={styles.number}>{i + 1}</FlexChild>
  
                    <VerticalFlex className={styles.content}>
                      {item.defaultAdd ? (
                        <FlexChild className={styles.default}>
                          <P>기본배송지</P>
                        </FlexChild>
                      ) : null}
  
                      <FlexChild className={styles.address}>
                        <P>{item.address}</P>
                      </FlexChild>
  
                      <FlexChild className={styles.name}>
                        <Span>받는 사람</Span>
                        <P>{item.name}</P>
                      </FlexChild>
                    </VerticalFlex>
                  </HorizontalFlex>

                  <FlexChild gap={10} justifyContent="end">
                    <FlexChild className={styles.edit_btn} onClick={() => deliveryAddEditModal}>
                      {/* onClick={()=> Edit} */}
                      <Button>배송지 수정</Button>
                    </FlexChild>
      
                    <FlexChild className={styles.edit_btn}>
                      {/* onClick={()=> Delete} */}
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
   )
}