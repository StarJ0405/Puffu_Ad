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
import useData from "@/shared/hooks/data/useData";
import useAddress from "@/shared/hooks/main/useAddress";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import { Sessions } from "@/shared/utils/Data";
import { getBankData, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import _ from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import LoadingPageChange from "@/components/loading/LoadingPageChange";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import Div from "@/components/div/Div";
import Inline from "@/components/inline/Inline";

export function CartWrap() {
  const { userData } = useAuth();
  const { storeData } = useStore();
  const { cartData, reload } = useCart();
  const { addresses, mutate } = useAddress();
  const [address, setAddress] = useState<AddressData>();
  const [selected, setSelected] = useState<string[]>(
    cartData?.items.map((i) => i.id) || []
  );
  const formRef = useRef<DeliveryAddEditRef>(null);
  const listRef = useRef<DeliveryListRef>(null);

  const radio = useRef<any>([]);
  const Create = (data: Partial<AddressDataFrame>) => {
    requester.createAddress(data, () => mutate());
  };
  const [isLoading, setIsLoading] = useState(false);
  const [agrees, setAgrees] = useState<string[]>([]);
  const [payment, setPayment] = useState<string>("");
  const [point, setPoint] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [shipping, setShipping] = useState<ShippingMethodData>();
  const navigate = useNavigate();
  const [orderCoupons, setOrderCupons] = useState<string[]>([]);
  const [shippingCoupons, setShippingCupons] = useState<string[]>([]);
  const [otherStores, setOtherStores] = useState<any[]>([]);
  const [recentStores, setRecentStores] = useState<any[]>([]);
  const [favoriteStores, setFavoriteStores] = useState<FavoriteItem[]>([]);
  const [baseCenter, setBaseCenter] = useState<MapCenter | null>(null);

  const [selectOffilineStore, setSelectOffilineStore] = useState<string | null>(
    null
  );

  const [fulfillment, setFulfillment] = useState<FulfillmentData>({
    method: "delivery",
    pickup: "recent",
    selectedStore: null,
  });
  const [itemCoupons, setItemCupons] = useState<
    { item_id: string; coupons: string[] }[]
  >([]);
  const { coupons } = useData(
    "coupons",
    {
      used: false,
      relations: ["products", "categories"],
    },
    (condition) => requester.getCoupons(condition),
    { onReprocessing: (data) => data?.content || [] }
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
    libraries: ["places"],
  });

  const getShippingAmount = () => {
    if (!selected?.length) return 0;
    const amount = shipping?.amount || 0;
    if (shippingCoupons.length > 0) {
      const shippings: CouponData[] = coupons.filter((f: CouponData) =>
        shippingCoupons.includes(f.id)
      );
      const percents = shippings.reduce((acc, now) => {
        if (now.calc === "percent") return acc + now.value;
        return acc;
      }, 0);
      const fix = shippings.reduce((acc, now) => {
        if (now.calc === "fix") return acc + now.value;
        return acc;
      }, 0);
      return Math.max(0, Math.round((amount * (100 - percents)) / 100.0 - fix));
    }
    return amount;
  };

  const ProductPriceSum = () => {
    // 상품 원가 총합 표시
    return (
      cartData?.items
        .filter((f) => selected.includes(f.id))
        .reduce((acc, now) => {
          const amount = (now.variant.price || 0) * now.quantity;
          return acc + amount;
        }, 0) || 0
    );
  };

  const getProductSum = () => {
    // 프로모션 적용한 상품가 총합
    const items: CouponData[] = coupons.filter(
      (f: CouponData) => f.type === "item"
    );
    return (
      cartData?.items
        .filter((f) => selected.includes(f.id))
        .reduce((acc, now) => {
          const amount = (now.variant.discount_price || 0) * now.quantity;
          const coupons: string[] =
            itemCoupons.find((f) => f.item_id === now.id)?.coupons || [];
          if (coupons.length > 0) {
            const products = items.filter((f) => coupons.includes(f.id));
            const percents = products.reduce((acc, now) => {
              if (now.calc === "percent") return acc + now.value;
              return acc;
            }, 0);
            const fix = products.reduce((acc, now) => {
              if (now.calc === "fix") return acc + now.value;
              return acc;
            }, 0);
            return (
              acc +
              Math.max(0, Math.round((amount * (100 - percents)) / 100.0 - fix))
            );
          }

          return acc + amount;
        }, 0) || 0
    );
  };

  function saleTotal() {
    // 할인율 합 (프로모션 세일 포함)

    // 프로모션 세일가
    const promotions =
      cartData?.items
        .filter((f) => selected.includes(f.id))
        .reduce((acc, now) => {
          const amount =
            ((now.variant.price || 0) - (now.variant.discount_price || 0)) *
            now.quantity;
          return acc + amount;
        }, 0) || 0;

    const productPrice =
      cartData?.items
        .filter((f) => selected.includes(f.id))
        .reduce((acc, now) => {
          const variant = (now.variant.discount_price || 0) * now.quantity;
          return acc + variant;
        }, 0) || 0;

    // 배송비만 합친 상품 값
    const amount = getShippingAmount() + productPrice;

    const items: CouponData[] = coupons.filter(
      (f: CouponData) => f.type === "item"
    );

    //상품별 쿠폰 할인 총합
    const productCoupons =
      cartData?.items
        .filter((f) => selected.includes(f.id))
        .reduce((acc, now) => {
          const coupons: string[] =
            itemCoupons.find((f) => f.item_id === now.id)?.coupons || [];

          if (coupons.length > 0) {
            const products = items.filter((f) => coupons.includes(f.id));

            const percents = products.reduce(
              (acc, now) => (now.calc === "percent" ? acc + now.value : acc),
              0
            );

            const fix = products.reduce(
              (acc, now) => (now.calc === "fix" ? acc + now.value : acc),
              0
            );

            // 상품별 금액 기준으로 할인
            const itemAmount = (now.variant.discount_price || 0) * now.quantity;
            const discounted = Math.max(
              0,
              Math.round((itemAmount * (100 - percents)) / 100.0 - fix)
            );

            const discountAmount = itemAmount - discounted;
            return acc + discountAmount;
          }
          return acc;
        }, 0) || 0;

    //주문 전체 쿠폰 할인
    const orderCouponsTotal = () => {
      if (orderCoupons.length > 0) {
        const orders: CouponData[] = coupons.filter((f: CouponData) =>
          orderCoupons.includes(f.id)
        );

        const percents = orders.reduce(
          (acc, now) => (now.calc === "percent" ? acc + now.value : acc),
          0
        );

        const fix = orders.reduce(
          (acc, now) => (now.calc === "fix" ? acc + now.value : acc),
          0
        );

        const discountedAmount = Math.round(
          ((amount - productCoupons) * (100 - percents)) / 100.0 - fix
        );

        return amount - productCoupons - discountedAmount;
      }
      return 0;
    };
    // 구독
    const subscribeTotal = () => {
      if (
        new Date(userData?.subscribe?.ends_at || 0).getTime() >
        new Date().getTime()
      ) {
        return (
          amount -
          productCoupons -
          Math.round(
            ((amount - productCoupons) *
              (100 - (userData?.subscribe?.percent || 0))) /
              100.0
          )
        );
      }
      return 0;
    };

    // 배송비
    const delivery_fee = !selected?.length
      ? 0
      : Math.max(0, (shipping?.amount || 0) - getShippingAmount());
    const orders = orderCouponsTotal();
    const subscribes = subscribeTotal();
    const total =
      productCoupons + orders + promotions + subscribes + delivery_fee;

    //총 할인 금액 반환
    return {
      total,
      promotions,
      productCoupons,
      orders,
      subscribes,
      delivery_fee,
    };
  }

  const selectedStore =
    fulfillment.pickup === "others"
      ? otherStores.find((s) => s.id === selectOffilineStore)
      : fulfillment.selectedStore;

  const center: MapCenter | null = selectedStore
    ? {
        lat: Number(
          selectedStore.lat ??
            selectedStore.offline_store?.lat ??
            baseCenter?.lat
        ),
        lng: Number(
          selectedStore.lng ??
            selectedStore.offline_store?.lng ??
            baseCenter?.lng
        ),
      }
    : baseCenter;

  const saleTotals = saleTotal(); // 세일 총합값

  const getSum = () => {
    const amount = getShippingAmount() + getProductSum();
    if (orderCoupons.length > 0) {
      const orders: CouponData[] = coupons.filter((f: CouponData) =>
        orderCoupons.includes(f.id)
      );
      const percents = orders.reduce((acc, now) => {
        if (now.calc === "percent") return acc + now.value;
        return acc;
      }, 0);
      const fix = orders.reduce((acc, now) => {
        if (now.calc === "fix") return acc + now.value;
        return acc;
      }, 0);
      return Math.round(
        (amount * (100 - percents - (userData?.subscribe?.percent || 0))) /
          100.0 -
          fix
      );
    } else if (userData?.subscribe?.percent) {
      return Math.round(
        (amount * (100 - (userData?.subscribe?.percent || 0))) / 100.0
      );
    }
    return amount;
  };
  const getTotal = () => {
    return Math.max(0, getSum() - point);
  };
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
  const createWishlist = async (store: any) => {
    if (!userData?.id) return;

    const storeId = store.id as string;

    // 이미 즐겨찾기면 막기 (favoriteStores 기준으로 체크)
    const exists = favoriteStores.some(
      (item) => item.offline_store_id === storeId
    );
    if (exists) return;

    // UI 먼저 반영: 해당 매장 is_favorite = true 로
    setOtherStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, is_favorite: true } : s))
    );

    try {
      const res = await requester.createStoreWishlist(storeId, {
        offline_store_id: storeId,
        metadata: {},
        return_data: true,
      });

      // store_wishlist 새로 생성된 id 저장해서 나중에 삭제할 때 사용
      if (res?.content) {
        const created = res.content as FavoriteItem;
        setFavoriteStores((prev) => [created, ...prev]);
      }
    } catch (e) {
      // 실패하면 롤백
      setOtherStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, is_favorite: false } : s))
      );
    }
  };

  const deleteWishlist = async (store: any) => {
    if (!userData?.id) return;

    const storeId = store.id as string;

    // 이 매장에 해당하는 wishlist row 찾기
    const target = favoriteStores.find(
      (item) => item.offline_store_id === storeId
    );
    if (!target) return;

    const wishlistId = target.id;

    // UI 먼저 반영: is_favorite false 로, favoriteStores 배열에서도 제거
    setOtherStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, is_favorite: false } : s))
    );
    setFavoriteStores((prev) =>
      prev.filter((item) => item.offline_store_id !== storeId)
    );

    try {
      await requester.deleteStoreWishlist(wishlistId);
    } catch (e) {
      // 실패하면 롤백
      setOtherStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, is_favorite: true } : s))
      );
      setFavoriteStores((prev) => [target, ...prev]);
    }
  };

  const pickupTabClick = async (tab: FulfillmentData["pickup"]) => {
    setFulfillment((prev) => ({
      ...prev,
      pickup: tab,
    }));

    try {
      if (tab === "recent") {
        const res = await requester.getRecentStores({
          relations: ["offline_store"],
        });
        const list = Array.isArray(res) ? res : res?.content ?? [];
        setRecentStores(list);
      }

      if (tab === "favorite") {
        const res = await requester.getStoreWishlist({
          pageSize: 12,
          pageNumber: 0,
          relations: ["offline_store"],
        });
        console.log("res : ", res);
        const list = Array.isArray(res) ? res : res?.content ?? [];
        setFavoriteStores(list);
      }

      if (tab === "others") {
        const res = await requester.getOfflineStores({
          pageSize: 12,
        });
        const list = Array.isArray(res) ? res : res?.content ?? [];
        setOtherStores(list);
        if (list.length > 0) {
          setSelectOffilineStore(list[0].id);
          setFulfillment((prev) => ({
            ...prev,
            selectedStore: list[0],
          }));
        }
      }
    } finally {
    }
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
    if (!selected?.length) {
      setShipping(undefined);
      setShippingCupons([]);
      return;
    }
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
    setShipping(shippingMethod);
    if (!shippingMethod?.amount) setShippingCupons([]);
  }, [cartData, storeData, selected]);
  useEffect(() => {
    if (orderCoupons.length > 0)
      setOrderCupons(
        orderCoupons.filter((f) =>
          coupons.some((coupon: CouponData) => coupon.id === f)
        )
      );
    if (shippingCoupons.length > 0)
      setShippingCupons(
        shippingCoupons.filter((f) =>
          coupons.some((coupon: CouponData) => coupon.id === f)
        )
      );
    if (itemCoupons.length > 0)
      setItemCupons(
        itemCoupons.map((item) => {
          item.coupons = item.coupons.filter((f) =>
            coupons.some((coupon: CouponData) => coupon.id === f)
          );
          return item;
        })
      );
  }, [coupons]);
  useEffect(() => {
    if (itemCoupons.length > 0)
      setItemCupons(
        itemCoupons.filter((f) =>
          cartData?.items.some((item) => item.id === f.item_id)
        )
      );
  }, [cartData?.items]);
  useEffect(() => {
    const total = getProductSum();
    setOrderCupons(
      coupons
        .filter(
          (f: CouponData) =>
            orderCoupons.includes(f.id) && total >= (f.min || 0)
        )
        .map((f: CouponData) => f.id)
    );
    setShippingCupons(
      coupons
        .filter(
          (f: CouponData) =>
            shippingCoupons.includes(f.id) && total >= (f.min || 0)
        )
        .map((f: CouponData) => f.id)
    );
    setItemCupons(
      itemCoupons
        .map((item) => {
          item.coupons = coupons
            .filter(
              (f: CouponData) =>
                item.coupons.includes(f.id) && total >= (f.min || 0)
            )
            .map((f: CouponData) => f.id);
          return item;
        })
        .filter((f) => f.coupons.length)
    );
  }, [selected, cartData?.items]);

  // [수정된 useEffect] 매장 목록과 즐겨찾기 목록 동시 로드
  useEffect(() => {
    const init = async () => {
      // 1. 매장 목록과 즐겨찾기 목록 병렬 호출
      const [resStores, resFav] = await Promise.all([
        requester.getOfflineStores({ pageSize: 12 }),
        requester.getStoreWishlist({
          pageSize: 100,
          relations: ["offline_store"],
        }),
      ]);

      // 2. 그 외 매장 세팅
      const list = Array.isArray(resStores)
        ? resStores
        : resStores?.content ?? [];
      setOtherStores(list);

      // 3. 즐겨찾기 목록 세팅 (삭제 기능 작동 보장)
      const favList = Array.isArray(resFav) ? resFav : resFav?.content ?? [];
      setFavoriteStores(favList);

      // 4. 초기 선택값 세팅
      if (list.length > 0) {
        const store = list[0];
        setBaseCenter({ lat: Number(store.lat), lng: Number(store.lng) });
        setFulfillment((prev) => ({
          ...prev,
          selectedStore: store,
        }));
        setSelectOffilineStore(store.id); // 라디오 버튼 싱크 맞추기
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (fulfillment.method === "pickup") {
      pickupTabClick(fulfillment.pickup);
    }
  }, [isLoaded, fulfillment.method]);
  // 쿠폰 모달
  const openCouponModal = (
    coupons: CouponData[],
    max: number,
    selected: string[],
    onConfirm = (data: string[]) => console.log(data),
    used?: string[]
  ) => {
    if (max > 0)
      NiceModal.show("orderCouponListModal", {
        coupons,
        onConfirm,
        selected,
        max,
        used,
        price: getProductSum(),
      });

    // copType, 모달 여는 경로가 상품, 주문, 배송 쿠폰인지 구분한 값
  };

  // 결제창 취소했을때 hidden 막는 용도
  if (
    typeof window !== "undefined" &&
    typeof MutationObserver !== "undefined"
  ) {
    const observer = new MutationObserver(() => {
      const html = document.documentElement;
      const body = document.body;

      if (html.style.overflow === "hidden") {
        html.style.overflow = "";
      }
      if (body.style.overflow === "hidden") {
        body.style.overflow = "";
      }
    });

    // body style 바뀌는 거 계속 감시
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  const [ShowLoadingComp, setShowLoadingComp] = useState(false);

  return (
    <HorizontalFlex className={styles.cart_wrap}>
      <VerticalFlex className={styles.cart_data}>
        <CheckboxGroup
          name="carts"
          initialValues={selected}
          values={selected}
          onChange={setSelected}
        >
          <VerticalFlex className={styles.product_wrapper}>
            <article>
              <P className={styles.list_title}>담은 상품</P>
              <FlexChild alignItems="center" gap={10} paddingBottom={30}>
                <CheckboxAll />
                <Span size={17} weight={600}>전체선택</Span>
              </FlexChild>
            </article>
            <VerticalFlex className={styles.item_list}>
              {
                // 담은 상품 목록
                cartData?.items
                  .sort((i1, i2) =>
                    String(`${i1.created_at} ${i1.id}`).localeCompare(
                      String(`${i2.created_at} ${i2.id}`)
                    )
                  )
                  ?.map((item: LineItemData) => (
                    <Item
                      item={item}
                      key={item.id}
                      openCouponModal={openCouponModal}
                      selected={
                        itemCoupons.find((f) => f.item_id === item.id)
                          ?.coupons || []
                      }
                      coupons={coupons.filter((f: CouponData) => {
                        if (f.type === "item") {
                          if (
                            f.products?.length === 0 &&
                            f.categories?.length === 0
                          ) {
                            return true;
                          } else {
                            if (f.products?.length) {
                              return f.products.some(
                                (p) => p.id === item.variant.product_id
                              );
                            }
                            if (f.categories?.length) {
                              return f.categories.some((ct) =>
                                item.variant.product.categories.some(
                                  (pct) =>
                                    ct.id === pct.id ||
                                    ct.id === pct?.parent_id ||
                                    ct.id === pct?.parent?.parent_id
                                )
                              );
                            }
                          }
                        }
                        return false;
                      })}
                      used={itemCoupons
                        .filter((f) => f.item_id !== item.id)
                        .map((item) => item.coupons)
                        .flat()}
                      onConfirm={(data) =>
                        setItemCupons(
                          _.uniqBy(
                            [
                              { item_id: item.id, coupons: data },
                              ...itemCoupons,
                            ],
                            (item) => item.item_id
                          )
                        )
                      }
                    />
                  ))
              }
            </VerticalFlex>
            {cartData?.items?.length ? null : <NoContent type={"장바구니"} />}
          </VerticalFlex>
        </CheckboxGroup>

        <FlexChild
          hidden={!storeData?.metadata?.shipping && !storeData?.metadata?.order}
        >
          <VerticalFlex alignItems="start">
            <article>
              <P className={styles.list_title}>배송 방법</P>
            </article>

            <VerticalFlex>
              <HorizontalFlex
                className={clsx(styles.info_item)}
                hidden={!storeData?.metadata?.order}
              >
                <FlexChild
                  border={fulfillment.method === "delivery" ? "1px solid var(--main-color1)" : "1px solid #ccc"}
                  borderRadius={6}
                  padding={20}
                  justifyContent={"center"}
                  cursor={"pointer"}
                  className={styles.fulfillment_btn}
                  onClick={() =>
                    setFulfillment((prev) => ({
                      ...prev,
                      method: "delivery",
                    }))
                  }
                >
                  <P color={fulfillment.method === "delivery" ? "var(--main-color1)" : "#666"} size={18} weight={500}>
                    배송
                  </P>
                </FlexChild>
                <FlexChild
                  border={fulfillment.method === "pickup" ? "1px solid var(--main-color1)" : "1px solid #ccc"}
                  borderRadius={6}
                  padding={20}
                  justifyContent={"center"}
                  cursor={"pointer"}
                  className={styles.fulfillment_btn}
                  onClick={() =>
                    setFulfillment((prev) => ({
                      ...prev,
                      method: "pickup",
                      pickup: "recent",
                    }))
                  }
                >
                  <P color={fulfillment.method === "pickup" ? "var(--main-color1)" : "#666"} size={18} weight={500}>
                    매장 픽업
                  </P>
                </FlexChild>
              </HorizontalFlex>

              <HorizontalFlex
                className={clsx(styles.info_item)}
                hidden={
                  !storeData?.metadata?.shipping || shipping?.amount === 0
                }
              ></HorizontalFlex>
            </VerticalFlex>
          </VerticalFlex>
        </FlexChild>

        <FlexChild
          className={styles.coupon_info}
          hidden={!storeData?.metadata?.shipping && !storeData?.metadata?.order}
        >
          <VerticalFlex alignItems="start">
            <article>
              <P className={styles.list_title}>장바구니 쿠폰</P>
              <P className={styles.list_txt}>
                상품 외 주문서 전체 적용 쿠폰입니다.
              </P>
            </article>

            <Div className={styles.info_list}>
              <VerticalFlex gap={10}>
                <HorizontalFlex
                  className={clsx(styles.info_item)}
                  alignItems={"flex-start"}
                  hidden={!storeData?.metadata?.order}
                >
                  <Span paddingTop={13} width={80}>주문 할인</Span>
  
                  <CouponSelect
                    openCouponModal={openCouponModal}
                    onConfirm={(data) => setOrderCupons(data)}
                    selected={orderCoupons}
                    max={Number(storeData?.metadata?.order || 0)}
                    coupons={coupons.filter(
                      (f: CouponData) => f.type === "order"
                    )}
                  />
                </HorizontalFlex>
  
                <HorizontalFlex
                  className={clsx(styles.info_item)}
                  alignItems={"flex-start"}
                  hidden={
                    !storeData?.metadata?.shipping || shipping?.amount === 0
                  }
                >
                  <Span paddingTop={13} width={80}>배송 할인</Span>
  
                  <CouponSelect
                    openCouponModal={openCouponModal}
                    onConfirm={(data) => setShippingCupons(data)}
                    selected={shippingCoupons}
                    max={Number(storeData?.metadata?.shipping || 0)}
                    coupons={coupons.filter(
                      (f: CouponData) => f.type === "shipping"
                    )}
                  />
                </HorizontalFlex>
              </VerticalFlex>
            </Div>
          </VerticalFlex>
        </FlexChild>
        {fulfillment.method === "delivery" && (
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
                  <VerticalFlex className={styles.info_item}>
                    <Span color={"#999"}>이름</Span>
                    <P>{address.name}</P>
                  </VerticalFlex>

                  <VerticalFlex className={styles.info_item}>
                    <Span color={"#999"}>배송주소</Span>
                    <P>
                      ({address.postal_code}) {address.address1}{" "}
                      {address.address2}
                    </P>
                  </VerticalFlex>

                  <VerticalFlex className={styles.info_item}>
                    <Span color={"#999"}>연락처</Span>
                    <P>{address.phone}</P>
                  </VerticalFlex>

                  <VerticalFlex
                    className={clsx(styles.info_item, styles.info_select_box)}
                  >
                    <Span color={"#999"}>배송 요청사항 선택</Span>

                    <SelectBox setMessage={setMessage} />
                  </VerticalFlex>
                </VerticalFlex>
              ) : (
                // 배송지 없을 때
                <NoContent type="배송지"></NoContent>
              )}
            </VerticalFlex>
          </FlexChild>
        )}
        {fulfillment.method === "pickup" && isLoaded && center && (
          <FlexChild>
            <VerticalFlex alignItems="start">
              <FlexChild>
                <P className={styles.list_title}>픽업 매장 선택</P>
              </FlexChild>
              <FlexChild borderRadius={8} overflow={"hidden"}>
                {isLoaded && center && (
                  <GoogleMap
                    zoom={12}
                    center={center}
                    mapContainerStyle={{
                      width: "100vw",
                      height: "100vh",
                      maxHeight: "20vh",
                    }}
                    options={{
                      disableDefaultUI: true,
                      streetViewControl: false,
                      zoomControl: true,
                      gestureHandling: "greedy",
                      scrollwheel: true,
                    }}
                  >
                    {otherStores.map((store) => {
                      return (
                        <OverlayView
                          key={store.id}
                          position={{
                            lat: Number(store.lat),
                            lng: Number(store.lng),
                          }}
                          getPixelPositionOffset={(
                            width: number,
                            height: number
                          ) => ({
                            x: -(width / 2),
                            y: -height,
                          })}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                          <Div
                            className={clsx(
                              styles.markerBubble,
                              fulfillment.selectedStore?.id === store.id &&
                                styles.markerBubbleActive
                            )}
                          >
                            <P size={13} className={styles.title}>
                              {store.name}
                            </P>
                            <Div className={styles.tail} />
                          </Div>
                        </OverlayView>
                      );
                    })}
                  </GoogleMap>
                )}
              </FlexChild>
              <FlexChild padding={"20px 0 10px"}>
                <HorizontalFlex>
                  <FlexChild
                    justifyContent="center"
                    border="1px solid #d2d2d2"
                    borderRadius={"8px 0 0 8px"}
                    padding={16}
                    backgroundColor={fulfillment.pickup === "recent" ? "#fafafa" : "#fff"}
                    cursor="pointer"
                    onClick={() => pickupTabClick("recent")}
                  >
                    <P
                      size={17}
                      weight={600}
                      color={fulfillment.pickup === "recent" ? "var(--main-color1)" : "#222"}
                    >
                      최근 이용매장
                    </P>
                  </FlexChild>
                  <FlexChild
                    justifyContent="center"
                    borderTop="1px solid #d2d2d2"
                    borderBottom="1px solid #d2d2d2"
                    backgroundColor={fulfillment.pickup === "favorite" ? "#fafafa" : "#fff"}
                    padding={16}
                    cursor="pointer"
                    onClick={() => pickupTabClick("favorite")}
                  >
                    <P
                      size={17}
                      weight={600}
                      color={
                        fulfillment.pickup === "favorite" ? "var(--main-color1)" : "#222"
                      }
                    >
                      즐겨찾기
                    </P>
                  </FlexChild>
                  <FlexChild
                    justifyContent="center"
                    border="1px solid #d2d2d2"
                    borderRadius={"0 8px 8px 0"}
                    backgroundColor={fulfillment.pickup === "others" ? "#fafafa" : "#fff"}
                    padding={16}
                    cursor="pointer"
                    onClick={() => pickupTabClick("others")}
                  >
                    <P
                      size={17}
                      weight={600}
                      color={fulfillment.pickup === "others" ? "var(--main-color1)" : "#222"}
                    >
                      그 외 매장
                    </P>
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
              <FlexChild padding={"0 0 10px"}>
                <Input 
                  width={"100%"}
                  placeHolder={"매장명 / 주소를 입력해 주세요."}
                  style={{ borderRadius: "8px", height: "44px" }} />
              </FlexChild>
              {fulfillment.method === "pickup" && (
                <FlexChild>
                  {fulfillment.pickup === "recent" && (
                    <>
                      {recentStores.length === 0 && (
                        <Div padding={"22px 0 2px"}>
                          <P textAlign={"center"} color={"#a6a6a6"}>최근 이용매장이 없습니다.</P>
                        </Div>
                      )}

                      <HorizontalFlex gap={8} justifyContent={"flex-start"}>
                        {recentStores.map((store) => (
                          <FlexChild
                            key={store.id}
                            width={"fit-content"} 
                            border={"1px solid #ccc"} 
                            borderRadius={6}
                            padding={"11px 12px"}
                            cursor={"pointer"}
                          >
                            <P color={"#666"}>{store.offline_store?.name}</P>
                          </FlexChild>
                         
                        ))}
                      </HorizontalFlex>
                    </>
                  )}

                  {fulfillment.pickup === "favorite" && (
                    <>
                      {favoriteStores.length === 0 && (
                        <Div padding={"22px 0 2px"}>
                          <P textAlign={"center"} color={"#a6a6a6"}>즐겨찾기 매장이 없습니다.</P>
                        </Div>
                      )}
                      <HorizontalFlex>
                        {favoriteStores.map((item) => {
                          const storeName = item.offline_store?.name ?? "";

                          return (
                            <FlexChild
                              key={item.id}
                              width={"fit-content"}
                              border={"1px solid #ccc"} 
                              borderRadius={6}
                              padding={"11px 12px"}
                              cursor={"pointer"}
                            >
                              <P color={"#666"}>{storeName}</P>
                            </FlexChild>
                           
                          );
                        })}
                      </HorizontalFlex>







                    </>
                  )}

                  {fulfillment.pickup === "others" && (
                    <>
                      {otherStores.length === 0 && (
                        <Div padding={"22px 0 2px"}>
                          <P textAlign={"center"} color={"#a6a6a6"}>등록된 매장이 없습니다.</P>
                        </Div>
                      )}

                      <RadioGroup
                        name="pickup_store"
                        value={selectOffilineStore ?? undefined}
                        onValueChange={(val: string) => {
                          setSelectOffilineStore(val);
                          const store = otherStores.find((s) => s.id === val);
                          if (store) {
                            setFulfillment((prev) => ({
                              ...prev,
                              selectedStore: store,
                            }));
                          }
                        }}
                      >
                        <VerticalFlex gap={16} paddingTop={15}>
                          {otherStores.map((store) => {
                            const inWishlist = store.is_favorite === true;

                            return (
                              <FlexChild
                                key={store.id}
                                className={styles.store_card}
                                onClick={() => {
                                  document
                                    .getElementById(`store_${store.id}`)
                                    ?.click();
                                  setFulfillment((prev) => ({
                                    ...prev,
                                    selectedStore: store,
                                  }));
                                  setSelectOffilineStore(store.id);
                                }}
                              >
                                <HorizontalFlex gap={10}>
                                  <FlexChild width={"fit-content"}>
                                    <FlexChild width="auto">
                                      <RadioChild id={store.id} />
                                    </FlexChild>
                                  </FlexChild>
                                  <FlexChild>
                                    <Span size={16} color={"#666"}>{store.name}
                                    </Span>
                                  </FlexChild>
                                  <FlexChild width={"fit-content"} justifyContent="flex-end">
                                    <Image
                                      src={
                                        inWishlist
                                          ? "/resources/icons/starIcon.svg"
                                          : "/resources/icons/emptyStarIcon.svg"
                                      }
                                      width={20}
                                      style={{ cursor: "pointer" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (inWishlist) {
                                          deleteWishlist(store);
                                        } else {
                                          createWishlist(store);
                                        }
                                      }}
                                    />
                                  </FlexChild>
                                </HorizontalFlex>
                              </FlexChild>
                            );
                          })}
                        </VerticalFlex>
                      </RadioGroup>
                    </>
                  )}
                </FlexChild>
              )}
            </VerticalFlex>
          </FlexChild>
        )}
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
                <FlexChild
                  className={clsx(styles.payment_card)}
                  border={payment === "credit_card" ? "1px solid var(--main-color1)" : "1px solid #ccc"}
                  onClick={() =>
                    document.getElementById("credit_card")?.click()
                  }
                >
                  <FlexChild width={"auto"}>
                    <RadioChild id={"credit_card"} />
                  </FlexChild>
                  <Span 
                    color={payment === "credit_card" ? "var(--main-color1)" : "#666"}
                    weight={payment === "credit_card" ? 600 : 400}
                  >신용카드 결제</Span>
                </FlexChild>
                <FlexChild
                  className={clsx(styles.payment_card)}
                  border={payment === "direct_bank" ? "1px solid var(--main-color1)" : "1px solid #ccc"}
                  onClick={() =>
                    document.getElementById("direct_bank")?.click()
                  }
                >
                  <FlexChild width={"auto"}>
                    <RadioChild id={"direct_bank"} />
                  </FlexChild>
                  <Span 
                    color={payment === "direct_bank" ? "var(--main-color1)" : "#666"}
                    weight={payment === "direct_bank" ? 600 : 400}
                  >무통장 입금</Span>
                </FlexChild>
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

              <P fontSize={14} color="#797979" lineHeight={1.3}>
                상품 금액(세일 할인가 포함){" "}
                {(shipping?.max || 0).toLocaleString()}원 이상 구매 시 배송비
                무료
              </P>
            </article>

            <VerticalFlex className={styles.info_list}>
              <VerticalFlex gap={10}>
                <HorizontalFlex className={styles.info_item}>
                  <Span>원가</Span>
                </HorizontalFlex>

                <FlexChild gap={10} paddingLeft={20}>
                  <Image
                    src={"/resources/icons/cart/cart_reply_icon.png"}
                    width={15}
                  />

                  <HorizontalFlex className={styles.info_item}>
                    <Span>상품 금액</Span>

                    <P>
                      {/* <Span>{getProductSum()}</Span> */}
                      <Span>{ProductPriceSum()}</Span>
                      <Span> 원</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>

                <FlexChild gap={10} paddingLeft={20}>
                  <Image
                    src={"/resources/icons/cart/cart_reply_icon.png"}
                    width={15}
                  />

                  <HorizontalFlex className={styles.info_item}>
                    <Span>배송비</Span>

                    <P>
                      <Span>{!selected?.length ? 0 : getShippingAmount()}</Span>
                      <Span> 원</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>
              </VerticalFlex>

              <VerticalFlex className={clsx(styles.point_box)}>
                <HorizontalFlex className={styles.info_item}>
                  <Span>포인트 사용</Span>

                  {/* <P className={styles.my_point}>
                    <Span>{userData?.point || 0}</Span>
                    <Span> P</Span>
                  </P> */}
                  <FlexChild width={"auto"} gap={10}>
                    <Span color="#797979" fontSize={14}>
                      내 포인트
                    </Span>
                    <FlexChild width={"auto"} gap={3}>
                      <FlexChild width={"auto"} gap={2}>
                        <Span size={14}>{(userData?.point || 0) - point}</Span>
                        <Span size={14}>P</Span>
                      </FlexChild>
                      <Span size={14}>/</Span>
                      <FlexChild width={"auto"} color="#797979" gap={2}>
                        <Span size={14}>{userData?.point || 0}</Span>
                        <Span size={14}> P</Span>
                      </FlexChild>
                    </FlexChild>
                  </FlexChild>
                </HorizontalFlex>

                <HorizontalFlex
                  className={clsx(styles.info_item, styles.point_input_box)}
                >
                  <FlexChild width={"48%"}>
                    <InputNumber
                      style={{
                        width: "100%"
                      }}
                      width={180}
                      hideArrow
                      value={point}
                      onChange={(value) => setPoint(value as number)}
                      max={Math.min(userData?.point || 0, getSum())}
                      // min={87852}
                      min={0}
                    />
                  </FlexChild>
                  <FlexChild width={"fit-content"}>
                    <Button
                      className={styles.cancel_btn}
                      onClick={() => setPoint(0)}
                    >
                      사용 취소
                    </Button>
                  </FlexChild>
                </HorizontalFlex>
              </VerticalFlex>

              <VerticalFlex gap={10}>
                <HorizontalFlex className={styles.info_item}>
                  <Span>할인가</Span>

                  <P>
                    <Span>{-saleTotals.total - (point || 0)}</Span>
                    <Span> 원</Span>
                  </P>
                </HorizontalFlex>

                <FlexChild
                  gap={10}
                  paddingLeft={20}
                  hidden={saleTotals.promotions === 0}
                >
                  <Image
                    src={"/resources/icons/cart/cart_reply_icon.png"}
                    width={15}
                  />

                  <HorizontalFlex
                    className={clsx(styles.info_item, styles.info_unit)}
                  >
                    <Span>(프로모션 할인가)</Span>

                    <P>
                      <Span>+ </Span>
                      <Span>{saleTotals.promotions}</Span>
                      <Span> 원</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>

                <FlexChild gap={10} paddingLeft={20} hidden={point === 0}>
                  <Image
                    src={"/resources/icons/cart/cart_reply_icon.png"}
                    width={15}
                  />

                  <HorizontalFlex
                    className={clsx(styles.info_item, styles.info_unit)}
                  >
                    <Span>(포인트 사용)</Span>

                    <P>
                      <Span>+ </Span>
                      <Span>{point || 0}</Span>
                      <Span> 원</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>

                <FlexChild
                  gap={10}
                  paddingLeft={20}
                  hidden={saleTotals.productCoupons === 0}
                >
                  <Image
                    src={"/resources/icons/cart/cart_reply_icon.png"}
                    width={15}
                  />

                  <HorizontalFlex
                    className={clsx(styles.info_item, styles.info_unit)}
                  >
                    <Span>(상품 쿠폰 할인가)</Span>

                    <P>
                      <Span>+ </Span>
                      <Span>{saleTotals.productCoupons}</Span>
                      <Span> 원</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>

                <FlexChild
                  gap={10}
                  paddingLeft={20}
                  hidden={saleTotals.orders === 0}
                >
                  <Image
                    src={"/resources/icons/cart/cart_reply_icon.png"}
                    width={15}
                  />

                  <HorizontalFlex
                    className={clsx(styles.info_item, styles.info_unit)}
                  >
                    <Span>(주문 쿠폰 할인가)</Span>

                    <P>
                      <Span>+ </Span>
                      <Span>{saleTotals.orders}</Span>
                      <Span> 원</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild
                  gap={10}
                  paddingLeft={20}
                  hidden={saleTotals.subscribes === 0}
                >
                  <Image
                    src={"/resources/icons/cart/cart_reply_icon.png"}
                    width={15}
                  />

                  <HorizontalFlex
                    className={clsx(styles.info_item, styles.info_unit)}
                  >
                    <Span>(구독 할인가)</Span>

                    <P>
                      <Span>+ </Span>
                      <Span>{saleTotals.subscribes}</Span>
                      <Span> 원</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>
                <FlexChild
                  gap={10}
                  paddingLeft={20}
                  hidden={saleTotals.delivery_fee === 0}
                >
                  <Image
                    src={"/resources/icons/cart/cart_reply_icon.png"}
                    width={15}
                  />

                  <HorizontalFlex
                    className={clsx(styles.info_item, styles.info_unit)}
                  >
                    <Span>(배송비 할인가)</Span>

                    <P>
                      <Span>+ </Span>
                      <Span>{saleTotals.delivery_fee}</Span>
                      <Span> 원</Span>
                    </P>
                  </HorizontalFlex>
                </FlexChild>
              </VerticalFlex>

              <HorizontalFlex className={styles.info_item}>
                <Span>합계</Span>

                <P>
                  <Span>{getTotal()}</Span>
                  <Span> 원</Span>
                </P>
              </HorizontalFlex>
            </VerticalFlex>
          </VerticalFlex>

          <FlexChild className={styles.total_pay_txt}>
            <Span>총 결제 금액</Span>
            <P color={"var(--main-color1)"}>
              <Span>{getTotal()}</Span>
              <Span>원</Span>
            </P>
          </FlexChild>

          <FlexChild marginTop={30}>
            {/* 결제 정보 전부 체크되기 전에는 disabled class 처리하고 경고문 띄우기  */}
            <Button
              isLoading={isLoading}
              disabled={agrees.length < 2 || !payment || selected?.length === 0}
              className={styles.payment_btn}
              onClick={async () => {
                if (
                  fulfillment.method === "pickup" &&
                  !fulfillment.selectedStore
                ) {
                  return toast({ message: "픽업할 매장을 선택해주세요." });
                }

                // [신규] 픽업 주문 시 재고 확인 (O2O 통신)
                if (fulfillment.method === "pickup") {
                  setIsLoading(true);
                  try {
                    const checkItems = cartData?.items
                      .filter((item) => selected.includes(item.id))
                      .map((item) => ({
                        variant_id: item.variant_id,
                        quantity:
                          (item.quantity || 0) + (item.extra_quantity || 0),
                      }));

                    if (checkItems && checkItems.length > 0) {
                      const checkResult = await requester.checkStock({
                        cart_id: cartData?.id,
                        offline_store_id: fulfillment.selectedStore!.id,
                        items: checkItems,
                      });

                      if (!checkResult.buyable) {
                        setIsLoading(false);
                        return toast({
                          message:
                            checkResult.error?.message ||
                            "매장 재고가 부족하여 주문할 수 없습니다.",
                        });
                      }
                    }
                  } catch (e: any) {
                    setIsLoading(false);
                    return toast({
                      message:
                        e?.message ||
                        "매장 정보를 확인하는 중 오류가 발생했습니다.",
                    });
                  }
                }

                if (point > 0) {
                  if (fulfillment.method !== "pickup") setIsLoading(true);
                  const { user } = await requester.getCurrentUser();
                  if (user.point < point) {
                    reload();
                    setIsLoading(false);
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
                  offline_store_id:
                    fulfillment.method === "pickup"
                      ? fulfillment.selectedStore?.id
                      : null, //undefined
                  cart_id: cartData?.id,
                  point,
                  coupons: {
                    orders: orderCoupons,
                    shippings: shippingCoupons,
                    items: itemCoupons,
                  },
                  subscribe_id: userData?.subscribe?.id,
                };
                if (getTotal() === 0) {
                  if (!isLoading) setIsLoading(true);
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
                      reload();
                      setShowLoadingComp(true);
                      navigate("/orders/complete", {
                        type: "replace",
                      });
                    }
                  );
                } else
                  switch (payment) {
                    // case "toss": {
                    //    sessionStorage.setItem(
                    //      Sessions.PAYMENT,
                    //      JSON.stringify(data)
                    //    );
                    //    navigate(`/orders/cart/toss`);
                    //    break;
                    // }
                    case "direct_bank": {
                      requester.createOrder(
                        { ...data, payment: getBankData() },
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
                          reload();
                          setShowLoadingComp(true);
                          navigate("/orders/complete", {
                            type: "replace",
                          });
                        }
                      );
                      break;
                    }
                    case "credit_card": {
                      const trackId = data.cart_id + "_" + new Date().getTime();
                      const items = cartData?.items?.filter((f) =>
                        selected.includes(f.id)
                      );
                      const params = {
                        paytype: "nestpay",
                        trackId: trackId,
                        payMethod: "card",
                        amount: getTotal(),
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
                                          reload();
                                          setShowLoadingComp(true);
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
                                  } catch (error) {
                                  } finally {
                                    document.body.style.overflow = "";
                                    document.documentElement.style.overflow =
                                      "";
                                  }
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
                                        reload();
                                        setShowLoadingComp(true);
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
                                } catch (error) {
                                } finally {
                                  document.body.style.overflow = "";
                                  document.documentElement.style.overflow = "";
                                }
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

      {ShowLoadingComp && <LoadingPageChange />}
    </HorizontalFlex>
  );
}

function Item({
  item,
  coupons,
  openCouponModal,
  selected,
  onConfirm,
  used,
}: {
  item: LineItemData;
  openCouponModal: (
    coupons: CouponData[],
    max: number,
    selected: string[],
    onConfirm: (data: string[]) => void,
    used?: string[]
  ) => void;
  coupons: CouponData[];
  selected: string[];
  used: string[];
  onConfirm: (data: string[]) => void;
}) {
  const { storeData } = useStore();
  const { cartData, reload } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item]);
  const getPrice = () => {
    const amount = Number(item.variant.discount_price * quantity);
    if (selected.length > 0) {
      const products = coupons.filter((f) => selected.includes(f.id));
      const percents = products.reduce((acc, now) => {
        if (now.calc === "percent") return acc + now.value;
        return acc;
      }, 0);
      const fix = products.reduce((acc, now) => {
        if (now.calc === "fix") return acc + now.value;
        return acc;
      }, 0);
      return Math.max(0, Math.round((amount * (100 - percents)) / 100.0 - fix));
    }
    return amount;
  };

  const navigate = useNavigate();

  return (
    <VerticalFlex className={styles.cart_item} gap={10} padding={"0 0 20px"}>
      <HorizontalFlex justifyContent="start" position="relative">
        <FlexChild width={"auto"} marginRight={15} alignSelf="start">
          <CheckboxChild className={styles.checkbox} id={item.id} />
        </FlexChild>

        <FlexChild className={styles.unit}>
          <FlexChild
            className={styles.item_thumb}
            onClick={() => navigate(`/products/${item.variant.product_id}`)}
          >
            <Image
              src={
                item?.variant?.thumbnail || item?.variant?.product?.thumbnail
              }
              width={142}
            />
          </FlexChild>
          <VerticalFlex className={styles.unit_content} alignItems="start">
            <Span className={styles.unit_brand}>
              {item?.variant?.product?.brand?.name}
            </Span>
            <P
              className={styles.unit_title}
              lineClamp={2}
              overflow="hidden"
              display="--webkit-box"
              onClick={() => navigate(`/products/${item.variant.product_id}`)}
            >
              {item.variant.product.title}
            </P>
            {item.variant.title && (
              <FlexChild gap={5} marginTop={10}>
                <P
                  className={styles.unit_title}
                  lineClamp={2}
                  overflow="hidden"
                  display="--webkit-box"
                >
                  {item.variant.title}
                </P>
                {item.variant.extra_price !== 0 && (
                  <P color="#797979">
                    (+{(item.variant.extra_price || 0).toLocaleString()}원)
                  </P>
                )}
              </FlexChild>
            )}
            <VerticalFlex gap={10} alignItems="start" width={"auto"}>
              <VerticalFlex className={styles.unit_price} alignItems="start">
                {item?.variant?.discount_rate > 0 && ( // 원가랑 할인가 차이 없으면 표시 안하기
                  <P className={styles.normal_price}>
                    {Number(item?.variant?.price || 0).toLocaleString("ko")}{" "}
                    <Span>원</Span>
                  </P>
                )}
                <P>
                  {Number(item?.variant?.discount_price || 0).toLocaleString(
                    "ko"
                  )}{" "}
                  <Span>원</Span>
                </P>
              </VerticalFlex>
              <Button
                className={styles.coupon_btn}
                onClick={() =>
                  openCouponModal(
                    coupons,
                    Number(storeData?.metadata?.product || 0),
                    selected,
                    onConfirm,
                    used
                  )
                }
                hidden={!storeData?.metadata?.product}
              >
                {!selected.length ? "쿠폰 사용" : "쿠폰 변경"}
              </Button>
            </VerticalFlex>
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
            className={styles.delete_box_btn}
          >
            <Image src={"/resources/icons/closeBtn_black.png"} width={15} />
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
        <VerticalFlex
          className={styles.data}
          alignItems="end"
          gap={5}
          width={"auto"}
        >
          {/* 쿠폰가 적용되면 나타나기 */}
          <P color="#ccc" fontSize={15} hidden={!selected.length}>
            쿠폰 적용가
          </P>

          <Div>
            <P className={styles.total_txt}>{getPrice().toLocaleString("ko-KR")}</P>
            <P className={styles.total_txt}>원</P>
          </Div>
        </VerticalFlex>
      </HorizontalFlex>
    </VerticalFlex>
  );
}

