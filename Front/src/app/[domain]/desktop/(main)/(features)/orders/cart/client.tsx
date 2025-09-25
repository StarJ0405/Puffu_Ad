"use client";
import PrivacyContent from "@/components/agreeContent/privacyContent";
import TermContent from "@/components/agreeContent/TermContent";
import Button from "@/components/buttons/Button";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import RadioChild from "@/components/choice/radio/RadioChild";
import RadioGroup from "@/components/choice/radio/RadioGroup";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import DeliveryAddEdit, {
  DeliveryAddEditRef,
} from "@/modals/main/DeliveryAddEdit/DeliveryAddEdit";
import DeliveryListModal, {
  DeliveryListRef,
} from "@/modals/main/DeliveryListModal/DeliveryListModal";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import {
  useCart,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import useAddress from "@/shared/hooks/main/useAddress";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import { Sessions } from "@/shared/utils/Data";
import { toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export function CartWrap() {
  const { userData, reload } = useAuth();
  const { storeData } = useStore();
  const { cartData } = useCart();
  const { addresses, mutate } = useAddress();
  const [address, setAddress] = useState<AddressData>();
  const [selected, setSelected] = useState<string[]>(
    cartData?.items.map((i) => i.id) || []
  );
  const formRef = useRef<DeliveryAddEditRef>(null);
  const listRef = useRef<DeliveryListRef>(null);
  const Create = (data: Partial<AddressDataFrame>) => {
    requester.createAddress(data, () => mutate());
  };
  const [isLoading, setIsLoading] = useState(false);
  const [agrees, setAgrees] = useState<string[]>([]);
  const [payment, setPayment] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [point, setPoint] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [totalDiscounted, setTotalDiscounted] = useState<number>(0);
  const [shipping, setShipping] = useState<ShippingMethodData>();
  const navigate = useNavigate();
  const deliveryAddModal = () => {
    NiceModal.show(ConfirmModal, {
      message: <DeliveryAddEdit ref={formRef} />,
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
          await Create(formData);
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

  const deliveryListModal = () => {
    NiceModal.show(ConfirmModal, {
      message: <DeliveryListModal selectable ref={listRef} address={address} />,
      confirmText: "저장",
      cancelText: "닫기",
      // onclick: setPaswwordStep(1),
      preventable: true,
      withCloseButton: true,
      onConfirm: async () => {
        const addr = listRef.current?.getSelect();
        if (addr) setAddress(addr);
        return true;
      },
    });
  };
  useEffect(() => {
    const _default = addresses.find((f) => f.default);
    setAddress(_default);
  }, [addresses]);
  useEffect(() => {
    let total = 0;
    let totalDiscounted = 0;
    cartData?.items
      .filter((item) => selected.includes(item.id))
      .forEach((item) => {
        total += item?.variant?.price * item.quantity;
        totalDiscounted += (item?.variant?.discount_price || 0) * item.quantity;
      });
    const shippingMethod = storeData?.methods
      ?.filter((f) => f.min <= total && (f.max === -1 || f.max > total))
      .sort((m1, m2) => m1.amount - m2.amount)?.[0];
    setShipping(shippingMethod);
    setTotalDiscounted(totalDiscounted);
    setTotal(total);
  }, [cartData, storeData, selected]);

  return (
    <HorizontalFlex className={styles.cart_wrap}>
      <VerticalFlex className={styles.cart_data}>
        <CheckboxGroup
          name="carts"
          initialValues={selected}
          onChange={setSelected}
        >
          <VerticalFlex className={styles.product_list}>
            <article>
              <P className={styles.list_title}>담은 상품</P>
              <FlexChild alignItems="center" gap={10} paddingBottom={40}>
                <CheckboxAll />
                <Span>전체선택</Span>
              </FlexChild>
            </article>
            {
              // 담은 상품 목록
              cartData?.items
                .sort((i1, i2) =>
                  String(`${i1.created_at} ${i1.id}`).localeCompare(
                    String(`${i2.created_at} ${i2.id}`)
                  )
                )
                ?.map((item: LineItemData) => (
                  <Item item={item} key={item.id} />
                ))
            }

            {cartData?.items?.length ? null : <NoContent type={"장바구니"} />}
          </VerticalFlex>
        </CheckboxGroup>

        {/* <FlexChild className={style.delivery_root}>
            <VerticalFlex alignItems="start">
              <article>
                  <P className={style.list_title}>배송방법</P>
              </article>

              <HorizontalFlex marginTop={15}>
                  <FlexChild className={style.delivery_btn}>
                    <Image src="/resources/icons/cart/delivery_icon.png" width={36} />
                    <Span>배송</Span>
                  </FlexChild>
              </HorizontalFlex>
            </VerticalFlex>
        </FlexChild> */}

        <FlexChild className={styles.delivery_info}>
          <VerticalFlex alignItems="start">
            <article>
              <P className={styles.list_title}>배송 정보</P>
              {addresses.length > 0 ? (
                <Button
                  className={styles.delivery_list_btn}
                  onClick={deliveryListModal}
                >
                  배송지 목록
                </Button>
              ) : (
                <Button
                  className={styles.delivery_list_btn}
                  onClick={deliveryAddModal}
                >
                  배송지 추가
                </Button>
              )}
            </article>
            {address ? (
              <VerticalFlex className={styles.info_list}>
                <HorizontalFlex className={styles.info_item}>
                  <Span>이름</Span>
                  <P>{address.name}</P>
                </HorizontalFlex>

                <HorizontalFlex className={styles.info_item}>
                  <Span>배송주소</Span>
                  <P>
                    ({address.postal_code}) {address.address1}{" "}
                    {address.address2}
                  </P>
                </HorizontalFlex>

                <HorizontalFlex className={styles.info_item}>
                  <Span>연락처</Span>
                  <P>{address.phone}</P>
                </HorizontalFlex>

                <VerticalFlex
                  className={clsx(styles.info_item, styles.info_select_box)}
                >
                  <Span>배송 요청사항 선택</Span>

                  <SelectBox setMessage={setMessage} />
                </VerticalFlex>
              </VerticalFlex>
            ) : (
              // 배송지 없을 때
              <NoContent type="배송지"></NoContent>
            )}
          </VerticalFlex>
        </FlexChild>

        <FlexChild className={styles.payment_root}>
          <VerticalFlex alignItems="start">
            <article>
              <P className={styles.list_title}>결제수단</P>
              <P className={styles.list_txt}>결제수단을 선택해 주세요.</P>
            </article>

            <RadioGroup
              name={"payment_root"}
              onValueChange={(value) => setPayment(value)}
            >
              <VerticalFlex className={styles.payment_deak}>
                <FlexChild className={clsx(styles.payment_card)}>
                  <FlexChild width={"auto"}>
                    <RadioChild id={"credit_card"} />
                  </FlexChild>
                  <Span>신용카드 결제</Span>
                </FlexChild>
                {/* <FlexChild className={clsx(style.payment_card)}>
                  <FlexChild width={"auto"}>
                    <RadioChild id={"toss"} />
                  </FlexChild>
                  <Span>토스 결제</Span>
                </FlexChild> */}
              </VerticalFlex>
            </RadioGroup>
          </VerticalFlex>
        </FlexChild>

        <FlexChild className={styles.agree_info}>
          <AgreeInfo setAgrees={setAgrees} />
        </FlexChild>
      </VerticalFlex>

      <FlexChild className={styles.payment_block}>
        <VerticalFlex>
          <VerticalFlex alignItems="start">
            <article>
              <P className={styles.list_title}>결제 금액</P>
            </article>

            <VerticalFlex className={styles.info_list}>
              <HorizontalFlex className={styles.info_item}>
                <Span>상품 금액</Span>

                <P>
                  <Span>{totalDiscounted}</Span>
                  <Span> ₩</Span>
                </P>
              </HorizontalFlex>

              <HorizontalFlex className={styles.info_item}>
                <Span>배송비</Span>

                <P>
                  <Span>{shipping?.amount || 0}</Span>
                  <Span> ₩</Span>
                </P>
              </HorizontalFlex>

              <HorizontalFlex className={styles.info_item}>
                <Span>합계</Span>

                <P color={"var(--main-color1)"}>
                  <Span>{(shipping?.amount || 0) + totalDiscounted}</Span>
                  <Span color="#fff"> ₩</Span>
                </P>
              </HorizontalFlex>
            </VerticalFlex>
            <VerticalFlex className={clsx(styles.info_list, styles.point_box)}>
              <HorizontalFlex className={styles.info_item}>
                <Span>보유 포인트</Span>

                <P className={styles.my_point}>
                  <Span>{userData?.point || 0}</Span>
                  <Span> P</Span>
                </P>
              </HorizontalFlex>

              <HorizontalFlex className={clsx(styles.info_item, styles.point_input_box)}>
                <InputNumber
                  width={"100%"}
                  hideArrow
                  value={point}
                  onChange={(value) => setPoint(value as number)}
                  max={Math.min(
                    userData?.point || 0,
                    totalDiscounted + (shipping?.amount || 0)
                  )}
                  min={0}
                />
                <Button className={styles.cancel_btn} onClick={() => setPoint(0)}>사용 취소</Button>
              </HorizontalFlex>

              <HorizontalFlex className={clsx(styles.info_item, styles.point_total)}>
                <P><Span>사용 후 남은 포인트 </Span></P>
                <P className={styles.my_point}>
                  <Span>{(userData?.point || 0) - point}</Span>
                  <Span> P</Span>
                </P>
              </HorizontalFlex>
            </VerticalFlex>
          </VerticalFlex>

          <FlexChild className={styles.total_pay_txt}>
            <Span>총 결제 금액</Span>
            <P color={"var(--main-color1)"}>
              <Span>{(shipping?.amount || 0) + totalDiscounted - point}</Span>
              <Span color="#fff"> ₩</Span>
            </P>
          </FlexChild>

          <FlexChild marginTop={30}>
            {/* 결제 정보 전부 체크되기 전에는 disabled class 처리하고 경고문 띄우기  */}
            <Button
              isLoading={isLoading}
              disabled={agrees.length < 2 || !payment || selected?.length === 0}
              className={styles.payment_btn}
              onClick={async () => {
                if (point > 0) {
                  setIsLoading(true);
                  const { user } = await requester.getCurrentUser();
                  if (user.point < point) {
                    reload();
                    return toast({
                      message: "보유포인트가 사용포인트보다 적습니다.",
                    });
                  }
                }
                const data: any = {
                  selected,
                  address_id: address?.id,
                  shipping_method_id: shipping?.id,
                  message: message,
                  cart_id: cartData?.id,
                  point,
                };
                if (totalDiscounted + (shipping?.amount || 0) - point === 0) {
                  setIsLoading(true);
                  requester.createOrder(
                    data,
                    ({
                      content,
                      error,
                    }: {
                      content: OrderData;
                      error: any;
                    }) => {
                      if (error) {
                        toast({ message: error });
                        setIsLoading(false);
                        return;
                      }
                      sessionStorage.setItem(
                        Sessions.ORDER,
                        JSON.stringify(content)
                      );
                      navigate("/orders/complete", {
                        type: "replace",
                      });
                    }
                  );
                } else
                  switch (payment) {
                    // case "toss": {
                    //   sessionStorage.setItem(
                    //     Sessions.PAYMENT,
                    //     JSON.stringify(data)
                    //   );
                    //   navigate(`/orders/cart/toss`);
                    //   break;
                    // }
                    case "credit_card": {
                      const trackId = data.cart_id + "_" + new Date().getTime();
                      const items = cartData?.items?.filter((f) =>
                        selected.includes(f.id)
                      );
                      let total = 0;

                      items
                        ?.filter((item) => selected.includes(item.id))
                        .forEach((item) => {
                          const discount_price =
                            item?.variant?.discount_price || 0;
                          const tax = Math.round(
                            (discount_price *
                              (item?.variant?.product?.tax_rate || 0)) /
                              100
                          );
                          total +=
                            discount_price * item.quantity +
                            tax * item.quantity;
                        });
                      const params = {
                        paytype: "nestpay",
                        trackId: trackId,
                        payMethod: "card",
                        amount: total + (shipping?.amount || 0) - point,
                        payerId: userData?.id,
                        payerName: userData?.name,
                        payerEmail: userData?.username,
                        payerTel: userData?.phone,
                        returnUrl: `${origin}/payment`,
                        products: items?.map((i) => ({
                          name: i.variant.total_code || i.variant_id.slice(4),
                          qty: i.total_quantity,
                          price: i.variant.discount_price * i.quantity,
                        })),
                      };
                      const result = await requester.requestPaymentApproval(
                        params
                      );

                      if (!window._babelPolyfill) {
                        const jsUrl = process.env.NEXT_PUBLIC_STATIC;
                        const jsElement = document.createElement("script");
                        jsElement.src = jsUrl + "?ver=" + new Date().getTime();
                        jsElement.onload = () => {
                          if (window.NESTPAY) {
                            window.NESTPAY.welcome();
                            window.NESTPAY.pay({
                              payMethod: "card",
                              trxId: result?.link?.trxId,
                              openType: "layer",
                              onApprove: async (response) => {
                                if (response.resultCd === "0000") {
                                  try {
                                    const approveResult =
                                      await requester.approvePayment({
                                        trxId:
                                          result?.content?.trxId ||
                                          result?.link?.trxId,
                                        resultCd: response.resultCd,
                                        resultMsg: response.resultMsg,
                                        customerData: JSON.stringify(userData),
                                      });
                                    if (
                                      approveResult?.approveResult?.result
                                        ?.resultCd === "0000"
                                    ) {
                                      setIsLoading(true);
                                      data.payment =
                                        approveResult?.approveResult?.pay;
                                      requester.createOrder(
                                        data,
                                        ({
                                          content,
                                          error,
                                        }: {
                                          content: OrderData;
                                          error: any;
                                        }) => {
                                          if (error) {
                                            toast({ message: error });
                                            setIsLoading(false);
                                            return;
                                          }
                                          sessionStorage.setItem(
                                            Sessions.ORDER,
                                            JSON.stringify(content)
                                          );
                                          navigate("/orders/complete", {
                                            type: "replace",
                                          });
                                        }
                                      );
                                    } else {
                                      NiceModal.show("confirm", {
                                        clickOutsideToClose: false,
                                        message:
                                          approveResult?.approveResult?.result
                                            ?.resultMsg ||
                                          "알 수 없는 오류가 발생했습니다.",
                                        confirmText: "장바구니로 돌아가기",
                                        onConfirm: () =>
                                          navigate("/orders/cart"),
                                      });
                                    }
                                  } catch (error) {}
                                } else if (response.resultCd !== "CB49") {
                                  NiceModal.show("confirm", {
                                    clickOutsideToClose: false,
                                    message:
                                      response?.resultMsg ||
                                      "알 수 없는 오류가 발생했습니다.",
                                    confirmText: "장바구니로 돌아가기",
                                    onConfirm: () => navigate("/orders/cart"),
                                  });
                                }
                              },
                            });
                          }
                        };

                        const existingScript = document.querySelector(
                          'script[src*="nestpay.v1.js"]'
                        );
                        if (existingScript) {
                          existingScript.remove();
                        }

                        document.head.appendChild(jsElement);
                        return () => {
                          const script = document.querySelector(
                            'script[src*="nestpay.v1.js"]'
                          );
                          if (script) {
                            script.remove();
                          }
                        };
                      } else {
                        if (window.NESTPAY) {
                          window.NESTPAY.welcome();
                          window.NESTPAY.pay({
                            payMethod: "card",
                            trxId: result?.link?.trxId,
                            openType: "layer",
                            onApprove: async (response) => {
                              if (response.resultCd === "0000") {
                                try {
                                  const approveResult =
                                    await requester.approvePayment({
                                      trxId:
                                        result?.content?.trxId ||
                                        result?.link?.trxId,
                                      resultCd: response.resultCd,
                                      resultMsg: response.resultMsg,
                                      customerData: JSON.stringify(userData),
                                    });
                                  if (
                                    approveResult?.approveResult?.result
                                      ?.resultCd === "0000"
                                  ) {
                                    setIsLoading(true);
                                    data.payment =
                                      approveResult?.approveResult?.pay;
                                    requester.createOrder(
                                      data,
                                      ({
                                        content,
                                        error,
                                      }: {
                                        content: OrderData;
                                        error: any;
                                      }) => {
                                        if (error) {
                                          toast({ message: error });
                                          setIsLoading(false);
                                          return;
                                        }
                                        sessionStorage.setItem(
                                          Sessions.ORDER,
                                          JSON.stringify(content)
                                        );
                                        navigate("/orders/complete", {
                                          type: "replace",
                                        });
                                      }
                                    );
                                  } else {
                                    NiceModal.show("confirm", {
                                      clickOutsideToClose: false,
                                      message:
                                        approveResult?.approveResult?.result
                                          ?.resultMsg ||
                                        "알 수 없는 오류가 발생했습니다.",
                                      confirmText: "장바구니로 돌아가기",
                                      onConfirm: () => navigate("/orders/cart"),
                                    });
                                  }
                                } catch (error) {}
                              } else if (response.resultCd !== "CB49") {
                                NiceModal.show("confirm", {
                                  clickOutsideToClose: false,
                                  message:
                                    response?.resultMsg ||
                                    "알 수 없는 오류가 발생했습니다.",
                                  confirmText: "장바구니로 돌아가기",
                                  onConfirm: () => navigate("/orders/cart"),
                                });
                              }
                            },
                          });
                        }
                      }
                      break;
                    }
                  }
              }}
            >
              <Span>결제하기</Span>
            </Button>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
    </HorizontalFlex>
  );
}

export function Item({ item }: { item: LineItemData }) {
  const { storeData } = useStore();
  const { cartData, reload } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item]);

  return (
    <VerticalFlex className={styles.cart_item} gap={20}>
      <HorizontalFlex justifyContent="start" position="relative">
        <FlexChild width={"auto"} marginRight={15} alignSelf="start">
          <CheckboxChild className={styles.checkbox} id={item.id} />
        </FlexChild>

        <FlexChild className={styles.unit}>
          <Image
            src={item?.variant?.thumbnail || item?.variant?.product?.thumbnail}
            width={150}
          />
          <VerticalFlex className={styles.unit_content} alignItems="start">
            <Span className={styles.unit_brand}>
              {item?.variant?.product?.brand?.name}
            </Span>
            <P
              className={styles.unit_title}
              lineClamp={2}
              overflow="hidden"
              display="--webkit-box"
            >
              {item.variant.product.title}
            </P>
            <P
              className={styles.unit_title}
              lineClamp={2}
              overflow="hidden"
              display="--webkit-box"
            >
              {item.variant.title}
            </P>
            {/* <FlexChild className={style.unit_price}>
          <Image
            src={"/resources/icons/cart/cj_icon.png"}
            width={22}
          />
          <P>
            {item?.variant?.discount_price || 0} <Span>₩</Span>
          </P>
        </FlexChild> */}
          </VerticalFlex>
        </FlexChild>

        {/* 삭제 버튼 */}
        <FlexChild
          className={styles.delete_box}
          // onClick={()=> }
        >
          <Button
            onClick={() =>
              requester.removeItem(
                {
                  store_id: storeData?.id,
                  type: cartData?.type,
                  item_id: item.id,
                },
                () => reload()
              )
            }
          >
            <Image src={"/resources/icons/closeBtn_white.png"} width={15} />
            {/* closeBtn_white */}
          </Button>
        </FlexChild>
      </HorizontalFlex>

      {/* 갯수 추가 */}
      <HorizontalFlex className={styles.totalPrice} justifyContent="end">
        <FlexChild width={"auto"}>
          <InputNumber
            min={1}
            value={quantity}
            max={item.variant.stack}
            hideArrow={false}
            width={"40px"}
            style={{
              fontSize: "14px",
              color: "#353535",
            }}
            onChange={(value) => {
              requester
                .updateItem({
                  store_id: storeData?.id,
                  type: cartData?.type,
                  item_id: item.id,
                  quantity: value,
                  extra_quantity: item.extra_quantity,
                })
                .then(() => {
                  reload();
                });
              setQuantity(value);
            }}
          />
        </FlexChild>
        <P>
          {Number(item.variant.discount_price * quantity).toLocaleString(
            "ko-KR"
          )}{" "}
          <Span>₩</Span>
        </P>
      </HorizontalFlex>
    </VerticalFlex>
  );
}

export function SelectBox({
  setMessage,
}: {
  setMessage: Dispatch<SetStateAction<string>>;
}) {
  const [selectedMessageOption, setSelectedMessageOption] = useState("");

  return (
    <>
      <Select
        classNames={{
          header: "web_select",
          placeholder: "web_select_placholder",
          line: "web_select_line",
          arrow: "web_select_arrow",
          search: "web_select_search",
        }}
        options={[
          { value: "직접 입력하기", display: "직접 입력하기" },
          { value: "문 앞에 놓아주세요", display: "문 앞에 놓아주세요" },
          {
            value: "부재 시 연락 부탁드려요",
            display: "부재 시 연락 부탁드려요",
          },
          {
            value: "배송 전 미리 연락해 주세요",
            display: "배송 전 미리 연락해 주세요",
          },
        ]}
        width={'100%'}
        placeholder={"선택 안함"}
        value={selectedMessageOption}
        onChange={(value) => {
          setSelectedMessageOption(value as string);
          if (value !== "직접 입력하기") {
            setMessage(value as string);
          }
        }}
      />

      {/* 직접 입력하기 조건일때만 나타나게 작업하기 */}
      {selectedMessageOption === "직접 입력하기" && (
        <Input
          width={"100%"}
          className={styles.direct_input}
          placeHolder={"배송 요청사항을 입력해 주세요."}
          onChange={(value) => setMessage(value as string)}
          maxLength={50}
        />
      )}
    </>
  );
}

export function AgreeInfo({
  setAgrees,
}: {
  setAgrees: Dispatch<SetStateAction<string[]>>;
}) {
  const [TermOpen, setTermOpen] = useState(false);
  const [PrivacyOpen, setPrivacyOpen] = useState(false);

  return (
    <VerticalFlex alignItems="start">
      <article>
        <P className={styles.list_title}>이용약관 동의</P>
      </article>

      <CheckboxGroup name={"agree_check"} onChange={setAgrees}>
        <VerticalFlex className={styles.agree_list}>
          <HorizontalFlex className={styles.agree_item}>
            <FlexChild width={"auto"} gap={10}>
              <CheckboxAll></CheckboxAll>
              <Span>전체 이용약관 동의</Span>
            </FlexChild>
          </HorizontalFlex>

          <VerticalFlex gap={10}>
            <HorizontalFlex className={styles.agree_item}>
              <FlexChild width={"auto"} gap={10}>
                <CheckboxChild id={"term_check"} />
                <Span>[필수] 구매조건 확인 및 결제진행 동의</Span>
              </FlexChild>

              <Span
                className={styles.more_btn}
                onClick={() => setTermOpen((prev) => !prev)}
              >
                {TermOpen ? "닫기" : "자세히보기"}
              </Span>
            </HorizontalFlex>

            {TermOpen && (
              <FlexChild className={styles.agree_box}>
                <TermContent size={7} />
              </FlexChild>
            )}
          </VerticalFlex>

          <VerticalFlex gap={10}>
            <HorizontalFlex className={styles.agree_item}>
              <FlexChild width={"auto"} gap={10}>
                <CheckboxChild id={"privacy_check"} />
                <Span>[필수] 개인정보 수집 및 이용 동의</Span>
              </FlexChild>

              <Span
                className={styles.more_btn}
                onClick={() => setPrivacyOpen((prev) => !prev)}
              >
                {PrivacyOpen ? "닫기" : "자세히보기"}
              </Span>
            </HorizontalFlex>

            {PrivacyOpen && (
              <FlexChild className={styles.agree_box}>
                <PrivacyContent size={7} />
              </FlexChild>
            )}
          </VerticalFlex>
        </VerticalFlex>
      </CheckboxGroup>

      <P>
        귀하의 정보는 안전하게 보호되고 손상되지 않으며, 당사의 개인정보
        보호정책에 따라서만 처리됩니다.
      </P>
    </VerticalFlex>
  );
}
