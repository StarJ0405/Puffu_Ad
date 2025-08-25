"use client";

import Button from "@/components/buttons/Button";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import InputTextArea from "@/components/inputs/InputTextArea";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import {
  useCart,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import useAddress from "@/shared/hooks/main/useAddress";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import { Sessions } from "@/shared/utils/Data";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import _ from "lodash";
import { redirect } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./page.module.css";

export default function () {
  const { cartData } = useCart();

  if (!cartData || cartData?.items.length == 0) {
    return redirect("/cart");
  }

  const [selected, setSelected] = useState<string[]>([]);
  const [agree, setAgree] = useState<boolean>(false);
  const [address, setAddress] = useState<AddressData>();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodData>();
  const navigate = useNavigate();
  const payments = [];
  useClientEffect(
    () => {
      const _data = sessionStorage.getItem(Sessions.SELECTED_ITEMS);
      if (_data) {
        const selected = JSON.parse(_data);
        if (selected?.length === 0) navigate("/cart", { type: "replace" });
        else {
          setSelected(selected);
          setTimeout(() => {
            // sessionStorage.removeItem(Sessions.SELECTED_ITEMS);
          }, 100);
        }
      } else {
        navigate("/cart", { type: "replace" });
      }
    },
    [],
    true
  );

  return (
    <VerticalFlex>
      <Address address={address} setAddress={setAddress} />
      <Div className={styles.space} />
      <ProductList selected={selected} />
      <Div className={styles.space} />
      <Point selected={selected} />
      <Div className={styles.space} />
      <Payment
        selected={selected}
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
      />
      {payments.length > 0 && <Div className={styles.space} />}
      {payments.length > 0 && <PaymentMethod />}
      <Div className={styles.space} />
      <Agree setAgree={setAgree} />
      <FlexChild className={styles.paymentButtonWrapper}>
        <Button
          isLoading={isLoading}
          disabled={!agree || !address || !shippingMethod}
          className={styles.paymentButton}
          onClick={() => {
            setIsLoading(true);
            const data = {
              selected,
              address_id: address?.id,
              shipping_method_id: shippingMethod?.id,
              message: address?.message,
              cart_id: cartData?.id,
            };

            requester.createOrder(
              data,
              ({ content, error }: { content: OrderData; error: any }) => {
                if (error) {
                  toast({ message: error });
                  setIsLoading(false);
                } else {
                  sessionStorage.setItem(
                    Sessions.ORDER,
                    JSON.stringify(content)
                  );

                  navigate("/ordercomplete", { type: "replace" });
                }
              }
            );
          }}
        >
          결제하기
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}

function Address({
  address,
  setAddress,
}: {
  address?: AddressData;
  setAddress: Dispatch<SetStateAction<AddressData | undefined>>;
}) {
  const { addresses, mutate } = useAddress();
  const [list, setList] = useState<{
    label: React.ReactNode;
    value: string;
  } | null>(null);
  useEffect(() => {
    if (!address || !addresses.some((addr) => addr.id === address.id)) {
      const defaultAddress = addresses.find((f) => f.default);
      if (defaultAddress) setAddress(defaultAddress);
    }
  }, [addresses]);
  return (
    <FlexChild>
      <VerticalFlex className={styles.wrapper}>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.title}>
              <P>배송정보</P>
            </FlexChild>
            <FlexChild
              width={"max-content"}
              className={styles.addressAdd}
              gap={10}
              onClick={() => {
                if (addresses?.length > 0) {
                  NiceModal.show("addressList", {
                    selected: address,
                    onSuccess: (addr: AddressData) => {
                      setAddress(addr);
                    },
                  });
                } else {
                  NiceModal.show("address", {
                    onSuccess: () => mutate(),
                    default: true,
                  });
                }
              }}
            >
              <P>배송지 {addresses?.length > 0 ? "변경" : "등록"}</P>
              <Image
                src="/resources/icons/arrow_right.png"
                height={8}
                width={"auto"}
              />
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        {address ? (
          <FlexChild paddingTop={12} paddingBottom={11}>
            <VerticalFlex>
              <FlexChild gap={6} paddingBottom={12}>
                <P className={styles.addressName}>{address.name}</P>
                {address.default && (
                  <P className={styles.addressDefault}>기본 배송지</P>
                )}
              </FlexChild>
              <FlexChild className={styles.addressPhone} paddingBottom={6}>
                <P>{address.phone}</P>
              </FlexChild>
              <FlexChild className={styles.addressAdress} paddingBottom={16}>
                <P>
                  {address.address1} {address.address2}
                </P>
              </FlexChild>
              <FlexChild
                className={styles.addressMessage}
                onClick={() =>
                  NiceModal.show("list", {
                    selected: list,
                    list: [
                      "문 앞에 놔주세요",
                      "경비실에 맡겨주세요",
                      "택배함에 넣어주세요",
                      "배송 전에 연락주세요",
                      "직접 입력",
                    ].map((str) => ({
                      label: <P className={styles.addressMessageList}>{str}</P>,
                      value: str,
                    })),
                    onSelect: (item: {
                      label: React.ReactNode;
                      value: string;
                    }) => {
                      setList(item);
                      if (item.value !== "직접 입력")
                        setAddress({ ...address, message: item.value });
                      else setAddress({ ...address, message: "" });
                    },
                  })
                }
              >
                <P>{list?.value || "배송 메모를 선택해주세요."}</P>
                <Image
                  src="/resources/icons/down_arrow.png"
                  height={5}
                  width={10}
                  marginLeft={"auto"}
                />
              </FlexChild>
              {list?.value === "직접 입력" && (
                <FlexChild paddingTop={10}>
                  <VerticalFlex>
                    <FlexChild paddingBottom={6}>
                      <InputTextArea
                        className={styles.addressCustom}
                        width={"100%"}
                        placeHolder="최대 50자까지 입력가능합니다."
                        maxLength={50}
                        onChange={(value) =>
                          setAddress({ ...address, message: value })
                        }
                        value={address.message}
                      />
                    </FlexChild>
                    <FlexChild justifyContent="flex-end">
                      <P className={styles.addressCount}>
                        {address?.message?.length || 0}/50
                      </P>
                    </FlexChild>
                  </VerticalFlex>
                </FlexChild>
              )}
            </VerticalFlex>
          </FlexChild>
        ) : (
          <FlexChild paddingTop={28} paddingBottom={15}>
            <VerticalFlex className={styles.addressEmpty}>
              <FlexChild paddingBottom={"0.25em"}>
                <P>배송지 정보가 없습니다.</P>
              </FlexChild>
              <FlexChild>
                <P>먼저 배송지를 등록해주세요.</P>
              </FlexChild>
            </VerticalFlex>
          </FlexChild>
        )}
      </VerticalFlex>
    </FlexChild>
  );
}

function ProductList({ selected }: { selected: string[] }) {
  const { storeData } = useStore();
  const { cartData } = useCart();
  const [brands, setBrands] = useState<
    (BrandData & { items: LineItemData[] })[]
  >([]);
  useEffect(() => {
    const items =
      cartData?.items?.filter((item) => selected.includes(item.id)) || [];
    const group = _.groupBy(items, (item) => item.variant.product.brand_id);
    const brands = Object.keys(group).map((key) => {
      const brand = group[key]?.[0]?.variant.product.brand;
      return { ...brand, items: group[key] };
    });
    setBrands(brands);
  }, [cartData, selected]);
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild className={styles.title} paddingBottom={10}>
        <P>주문상품</P>
      </FlexChild>
      {brands
        .sort((b1, b2) => b1.name.localeCompare(b2.name))
        .map((brand, index) => (
          <FlexChild key={brand.id}>
            <VerticalFlex>
              <FlexChild className={styles.brandTitle} paddingBottom={6}>
                <P>{brand.name}</P>
              </FlexChild>
              {brand.items
                .sort((i1, i2) =>
                  String(
                    `${
                      i1.variant.product_id
                    } ${i1.created_at.toLocaleString()} ${i1.id}`
                  ).localeCompare(
                    String(
                      `${
                        i2.variant.product_id
                      } ${i2.created_at.toLocaleString()} ${i2.id}`
                    )
                  )
                )
                .map((item) => (
                  <FlexChild key={item.id} paddingBottom={13}>
                    <HorizontalFlex gap={12} alignItems="flex-start">
                      <FlexChild width={"max-content"}>
                        <Image
                          src={
                            item.variant.thumbnail ||
                            item.variant.product.thumbnail
                          }
                          size={80}
                        />
                      </FlexChild>
                      <FlexChild>
                        <VerticalFlex>
                          <FlexChild
                            className={styles.productTitle}
                            paddingBottom={3}
                          >
                            <P>{item.variant.product.title}</P>
                          </FlexChild>
                          <FlexChild
                            className={styles.variantTitle}
                            paddingBottom={6}
                          >
                            <P>
                              {item.variant.title
                                ? `${item.variant.title} / ${item.quantity}개`
                                : `${item.quantity}개`}
                            </P>
                          </FlexChild>
                          <FlexChild>
                            <P className={styles.discountPrice}>
                              <Span>
                                {item.variant.discount_price * item.quantity}
                              </Span>
                              <Span>{storeData?.currency_unit}</Span>
                            </P>
                            <P
                              className={styles.price}
                              paddingLeft={6}
                              hidden={
                                item.variant.discount_price ===
                                item.variant.price
                              }
                            >
                              <Span>{item.variant.price * item.quantity}</Span>
                              <Span>{storeData?.currency_unit}</Span>
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
        ))}
    </VerticalFlex>
  );
}

function Point({ selected }: { selected: string[] }) {
  const { userData } = useAuth();
  const { cartData } = useCart();
  const total =
    cartData?.items
      .filter((item) => selected.includes(item.id))
      .reduce((acc, now) => {
        return acc + now.quantity * now.variant.discount_price;
      }, 0) || 0;
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={4}>
        <P className={styles.title}>푸푸포인트</P>
      </FlexChild>
      <FlexChild paddingBottom={16}>
        <P className={styles.pointDescription}>포인트로 상품이 결제됩니다.</P>
      </FlexChild>
      <FlexChild paddingBottom={7}>
        <P>
          <Span className={styles.pointUseable} paddingRight={"0.5em"}>
            사용 가능 포인트
          </Span>
          <Span className={styles.pointUseableValue}>{userData?.point}</Span>
          <Span className={styles.pointUseableValue}>P</Span>
        </P>
      </FlexChild>
      <FlexChild className={styles.pointHasWrapper}>
        <VerticalFlex>
          <FlexChild paddingBottom={12}>
            <P className={styles.pointUseLabel}>사용 예정 포인트</P>
            <P className={styles.pointUseValue} marginLeft={"auto"}>
              <Span>{-total}</Span>
              <Span>P</Span>
            </P>
          </FlexChild>
          <FlexChild>
            <P className={styles.pointRemainLabel}>ㄴ 잔여 포인트</P>
            <P className={styles.pointRemainValue} marginLeft={"auto"}>
              <Span>{(userData?.point || 0) - total}</Span>
              <Span>P</Span>
            </P>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
function Payment({
  selected,
  shippingMethod,
  setShippingMethod,
}: {
  selected: string[];
  shippingMethod?: ShippingMethodData;
  setShippingMethod: Dispatch<SetStateAction<ShippingMethodData | undefined>>;
}) {
  const { storeData } = useStore();
  const { cartData } = useCart();
  const [total, setTotal] = useState(0);
  const [totalDiscounted, setTotalDiscounted] = useState(0);

  useEffect(() => {
    let total = 0;
    let totalDiscounted = 0;

    cartData?.items
      .filter((item) => selected.includes(item.id))
      .forEach((item) => {
        total += item.quantity * item.variant.price;
        totalDiscounted += item.quantity * item.variant.discount_price;
      });
    setTotal(total);
    setTotalDiscounted(totalDiscounted);
  }, [cartData, selected]);
  useEffect(() => {
    const method = storeData?.methods
      ?.filter(
        (f) =>
          f.min <= totalDiscounted && (f.max === -1 || f.max > totalDiscounted)
      )
      .sort((m1, m2) => m1.amount - m2.amount)?.[0];
    setShippingMethod(method);
  }, [totalDiscounted, storeData]);
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild paddingBottom={16}>
        <P className={styles.title}>결제 금액</P>
      </FlexChild>
      <FlexChild paddingBottom={12}>
        <P className={styles.paymentLabel}>필요한 포인트</P>
        <P className={styles.paymentValue} marginLeft={"auto"}>
          <Span>{total}</Span>
          <Span>{storeData?.currency_unit}</Span>
        </P>
      </FlexChild>
      <FlexChild paddingBottom={15}>
        <P className={styles.paymentLabel}>할인</P>
        <P className={styles.paymentDiscount} marginLeft={"auto"}>
          <Span>{totalDiscounted - total}</Span>
          <Span>{storeData?.currency_unit}</Span>
        </P>
      </FlexChild>
      <FlexChild paddingBottom={16}>
        <P className={styles.paymentLabel}>총 배송비</P>

        {!shippingMethod || shippingMethod.amount === 0 ? (
          <P className={styles.paymentValue} marginLeft={"auto"}>
            무료
          </P>
        ) : (
          <P className={styles.paymentValue} marginLeft={"auto"}>
            <Span>{shippingMethod?.amount}</Span>
            <Span>원</Span>
          </P>
        )}
      </FlexChild>
      <FlexChild className={styles.paymentResultWrapper}>
        <VerticalFlex>
          <FlexChild paddingBottom={12}>
            <P className={styles.paymentTotalPointLabel}>총 필요한 포인트</P>
            <P className={styles.paymentTotalPointValue} marginLeft={"auto"}>
              <Span>{totalDiscounted}</Span>
              <Span>{storeData?.currency_unit}</Span>
            </P>
          </FlexChild>
          <FlexChild>
            <P className={styles.paymentUsepointLabel}>ㄴ 사용 포인트</P>
            <P className={styles.paymentUsepointValue} marginLeft={"auto"}>
              <Span>{-totalDiscounted}</Span>
              <Span>{storeData?.currency_unit}</Span>
            </P>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

function PaymentMethod() {
  return (
    <VerticalFlex className={styles.wrapper}>
      <FlexChild>
        <P>결제 수단</P>
      </FlexChild>
      <FlexChild>
        <P>결제 수단을 선택해주세요.</P>
      </FlexChild>
      <FlexChild>...list</FlexChild>
    </VerticalFlex>
  );
}

function Agree({ setAgree }: { setAgree: Dispatch<SetStateAction<boolean>> }) {
  const [agrees, setAgrees] = useState<string[]>([]);
  const list: {
    title: string;
    require?: boolean;
    content?: React.ReactNode;
  }[] = [
    {
      title: "구매조건 확인 및 결제진행 동의",
      require: true,
      content: (
        <VerticalFlex paddingTop={30}>
          <VerticalFlex className={styles.agreeDescriptionWrapper}>
            <FlexChild className={styles.agreeDescriptionTitle}>
              <P>제1조 (목적)</P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                이 약관은 푸푸글로벌 (이하 "회사")가 제공하는 쇼핑몰 서비스의
                이용에 관한 기본적인 사항을 규정함을 목적으로 합니다
              </P>
            </FlexChild>
          </VerticalFlex>
          <VerticalFlex className={styles.agreeDescriptionWrapper}>
            <FlexChild className={styles.agreeDescriptionTitle}>
              <P>제2조 (서비스 제공 내용)</P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                회사는 회원에게 다음과 같은 서비스를 제공합니다.
              </P>
            </FlexChild>
            <FlexChild className={styles.emptyLine} />
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                • 상품 구매 및 결제 서비스
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                • 상품 배송 서비스
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                • 회원 관리 및 고객 지원 서비스
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                • 기타 회사가 제공하는 부가 서비스
              </P>
            </FlexChild>
          </VerticalFlex>
          <VerticalFlex className={styles.agreeDescriptionWrapper}>
            <FlexChild className={styles.agreeDescriptionTitle}>
              <P>제3조 (회원가입 및 탈퇴)</P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                1. 회원은 본 약관에 동의함으로써 회원 가입을 신청할 수 있습니다.
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                2. 회원 가입 시 제공되는 개인 정보는 정확하고 최신의 정보로
                입력해야 합니다
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                3. 회원은 언제든지 서비스 탈퇴를 신청할 수 있으며, 탈퇴 절차는
                회사의 정책에 따릅니다
              </P>
            </FlexChild>
          </VerticalFlex>
          <VerticalFlex className={styles.agreeDescriptionWrapper}>
            <FlexChild className={styles.agreeDescriptionTitle}>
              <P>제4조 (계약의 체결 및 해지)</P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                1. 회원이 본 약관에 동의하고 가입 절차를 마친 후, 회사는 회원의
                신청을 승인하여 서비스를 제공합니다.
              </P>
            </FlexChild>
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                2. 회원은 언제든지 서비스 이용을 중지하고 계약을 해지할 수
                있습니다. 해지 절차는 회사 정책에 따릅니다.
              </P>
            </FlexChild>
            <FlexChild className={styles.emptyLine} />
            <FlexChild className={styles.emptyLine} />
            <FlexChild>
              <P className={styles.agreeDescriptionContent}>
                푸푸글로벌에서 제공하는 서비스를 이용하기 전에 본 계약의 조건,
                특히 굵은 글씨로 표시된 부분(면제 또는 책임 한도 조건을 포함하되
                이에 국한되지 않음)을 주의 깊게 읽고 완전히 이해하시기 바랍니다.
                만약 귀하가 본 서비스 계약 및/또는 그 수정 사항에 동의하지 않을
                경우, 귀하는 푸푸글로벌이 제공하는 서비스 이용을 적극적으로
                중단할 수 있습니다. 귀하가 푸푸글로벌이 제공하는 서비스를
                사용하는 순간, 귀하는 푸푸글로벌이 언제든지 할 수 있는 서비스
                계약 수정 사항을 포함하여 본 서비스 계약의 모든 조건을 이해하고
                완전히 동의한 것으로 간주되며, 당사의 사용자가 됩니다.
              </P>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      ),
    },
    {
      title: "개인정보 수집 및 이용 동의",
      require: true,
    },
  ];
  useEffect(() => {
    setAgree(agrees.length === list.length);
  }, [agrees]);

  return (
    <CheckboxGroup
      name="agree"
      values={agrees}
      onChange={(values) => setAgrees(values)}
    >
      <VerticalFlex className={styles.wrapper}>
        <FlexChild gap={8} paddingBottom={13}>
          <CheckboxAll />
          <P
            className={styles.agreeTitle}
            onClick={() => {
              if (list.length === agrees.length) setAgrees([]);
              else setAgrees(list.map((_, index) => String(index)));
            }}
          >
            모든 항목에 동의합니다.
          </P>
        </FlexChild>
        <Div className={styles.line} marginBottom={15} />

        <FlexChild className={styles.agreeContentWrapper}>
          <VerticalFlex>
            {list.map((l, index) => (
              <FlexChild key={`agree_${index}`} paddingBottom={20} gap={8}>
                <CheckboxChild id={String(index)} />
                <P
                  onClick={() => {
                    if (agrees.includes(String(index))) {
                      setAgrees((prev) => [
                        ...prev.filter((value) => value !== String(index)),
                      ]);
                    } else
                      setAgrees((prev) =>
                        Array.from(new Set([...prev, String(index)]))
                      );
                  }}
                >
                  {l.require && (
                    <Span
                      className={styles.agreeRequire}
                      paddingRight={"0.25em"}
                    >
                      [필수]
                    </Span>
                  )}
                  <Span className={styles.agreeContent}>{l.title}</Span>
                </P>
                {l.content && (
                  <P
                    marginLeft={"auto"}
                    className={styles.agreeMore}
                    onClick={() =>
                      NiceModal.show("confirm", {
                        title: l.title,
                        message: l.content,
                        confirmText: "동의",
                        onConfirm: () =>
                          setAgrees(
                            Array.from(new Set([...agrees, String(index)]))
                          ),
                        withCloseButton: true,
                        width: "100vw",
                        height: "100dvh",
                      })
                    }
                  >
                    보기
                  </P>
                )}
              </FlexChild>
            ))}
          </VerticalFlex>
        </FlexChild>
      </VerticalFlex>
    </CheckboxGroup>
  );
}
