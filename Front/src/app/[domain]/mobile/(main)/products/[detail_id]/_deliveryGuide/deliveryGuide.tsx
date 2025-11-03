import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import styles from "./deliveryGuide.module.css";
import { useState, useEffect } from "react";
import { useStore, useCart } from "@/providers/StoreProvider/StorePorivderClient";

export default function DeliveryGuide() {

  const { storeData } = useStore();
  const { cartData, reload } = useCart();
  const [selected, setSelected] = useState<string[]>(
    cartData?.items.map((i) => i.id) || []
  );
  const [shipping, setShipping] = useState<ShippingMethodData>();
  

  const totalDiscounted =
    cartData?.items
      .filter((item) => selected.includes(item.id))
      .reduce((acc, item) => {
        return acc + (item?.variant?.discount_price || 0) * item.quantity;
      }, 0) || 0;
  const shippingMethod = storeData?.methods
    ?.filter(
      (f) =>
        f.min <= totalDiscounted && (f.max === -1 || f.max > totalDiscounted)
    )
    .sort((m1, m2) => m1.amount - m2.amount)?.[0];
  
  useEffect(() => {
    setShipping(shippingMethod);
  }, [shippingMethod]);

  return (
    <VerticalFlex className={styles.delivery_wrap}>
      <FlexChild className={styles.delivery_title}>
        <h3>배송 및 교환 환불 안내</h3>
      </FlexChild>

      <VerticalFlex className={styles.content}>
        <VerticalFlex className={styles.item}>
          <h4 className={styles.title}>[배송정보]</h4>

          <p className={styles.txt1}>
            {shipping?.description}
            {/* 영업일 기준 14시 이전 주문완료(결제확인) 건에 한하여 당일출고됩니다.{" "} */}
            <br />
            금요일 14시 이후부터 주말 주문 건은 월요일 출고됩니다.
          </p>

          <p className={styles.txt1}>
            배송 방법 : 택배 (CJ 대한통운) <br />
            배송 지역 : 전국지역 <br />
            배송 비용 : {(shipping?.amount || 0).toLocaleString()}원 (총 구매금액이 {(shipping?.max || 0).toLocaleString()}원 이상인 경우 무료배송){" "}
            <br />
            배송 기간 : 1일 ~ 3일 (도서산간 지역은 3~4일 추가될 수 있습니다.){" "}
            <br />
            배송 안내 : 산간벽지나 도서지방은 별도의 추가금액을 지불하셔야 하는
            경우가 있습니다. <br />
            고객님께서 주문하신 상품은 입금 확인후 배송해 드립니다. <br />
            다만, 상품종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.
          </p>
        </VerticalFlex>

        <VerticalFlex className={styles.item}>
          <h4 className={styles.title}>[교환 및 반품정보]</h4>

          <h5 className={styles.title2}>교환 및 반품 안내</h5>

          <p className={styles.txt1}>
            - 교환 및 반품은 전자상거래에 의거 제품을 수령한 날로부터 7일 이내
            가능합니다. <br />
            - 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우에는
            교환/반품이 불가능합니다. <br />단 제품의 하자로 인한 반품/교환은
            가능합니다.
          </p>

          <h5 className={styles.title2}>교환 및 반품 방법</h5>

          <p className={styles.txt1}>
            - 교환 및 반품은 푸푸토이 고객센터로 접수를 부탁드립니다. <br />
            - 제품의 하자 교환 시 왕복 택배비 반품 시 택배비는 푸푸토이가
            부담합니다. <br />
            - 단순 변심 교환 및 환불 건에 대한 배송비는 고객님께서 부담해 주셔야
            합니다. <br />
          </p>

          <p className={styles.txt1}>
            ( 자세한 사항은 푸푸토이 고객센터로 연락 주시면 더 자세한 안내를
            해드릴 수 있습니다.)
          </p>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
