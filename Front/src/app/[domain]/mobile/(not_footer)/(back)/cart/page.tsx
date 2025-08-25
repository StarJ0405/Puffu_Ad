"use client";

import Button from "@/components/buttons/Button";
import ProductCard from "@/components/card/ProductCard";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup, {
  defaultCheckboxImages,
} from "@/components/choice/checkbox/CheckboxGroup";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import {
  useCart,
  useStore,
} from "@/providers/StoreProvider/StorePorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import { Sessions } from "@/shared/utils/Data";
import NiceModal from "@ebay/nice-modal-react";
import _ from "lodash";
import { redirect } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper as ReactSwiper, SwiperSlide } from "swiper/react";
import styles from "./page.module.css";

export default function () {
  const { userData } = useAuth();
  const { cartData } = useCart();
  if (!userData?.id) {
    redirect("/login?redirect_url=/cart");
  }
  if (!cartData || cartData?.items.length == 0) {
    return (
      <VerticalFlex>
        <Empty />
        <Div className={styles.space} />
        <Recommend />
      </VerticalFlex>
    );
  }

  const [selected, setSelected] = useState<string[]>([]);
  const { storeData } = useStore();
  const navigate = useNavigate();
  return (
    <VerticalFlex>
      <CartList
        items={cartData.items}
        selected={selected}
        setSelected={setSelected}
      />
      <Div className={styles.space} />
      <Point />
      <Div className={styles.space} />
      <Payment selected={selected} />
      <Div className={styles.space} />
      <Recommend />
      <FlexChild className={styles.paymentButtonWrapper}>
        <Button
          disabled={
            selected?.length === 0 ||
            (storeData?.currency_unit === "P" &&
              (userData?.point || 0) <
                cartData?.items
                  .filter((item) => selected.includes(item.id))
                  .reduce((acc, now) => {
                    return acc + now.variant.discount_price * now.quantity;
                  }, 0))
          }
          className={styles.paymentButton}
          onClick={() => {
            sessionStorage.setItem(
              Sessions.SELECTED_ITEMS,
              JSON.stringify(selected)
            );
            navigate("/payment");
          }}
        >
          구매하기
        </Button>
      </FlexChild>
    </VerticalFlex>
  );
}
function CartList({
  items,
  selected,
  setSelected,
}: {
  items: LineItemData[];
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}) {
  const [brands, setBrands] = useState<
    (BrandData & { items: LineItemData[] })[]
  >([]);
  const allRef = useRef<any>(null);
  useEffect(() => {
    const group = _.groupBy(items, (item) => item.variant.product.brand_id);
    const brands = Object.keys(group).map((key) => {
      const items = group[key];
      const brand = items?.[0]?.variant?.product?.brand;
      return {
        ...brand,
        items,
      };
    });
    setBrands(brands);
  }, [items]);
  useEffect(() => {
    allRef?.current?.click();
  }, [allRef.current]);
  return (
    <CheckboxGroup
      name="cart"
      onChange={(values) => {
        setSelected(values);
      }}
    >
      <VerticalFlex padding={15}>
        <FlexChild gap={8} paddingBottom={12}>
          <CheckboxAll ref={allRef} />
          <P
            onClick={() => allRef?.current?.click()}
          >{`전체선택(${selected.length}/${items.length})`}</P>
        </FlexChild>
        <Div className={styles.line} marginBottom={16} />
        {brands
          .sort((b1, b2) => b1.name.localeCompare(b2.name))
          .map((brand, index) => (
            <Brand
              last={index + 1 === brands.length}
              key={brand.id}
              brand={brand}
              selected={selected}
            />
          ))}
      </VerticalFlex>
    </CheckboxGroup>
  );
}
function Brand({
  last,
  brand,
  selected,
}: {
  last: boolean;
  brand: BrandData & { items: LineItemData[] };
  selected: string[];
}) {
  const refs = useRef<any>({});
  const [status, setStatus] = useState(false);
  useEffect(() => {
    setStatus(brand.items.every((item) => selected.includes(item.id)));
  }, [selected, brand]);
  return (
    <FlexChild>
      <VerticalFlex>
        <FlexChild paddingBottom={28}>
          <VerticalFlex gap={28}>
            <FlexChild
              gap={8}
              onClick={() => {
                if (status) {
                  Object.keys(refs.current).forEach((ref) =>
                    refs.current[ref]?.click()
                  );
                } else {
                  brand.items
                    .filter((item) => !selected.includes(item.id))
                    .forEach((item) => refs.current?.[item.id]?.click());
                }
              }}
            >
              <Image
                size={24}
                src={
                  status ? defaultCheckboxImages.on : defaultCheckboxImages.off
                }
              />
              <P className={styles.brandTitle}>{brand.name}</P>
            </FlexChild>
            {brand.items
              .sort((i1, i2) =>
                String(
                  `${i1.variant.product_id} ${i1.created_at.toLocaleString()} ${
                    i1.id
                  }`
                ).localeCompare(
                  String(
                    `${
                      i2.variant.product_id
                    } ${i2.created_at.toLocaleString()} ${i2.id}`
                  )
                )
              )
              .map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  ref={(el: HTMLInputElement | null) => {
                    refs.current[item.id] = el;
                  }}
                />
              ))}
          </VerticalFlex>
        </FlexChild>
        {!last && <Div className={styles.line2} marginBottom={28} />}
      </VerticalFlex>
    </FlexChild>
  );
}
function Item({
  item,
  ref,
}: {
  item: LineItemData;
  ref: (el: HTMLInputElement | null) => void;
}) {
  const { storeData } = useStore();
  const { cartData, reload } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(item.quantity);
  return (
    <FlexChild gap={8} className={styles.itemWrapper} alignItems="flex-start">
      <Div className={styles.closeWrapper}>
        <Image
          src="/resources/icons/closeBtn.png"
          size={14}
          onClick={() =>
            NiceModal.show("confirm", {
              message: "상품을 삭제하시겠습니까?",
              confirmText: "삭제",
              cancelText: "취소",
              onConfirm: () => {
                requester
                  .removeItem({
                    store_id: storeData?.id,
                    type: cartData?.type,
                    item_id: item.id,
                  })
                  .then(() => {
                    reload();
                    NiceModal.show("toast", {
                      message: (
                        <FlexChild justifyContent="center" gap={10}>
                          <Image
                            src="/resources/icons/check_black.png"
                            size={22}
                          />
                          <P>상품을 삭제했어요</P>
                        </FlexChild>
                      ),
                      withCloseButton: false,
                      className: styles.toastClass,
                    });
                  });
              },
            })
          }
        />
      </Div>
      <FlexChild width={24}>
        <CheckboxChild id={item.id} ref={ref} />
      </FlexChild>
      <FlexChild>
        <VerticalFlex gap={13}>
          <FlexChild gap={12}>
            <Image
              src={item.variant.thumbnail || item.variant.product.thumbnail}
              size={80}
              onClick={() => navigate(`/product/${item.variant.product_id}`)}
            />
            <FlexChild paddingTop={6}>
              <VerticalFlex justifyContent="flex-start" height={80}>
                <FlexChild paddingBottom={3}>
                  <P className={styles.itemProduct}>
                    {item.variant.product.title}
                  </P>
                </FlexChild>
                <FlexChild paddingBottom={6}>
                  <P className={styles.itemVariant}>{item.variant.title}</P>
                </FlexChild>
                <FlexChild>
                  <P
                    className={styles.itemDiscountPrice}
                    paddingRight={"0.5em"}
                  >
                    <Span>{item.variant.discount_price * quantity}</Span>
                    <Span>{storeData?.currency_unit}</Span>
                  </P>
                  <P className={styles.itemPrice}>
                    <Span>{item.variant.price * quantity}</Span>
                    <Span>{storeData?.currency_unit}</Span>
                  </P>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
          </FlexChild>
          <FlexChild>
            <HorizontalFlex gap={12}>
              <FlexChild>
                <Button
                  hidden={!item.variant.title}
                  className={styles.button}
                  onClick={() =>
                    NiceModal.show("optionChange", {
                      product_id: item.variant.product_id,
                      item_id: item.id,
                      onSuccess: reload,
                    })
                  }
                >
                  <P>옵션변경</P>
                </Button>
              </FlexChild>
              <FlexChild>
                <InputNumber
                  borderColor="#eaeaea"
                  min={1}
                  value={item.quantity}
                  max={(item?.variant?.stack || 0) - item.extra_quantity}
                  onChange={(value) => {
                    console.log(value);
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
            </HorizontalFlex>
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
    </FlexChild>
  );
}

function Empty() {
  const navigate = useNavigate();
  return (
    <FlexChild>
      <VerticalFlex padding={"107px 15px"} height={"max-content"}>
        <P className={styles.emptyTitle} paddingBottom={8}>
          장바구니에 담긴 상품이 없어요
        </P>

        <P className={styles.emtptyDescription} paddingBottom={38}>
          원하는 걸 찾아 담아보세요.
        </P>
        <Button className={styles.shoppingButton} onClick={() => navigate("/")}>
          쇼핑하러 가기
        </Button>
      </VerticalFlex>
    </FlexChild>
  );
}

function Recommend() {
  const { storeData } = useStore();
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const { recommends } = useData(
    "recommends",
    { pageSize: 10 },
    (condition) => requester.getProducts(condition),
    {
      onReprocessing: (data) => data?.content || [],
    }
  );
  const newPrevRef = useRef<any>(null);
  const newNextRef = useRef<any>(null);
  useEffect(() => {
    if (swiperInstance && newPrevRef.current) {
      swiperInstance.params.navigation.prevEl = newPrevRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.render();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, newPrevRef.current]);

  useEffect(() => {
    if (swiperInstance && newPrevRef.current) {
      swiperInstance.params.navigation.nextEl = newNextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.render();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, newNextRef.current]);

  return (
    <VerticalFlex className={styles.recommendWrapper}>
      <FlexChild paddingBottom={8}>
        <P className={styles.recommendTitle}>추천 상품</P>
      </FlexChild>
      <FlexChild>
        <ReactSwiper
          spaceBetween={10}
          slidesPerView={2.8}
          loop={true}
          autoplay={{
            delay: 2000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          initialSlide={0}
          direction="horizontal"
          modules={[Autoplay, Navigation]}
          navigation={{
            prevEl: newPrevRef.current,
            nextEl: newNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            const navigation: any = swiper?.params?.navigation;
            if (navigation) {
              navigation.prevEl = newPrevRef.current;
              navigation.nextEl = newNextRef.current;
            }
          }}
          onSwiper={setSwiperInstance}
        >
          {recommends?.map((product: ProductData) => (
            <SwiperSlide key={`new_${product?.id}`}>
              <ProductCard
                product={product}
                currency_unit={storeData?.currency_unit}
              />
            </SwiperSlide>
          ))}
        </ReactSwiper>
      </FlexChild>
    </VerticalFlex>
  );
}

function Point() {
  const { userData } = useAuth();
  return (
    <VerticalFlex className={styles.pointWrapper}>
      <FlexChild paddingBottom={10}>
        <P className={styles.pointTitle}>푸푸포인트</P>
      </FlexChild>
      <FlexChild className={styles.pointHasWrapper}>
        <P className={styles.pointHasLabel}>보유 포인트</P>
        <P className={styles.pointHasValue} marginLeft={"auto"}>
          <Span>{userData?.point || 0}</Span>
          <Span>P</Span>
        </P>
      </FlexChild>
    </VerticalFlex>
  );
}

function Payment({ selected }: { selected: string[] }) {
  const { cartData } = useCart();
  const { storeData } = useStore();
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodData>();
  const [total, setTotal] = useState(0);
  const [totalDiscounted, setTotalDiscounted] = useState(0);
  const [tax, setTax] = useState(0);
  useEffect(() => {
    // 브랜드 별 배송비 계산식은 일단 제외, 브랜드 단위로 total을 묵고 그것마다 배송비를 부담하면 됨.
    let total = 0;
    let tax = 0;
    let totalDiscounted = 0;
    cartData?.items
      .filter((item) => selected.includes(item.id))
      .forEach((item) => {
        const discount_price = item?.variant?.discount_price || 0;
        total += item?.variant?.price * item.quantity;
        totalDiscounted += discount_price * item.quantity;
        tax += (discount_price * (item?.variant?.product?.tax_rate || 0)) / 100;
      });
    const shippingMethod = storeData?.methods
      ?.filter((f) => f.min <= total && (f.max === -1 || f.max > total))
      .sort((m1, m2) => m1.amount - m2.amount)?.[0];
    setShippingMethod(shippingMethod);
    setTotalDiscounted(totalDiscounted);
    setTotal(total);
    setTax(tax);
  }, [cartData, storeData, selected]);

  return (
    <VerticalFlex className={styles.paymentWrapper}>
      <FlexChild paddingBottom={10}>
        <P className={styles.paymentTitle}>결제 금액</P>
      </FlexChild>
      <FlexChild paddingBottom={12}>
        <HorizontalFlex>
          <FlexChild className={styles.paymentLabel}>
            <P>필요한 포인트</P>
          </FlexChild>
          <FlexChild width={"max-content"} className={styles.paymentValue}>
            <P>
              <Span>{total}</Span>
              <Span>{storeData?.currency_unit}</Span>
            </P>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild paddingBottom={12}>
        <HorizontalFlex>
          <FlexChild className={styles.paymentLabel}>
            <P>할인</P>
          </FlexChild>
          <FlexChild width={"max-content"} className={styles.paymentDiscount}>
            <P>
              <Span>{totalDiscounted - total}</Span>
              <Span>{storeData?.currency_unit}</Span>
            </P>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild paddingBottom={4}>
        <HorizontalFlex>
          <FlexChild className={styles.paymentLabel}>
            <P>배송비</P>
          </FlexChild>
          <FlexChild width={"max-content"} className={styles.paymentValue}>
            {shippingMethod && shippingMethod?.amount > 0 ? (
              <P>
                <Span>{shippingMethod?.amount}</Span>
                <Span>원</Span>
              </P>
            ) : (
              <P>무료</P>
            )}
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      <FlexChild gap={4} className={styles.paymentLabel} paddingBottom={16}>
        {/* <P>ⓘ 배송비는 현금으로만 결제됩니다.</P> */}
      </FlexChild>
      <FlexChild className={styles.paymentTotalWrapper} marginBottom={12}>
        <HorizontalFlex>
          <FlexChild className={styles.paymentTotalLabel}>
            <P>총 필요한 포인트</P>
          </FlexChild>
          <FlexChild width={"max-content"} className={styles.paymentTotalValue}>
            <P>
              <Span>{totalDiscounted}</Span>
              <Span>{storeData?.currency_unit}</Span>
            </P>
          </FlexChild>
        </HorizontalFlex>
      </FlexChild>
      {shippingMethod && shippingMethod?.amount > 0 && (
        <FlexChild className={styles.paymentTotalWrapper} marginBottom={24}>
          <HorizontalFlex>
            <FlexChild className={styles.paymentTotalLabel}>
              <P>총 배송비</P>
            </FlexChild>
            <FlexChild
              width={"max-content"}
              className={styles.paymentTotalValue}
            >
              <P>
                <Span>{shippingMethod?.amount}</Span>
                <Span>원</Span>
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      )}
    </VerticalFlex>
  );
}
