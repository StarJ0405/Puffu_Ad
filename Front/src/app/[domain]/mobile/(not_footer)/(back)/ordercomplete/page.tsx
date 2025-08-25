"use client";
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useStore } from "@/providers/StoreProvider/StorePorivderClient";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import { Sessions } from "@/shared/utils/Data";
import _ from "lodash";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function () {
  const { reload } = useAuth();
  const [order, setOrder] = useState<OrderData>();
  const navigate = useNavigate();
  useClientEffect(
    () => {
      const _data = sessionStorage.getItem(Sessions.ORDER);
      if (_data && _data !== "undefined") {
        const order = JSON.parse(_data);
        if (!order) navigate("/", { type: "replace" });
        else {
          setOrder(order);
          setTimeout(() => {
            reload().then(() => {
              sessionStorage.removeItem(Sessions.ORDER);
            });
          }, 100);
        }
      } else {
        navigate("/", { type: "replace" });
      }
    },
    [],
    true
  );
  return (
    <VerticalFlex>
      <FlexChild height={52} justifyContent="center" className={styles.Header}>
        <P>주문 완료</P>
      </FlexChild>
      <Complete order={order} />
      <Div className={styles.space} />
      <ShippingInfo address={order?.address} />
      <Div className={styles.space} />
      <Items items={order?.items} />
      <Div className={styles.space} />
      <Payment order={order} />
    </VerticalFlex>
  );
}