export function CouponSelect({
  openCouponModal,
  coupons,
  max,
  selected,
  onConfirm,
}: {
  openCouponModal: (
    coupons: CouponData[],
    max: number,
    selected: string[],
    onConfirm?: (data: string[]) => void
  ) => void;
  coupons: CouponData[];
  max: number;
  selected: string[];
  onConfirm?: (data: string[]) => void;
}) {
  // const disabled = 1 > 2;

  const selectedCoupons = coupons.filter((f: CouponData) =>
    selected.includes(f.id)
  );

  return (
    <Button
      className={clsx(styles.coupon_select)}
      // disabled={disabled}
      onClick={() => openCouponModal(coupons, max, selected, onConfirm)}
    >
      {/* { [styles.disabled]: disabled } */}
      <HorizontalFlex className={styles.coupon_choice}>
        <FlexChild className={styles.coupon_title}>
          <VerticalFlex alignItems="start">
            {selectedCoupons.map((coupon, idx) => {
                return (
                  <FlexChild key={coupon.id} className={styles.coupon_item}>
                    <VerticalFlex>
                      <HorizontalFlex>
                        <P paddingLeft={4}>{coupon.name}</P>
                        <P paddingRight={4}>
                          {(-coupon.value).toLocaleString("ko")}
                          {coupon.calc === "fix" ? "원" : "%"}
                        </P>
                      </HorizontalFlex>
                      {selectedCoupons.length > 1 && idx !== selectedCoupons.length - 1 && (
                        <div style={{
                          // backgroundColor: "#e1e1e1",
                          borderTop: "1px dashed #e1e1e1",
                          width: "100%",
                          margin: "8px 0"
                        }} />
                      )}
                    </VerticalFlex>
                  </FlexChild>
                );
              })}
            {selected.length === 0 && <P paddingLeft={4}>쿠폰을 선택해 주세요.</P>}
          </VerticalFlex>
        </FlexChild>

        <FlexChild className={styles.arrow} width={"auto"}>
          <Image
            src={"/resources/icons/down_arrow.png"}
            width={10}
          />
        </FlexChild>
      </HorizontalFlex>
    </Button>
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
        width={"100%"}
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
              <Span weight={600}>전체 이용약관 동의</Span>
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
                <TermContent size={9} />
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
                <PrivacyContent size={9} />
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
