"use client";
import PrivacyContent from "@/components/agreeContent/privacyContent";
import TermContent from "@/components/agreeContent/TermContent";
import Button from "@/components/buttons/Button";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";
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
import DeliveryAddEdit from "@/modals/DeliveryAddEdit/DeliveryAddEdit";
import DeliveryListModal from "@/modals/DeliveryListModal/DeliveryListModal";
import {
  useCart,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import style from "./page.module.css";

//  const cart = [
//     {
//        title: '여성용) 핑크색 일본 st 로제 베일 가운',
//        thumbnail: '/resources/images/dummy_img/product_07.png',
//        brand: '푸푸토이',
//        price: '20,000',
//        option: [
//           {title: '여성용) 핑크색 일본 컬러 레드', price: '0'},
//           {title: '여성용) 핑크색 일본 1+1 증정', price: '1,000'},
//        ],
//        delivery: '/resources/icons/cart/cj_icon.png',
//     },
//     {
//        title: '여성용) 핑크색 일본 st 로제 베일 가운',
//        thumbnail: '/resources/images/dummy_img/product_07.png',
//        brand: '푸푸토이',
//        price: '20,000',
//        option: [
//           {title: '여성용) 핑크색 일본 컬러 레드', price: '0'},
//           {title: '여성용) 핑크색 일본 1+1 증정', price: '1,000'},
//        ],
//        delivery: '/resources/icons/cart/cj_icon.png',
//     }
//  ]

export function CartWrap() {
  const { cartData } = useCart();

  const [CartCheck, setCartCheck] = useState<string[]>([]);

  console.log(CartCheck);

  const deliveryAddEditModal = () => {
    NiceModal.show(ConfirmModal, {
      message: <DeliveryAddEdit />,
      confirmText: "저장",
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

  const deliveryListModal = () => {
    NiceModal.show(ConfirmModal, {
      message: <DeliveryListModal />,
      confirmText: "저장",
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
    <HorizontalFlex className={style.cart_wrap}>
      <VerticalFlex className={style.cart_data}>
        <CheckboxGroup name="carts" values={CartCheck} onChange={setCartCheck}>
          <VerticalFlex className={style.product_list}>
            <article>
              <P className={style.list_title}>담은 상품</P>
              <FlexChild alignItems="center" gap={10} paddingBottom={40}>
                <CheckboxAll />
                <Span>전체선택</Span>
              </FlexChild>
            </article>
            {
              // cartData?.items && cartData.items.length > 0 ? (
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
              //   ) : (
              //    <NoContent type={'장바구니'} />
              //   )
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

        <FlexChild className={style.delivery_info}>
          <VerticalFlex alignItems="start">
            <article>
              <P className={style.list_title}>배송 정보</P>
              {1 < 0 ? (
                <Button
                  className={style.delivery_list_btn}
                  onClick={deliveryAddEditModal}
                >
                  배송지 목록
                </Button>
              ) : (
                <Button
                  className={style.delivery_list_btn}
                  onClick={deliveryListModal}
                >
                  배송지 추가
                </Button>
              )}
            </article>
            {1 < 0 ? (
              <VerticalFlex className={style.info_list}>
                <HorizontalFlex className={style.info_item}>
                  <Span>이름</Span>
                  <P>테스트</P>
                </HorizontalFlex>

                <HorizontalFlex className={style.info_item}>
                  <Span>배송주소</Span>
                  <P>(35353) 서구 도안동로 234 대전 303동 1302호</P>
                </HorizontalFlex>

                <HorizontalFlex className={style.info_item}>
                  <Span>연락처</Span>
                  <P>01012345678</P>
                </HorizontalFlex>

                <VerticalFlex
                  className={clsx(style.info_item, style.info_select_box)}
                >
                  <Span>배송 요청사항 선택</Span>

                  <SelectBox />
                </VerticalFlex>
              </VerticalFlex>
            ) : (
              // 배송지 없을 때
              <NoContent type="배송지"></NoContent>
            )}
          </VerticalFlex>
        </FlexChild>

        <FlexChild className={style.payment_root}>
          <VerticalFlex alignItems="start">
            <article>
              <P className={style.list_title}>결제수단</P>
              <P className={style.list_txt}>결제수단을 선택해 주세요.</P>
            </article>

            <ChoiceGroup name={"payment_root"}>
              <VerticalFlex className={style.payment_deak}>
                <FlexChild className={clsx(style.payment_card)}>
                  <FlexChild width={"auto"}>
                    <ChoiceChild id={"credit_card"} />
                  </FlexChild>
                  <Span>신용카드 결제</Span>
                </FlexChild>
              </VerticalFlex>
            </ChoiceGroup>
          </VerticalFlex>
        </FlexChild>

        <FlexChild className={style.agree_info}>
          <AgreeInfo />
        </FlexChild>
      </VerticalFlex>

      <FlexChild className={style.payment_block}>
        <VerticalFlex>
          <VerticalFlex alignItems="start">
            <article>
              <P className={style.list_title}>결제 금액</P>
            </article>

            <VerticalFlex className={style.info_list}>
              <HorizontalFlex className={style.info_item}>
                <Span>상품 금액</Span>

                <P>
                  28,000 <Span>₩</Span>
                </P>
              </HorizontalFlex>

              <HorizontalFlex className={style.info_item}>
                <Span>배송비</Span>

                <P>
                  0 <Span>₩</Span>
                </P>
              </HorizontalFlex>

              <HorizontalFlex className={style.info_item}>
                <Span>합계</Span>

                <P color={"var(--main-color1)"}>
                  28,000 <Span color="#fff">₩</Span>
                </P>
              </HorizontalFlex>
            </VerticalFlex>
          </VerticalFlex>

          <FlexChild className={style.total_pay_txt}>
            <Span>총 결제 금액</Span>
            <P color={"var(--main-color1)"}>
              28,000 <Span color="#fff">₩</Span>
            </P>
          </FlexChild>

          <FlexChild marginTop={30}>
            {/* 결제 정보 전부 체크되기 전에는 disabled class 처리하고 경고문 띄우기  */}
            <Button className={clsx(style.payment_btn, style.disabled)}>
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
    <VerticalFlex className={style.cart_item} gap={20}>
      <HorizontalFlex justifyContent="start">
        <FlexChild width={"auto"} marginRight={15} alignSelf="start">
          <CheckboxChild className={style.checkbox} id={item.id} />
        </FlexChild>

        <FlexChild className={style.unit} width={"auto"}>
          <Image
            src={item?.variant?.thumbnail || item?.variant?.product?.thumbnail}
            width={150}
          />
          <VerticalFlex
            className={style.unit_content}
            width={"auto"}
            alignItems="start"
          >
            <Span className={style.unit_brand}>
              {item?.variant?.product?.brand?.name}
            </Span>
            <P
              className={style.unit_title}
              lineClamp={2}
              overflow="hidden"
              display="--webkit-box"
            >
              {item.variant.product.title}
            </P>
            <P
              className={style.unit_title}
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
      </HorizontalFlex>

      {/* 갯수 추가 */}
      <HorizontalFlex className={style.totalPrice} justifyContent="end">
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
          {item.variant.discount_price * quantity} <Span>₩</Span>
        </P>
      </HorizontalFlex>
    </VerticalFlex>
  );
}

export function SelectBox() {
  const { cartData } = useCart();
  const [selectedMessageOption, setSelectedMessageOption] = useState("");

  //    const handleMessageOptionChange = (value) => {
  //     setSelectedMessageOption(value);
  //     if (value === t("enterDirectly")) {
  //       setMessage("");
  //       setCustomMessage("");
  //     } else {
  //       setMessage(value);
  //     }
  //   };

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
        placeholder={"선택 안함"}
        value={selectedMessageOption}
      />

      {/* 직접 입력하기 조건일때만 나타나게 작업하기 */}
      {selectedMessageOption && (
        <Input
          width={"100%"}
          className={style.direct_input}
          // value={customMessage}
          // onChange={(value) => {
          //    setCustomMessage(value);
          //    setMessage(value);
          // }}
          placeHolder={"배송 요청사항을 입력해 주세요."}
          // maxLength={50}
          // style={{
          //    borderRadius: "3px",
          //    border: "1px solid #dadada",
          // }}
        />
      )}
    </>
  );
}

export function AgreeInfo() {
  const [TermOpen, setTermOpen] = useState(false);
  const [PrivacyOpen, setPrivacyOpen] = useState(false);

  const agreeToggle = () => {};

  return (
    <VerticalFlex alignItems="start">
      <article>
        <P className={style.list_title}>이용약관 동의</P>
      </article>

      <CheckboxGroup name={"agree_check"}>
        <VerticalFlex className={style.agree_list}>
          <HorizontalFlex className={style.agree_item}>
            <FlexChild width={"auto"} gap={10}>
              <CheckboxAll></CheckboxAll>
              <Span>전체 이용약관 동의</Span>
            </FlexChild>
          </HorizontalFlex>

          <VerticalFlex gap={10}>
            <HorizontalFlex className={style.agree_item}>
              <FlexChild width={"auto"} gap={10}>
                <CheckboxChild id={"term_check"} />
                <Span>[필수] 구매조건 확인 및 결제진행 동의</Span>
              </FlexChild>

              <Span
                className={style.more_btn}
                onClick={() => setTermOpen((prev) => !prev)}
              >
                {TermOpen ? "닫기" : "자세히보기"}
              </Span>
            </HorizontalFlex>

            {TermOpen && (
              <FlexChild className={style.agree_box}>
                <TermContent size={7} />
              </FlexChild>
            )}
          </VerticalFlex>

          <VerticalFlex gap={10}>
            <HorizontalFlex className={style.agree_item}>
              <FlexChild width={"auto"} gap={10}>
                <CheckboxChild id={"privacy_check"} />
                <Span>[필수] 개인정보 수집 및 이용 동의</Span>
              </FlexChild>

              <Span
                className={style.more_btn}
                onClick={() => setPrivacyOpen((prev) => !prev)}
              >
                {PrivacyOpen ? "닫기" : "자세히보기"}
              </Span>
            </HorizontalFlex>

            {PrivacyOpen && (
              <FlexChild className={style.agree_box}>
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