function Complete({ order }: { order?: OrderData }) {
  const navigate = useNavigate();
  return (
    <FlexChild>
      <VerticalFlex padding={50}>
        <Image
          src="/resources/icons/ordercomplete.png"
          height={"auto"}
          width={46}
          paddingBottom={8}
        />
        <P className={styles.completeTitle} paddingBottom={8}>
          주문이 완료되었습니다
        </P>
        <P paddingBottom={24}>
          <Span className={styles.completeLabel} paddingRight={6}>
            주문번호
          </Span>
          <Span className={styles.completeNumber}>{order?.display}</Span>
        </P>
        <Button
          onClick={() => navigate("/", { type: "replace" })}
          className={styles.button}
        >
          계속 쇼핑하기
        </Button>
      </VerticalFlex>
    </FlexChild>
  );
}
function ShippingInfo({ address }: { address?: AddressData }) {
  return (
    <FlexChild className={styles.wrapper}>
      <VerticalFlex>
        <FlexChild paddingBottom={10}>
          <P className={styles.title}>배송정보</P>
        </FlexChild>
        <FlexChild paddingBottom={14}>
          <P className={styles.shippingLabel} paddingRight={13}>
            수령인
          </P>
          <P className={styles.shippingValue}>{address?.name}</P>
        </FlexChild>
        <FlexChild paddingBottom={14}>
          <P className={styles.shippingLabel} paddingRight={13}>
            연락처
          </P>
          <P className={styles.shippingValue}>{address?.phone}</P>
        </FlexChild>
        <FlexChild paddingBottom={14}>
          <P className={styles.shippingLabel} paddingRight={13}>
            주소지
          </P>
          <P className={styles.shippingValue}>
            {address?.address1} {address?.address2} ({address?.postal_code})
          </P>
        </FlexChild>
        <FlexChild>
          <P className={styles.shippingLabel} paddingRight={13}>
            배송메모
          </P>
          <P className={styles.shippingValue}>{address?.message || "없음"}</P>
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
}
function Items({ items }: { items?: LineItemData[] }) {
  const [brands, setBrands] = useState<
    (BrandData & { items: LineItemData[] })[]
  >([]);
  useEffect(() => {
    const group = _.groupBy(items, (item) => item.brand_id);
    const brands = Object.keys(group).map((key) => {
      const items = group[key];
      const brand: any = items?.[0].brand;
      return { ...brand, items };
    });
    setBrands(brands);
  }, [items]);
  return (
    <FlexChild className={styles.wrapper}>
      <VerticalFlex>
        <FlexChild className={styles.title} paddingBottom={10}>
          <P>주문상품</P>
        </FlexChild>
        {brands
          .sort((b1, b2) => b1.name.localeCompare(b2.name))
          .map((brand, index) => {
            return (
              <FlexChild key={brand.id}>
                <VerticalFlex>
                  <FlexChild className={styles.brandTitle} paddingBottom={6}>
                    <P>{brand?.name}</P>
                  </FlexChild>
                  {brand.items
                    .sort((i1, i2) =>
                      String(
                        `${
                          i1.product_title
                        } ${i1.created_at.toLocaleString()} ${i1.id}`
                      ).localeCompare(
                        String(
                          `${
                            i2.product_title
                          } ${i2.created_at.toLocaleString()} ${i2.id}`
                        )
                      )
                    )
                    .map((item) => (
                      <FlexChild key={item.id} paddingBottom={13}>
                        <HorizontalFlex gap={12} alignItems="flex-start">
                          <FlexChild width={"max-content"}>
                            <Image src={item.thumbnail} size={80} />
                          </FlexChild>
                          <FlexChild>
                            <VerticalFlex>
                              <FlexChild
                                className={styles.productTitle}
                                paddingBottom={3}
                              >
                                <P>{item.product_title}</P>
                              </FlexChild>
                              <FlexChild
                                className={styles.variantTitle}
                                paddingBottom={6}
                              >
                                <P>
                                  {item.variant_title
                                    ? `${item.variant_title} / ${item.quantity}개`
                                    : `${item.quantity}개`}
                                </P>
                              </FlexChild>
                              <FlexChild>
                                <P className={styles.discountPrice}>
                                  <Span>{item.total_discount}</Span>
                                  <Span>{item?.currency_unit}</Span>
                                </P>
                                <P
                                  className={styles.price}
                                  paddingLeft={6}
                                  hidden={item.total_discount === item.total}
                                >
                                  <Span>{item.total}</Span>
                                  <Span>{item?.currency_unit}</Span>
                                </P>
                              </FlexChild>
                            </VerticalFlex>
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                    ))}
                  {index !== brands.length - 1 && (
                    <Div className={styles.line2} marginBottom={13} />
                  )}
                </VerticalFlex>
              </FlexChild>
            );
          })}
      </VerticalFlex>
    </FlexChild>
  );
}

function Payment({ order }: { order?: OrderData }) {
  const { storeData } = useStore();
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={16}>
        <P className={styles.title}>결제 금액</P>
      </FlexChild>
      <FlexChild paddingBottom={12}>
        <P className={styles.paymentLabel}>필요한 포인트</P>
        <P className={styles.paymentValue} marginLeft={"auto"}>
          <Span>{order?.total}</Span>
          <Span>{storeData?.currency_unit}</Span>
        </P>
      </FlexChild>
      <FlexChild paddingBottom={15}>
        <P className={styles.paymentLabel}>할인</P>
        <P className={styles.paymentDiscount} marginLeft={"auto"}>
          <Span>{(order?.total_discounted || 0) - (order?.total || 0)}</Span>
          <Span>{storeData?.currency_unit}</Span>
        </P>
      </FlexChild>
      <FlexChild paddingBottom={16}>
        <P className={styles.paymentLabel}>총 배송비</P>

        {order?.shipping_methods?.[0].amount === 0 ? (
          <P className={styles.paymentValue} marginLeft={"auto"}>
            무료
          </P>
        ) : (
          <P className={styles.paymentValue} marginLeft={"auto"}>
            <Span>{order?.shipping_methods?.[0]?.amount}</Span>
            <Span>원</Span>
          </P>
        )}
      </FlexChild>
      <FlexChild className={styles.paymentResultWrapper}>
        <VerticalFlex>
          <FlexChild paddingBottom={12}>
            <P className={styles.paymentTotalPointLabel}>총 필요한 포인트</P>
            <P className={styles.paymentTotalPointValue} marginLeft={"auto"}>
              <Span>{order?.total_discounted}</Span>
              <Span>{storeData?.currency_unit}</Span>
            </P>
          </FlexChild>
          <FlexChild>
            <P className={styles.paymentUsepointLabel}>ㄴ 사용 포인트</P>
            <P className={styles.paymentUsepointValue} marginLeft={"auto"}>
              <Span>{-(order?.total_discounted || 0)}</Span>
              <Span>{storeData?.currency_unit}</Span>
            </P>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
