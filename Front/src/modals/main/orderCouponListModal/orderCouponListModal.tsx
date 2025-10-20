"use client";
import Button from "@/components/buttons/Button";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./orderCouponListModal.module.css";

const OrderCouponListModal = NiceModal.create(
  ({
    onConfirm,
    onCancel,
    height = "80dvh",
    coupons,
    selected: initSelect = [],
    max = 1,
    used = [],
    price = 0,
  }: {
    onConfirm: (data: any) => void;
    onCancel?: () => void;
    height?: React.CSSProperties["height"];
    coupons: CouponData[];
    selected: string[];
    max: number;
    used?: string[];
    price?: number;
  }) => {
    const modal = useModal();
    const { isMobile } = useBrowserEvent();
    const [selected, setSelected] = useState<string[]>([]);

    const couponSumbit = () => {
      onConfirm(selected);
      modal.remove();
    };
    useEffect(() => {
      initSelect.map((select) => document.getElementById(select)?.click());
    }, [initSelect]);

    return (
      <ModalBase
        withHeader
        headerStyle={{
          backgroundColor: "#221f22",
          borderBottom: "none",
          color: "#fff",
        }}
        borderRadius={!isMobile ? 10 : 0}
        closeBtnWhite
        width={"100%"}
        maxWidth={!isMobile ? 470 : "auto"}
        height={!isMobile ? height : "100dvh"}
        maxHeight={800}
        title={"쿠폰 목록"}
        onClose={() => {
          onCancel?.();
          modal.remove();
        }}
        backgroundColor={"#221f22"}
        clickOutsideToClose
      >
        <VerticalFlex
          className={clsx(styles.container, isMobile && styles.mob_container)}
        >
          <FlexChild className={styles.list_header} hidden={max <= 1}>
            <P>최대 {max}개 쿠폰 중복 적용 가능</P>
          </FlexChild>

          <CheckboxGroup
            name="coupons"
            initialValues={selected}
            onChange={setSelected}
            className={styles.list_wrap}
          >
            <VerticalFlex className={styles.item_list}>
              {coupons?.length > 0 ? (
                <>
                  {coupons?.map((coupon: CouponData) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                      selected={selected}
                      disabled={selected.length >= max}
                      used={used.includes(coupon.id)}
                      price={price}
                    />
                  ))}
                </>
              ) : (
                <NoContent type="쿠폰" />
              )}
            </VerticalFlex>
          </CheckboxGroup>

          <FlexChild className={styles.button_box}>
            <Button className={styles.submit_btn} onClick={couponSumbit}>
              쿠폰 적용
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

function CouponCard({
  coupon,
  selected,
  disabled,
  used = false,
  price = 0,
}: {
  coupon: CouponData;
  selected: string[];
  disabled: boolean;
  used?: boolean;
  price?: number;
}) {
  // const isExpired =
  //   new Date(coupon.ends_at || 0).getTime() < new Date().getTime();
  // const isUsed = coupon.used;

  const calcCheck = () => {
    if (coupon?.calc === "percent") {
      return `${coupon?.value}%`;
    } else if (coupon?.calc === "fix") {
      return `${(coupon?.value || 0).toLocaleString()}원`;
    }
  };

  const typeCheck = () => {
    if (coupon?.type === "order") {
      return "주문";
    } else if (coupon?.type === "item") {
      return "상품";
    } else if (coupon?.type === "shipping") {
      return "배송";
    }
  };

  const minCheck = () => {
    if (coupon?.min === 0) {
      return "최소 금액 제한 없음";
    } else {
      return `${(coupon?.min || 0).toLocaleString()}원부터 사용 가능`;
    }
  };

  const isSelected = selected.includes(coupon.id);

  const disabledCheck = price < (coupon?.min || 0) || ((used || disabled) && !isSelected);

  return (
    <FlexChild
      className={clsx(styles.item, {
        [styles.checked]: isSelected,
      })}
    >
      <label>
        <HorizontalFlex>
          <FlexChild className={styles.checkBox}>
            <CheckboxChild
              disabled={disabledCheck}
              id={coupon.id}
            />
          </FlexChild>

          <VerticalFlex className={styles.data_card} alignItems="flex-start">
            <P className={clsx(styles.name, {
                [styles.used]: used,
              })}
            >
              {coupon.name}
            </P>
            
            <P className={clsx('SacheonFont', styles.value)} color="#fff">
              {calcCheck()}
            </P>

            <VerticalFlex alignItems="start" className={styles.txt1} gap={3}>
              <P fontSize={14}>
                {minCheck()}
              </P>

              <P className={styles.date}>
                발급일 : {new Date(coupon?.appears_at || 0).toLocaleDateString()}
              </P>

              <P
                className={clsx(styles.date, {
                  [styles.used]: used,
                })}
              >
                {new Date(coupon?.starts_at || 0).toLocaleDateString()}~ 
                {new Date(coupon?.ends_at || 0).toLocaleDateString()}까지
              </P>
            </VerticalFlex>
          </VerticalFlex>

          <FlexChild className={styles.cutout_wrap} width={"auto"} height={'100%'}>
            <VerticalFlex gap={10}>
              <Image
                src={`/resources/icons/mypage/coupon_${coupon?.type}_icon.png`}
                width={30}
                alt="쿠폰 아이콘"
              />
              <P fontSize={12} color="#fff">{typeCheck()}</P>
            </VerticalFlex>
          </FlexChild>
        </HorizontalFlex>
        {
          disabledCheck && (
            <FlexChild className={clsx(styles.expired)}></FlexChild>
          )
        }
      </label>
    </FlexChild>
  );
}

export default OrderCouponListModal;
