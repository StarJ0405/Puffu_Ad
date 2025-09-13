"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import styles from "./page.module.css";

import useAddress from "@/shared/hooks/main/useAddress";
import { requester } from "@/shared/Requester";
import { log } from "@/shared/utils/Functions";

export function DeliveryTable({ initAddresses }: { initAddresses: any }) {
  const { addresses, mutate } = useAddress(initAddresses?.content || []);
  log(addresses);
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
  const Create = (data: AddressDataFrame) => {
    requester.createAddress(data, () => mutate());
  };
  const Edit = (addr: AddressData, data: AddressDataFrame) => {
    requester.updateAddresses(addr.id, data, () => mutate());
  };

  return (
    <>
      {/* 테이블 안에 tbody 안에 map은 그 날짜에 시킨 주문내역 전부 불러오게 바꾸기 */}
      {deliveryTest.length > 0 ? (
        <VerticalFlex className={styles.delivery_list}>
          {deliveryTest.map((item, i) => (
            <HorizontalFlex key={i} className={styles.item}>
              <FlexChild className={styles.number}>{i + 1}</FlexChild>

              <VerticalFlex className={styles.content}>
                {item.defaultAdd ? (
                  <FlexChild className={styles.default}>
                    <P>[기본배송지]</P>
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

              <FlexChild className={styles.edit_btn}>
                <Button>배송지 수정</Button>
              </FlexChild>
            </HorizontalFlex>
          ))}
        </VerticalFlex>
      ) : (
        <NoContent type="배송지" />
      )}
    </>
  );
}
