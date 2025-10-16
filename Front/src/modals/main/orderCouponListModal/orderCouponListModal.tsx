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
  }: {
    onConfirm: (data: any) => void;
    onCancel?: () => void;
    height?: React.CSSProperties["height"];
    coupons: CouponData[];
    selected: string[];
    max: number;
    used?: string[];
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

type CouponData = {
  id: string;
  name: string;
  ends_at: string;
};

function CouponCard({
  coupon,
  selected,
  disabled,
  used = false,
}: {
  coupon: CouponData;
  selected: string[];
  disabled: boolean;
  used?: boolean;
}) {
  // const isExpired =
  //   new Date(coupon.ends_at || 0).getTime() < new Date().getTime();
  // const isUsed = coupon.used;

  const isSelected = selected.includes(coupon.id);

  return (
    <FlexChild
      className={clsx(styles.item, {
        [styles.checked]: isSelected,
        // [styles.expired]: isExpired,
        // [styles.used]: isUsed,
      })}
    >
      <label>
        <HorizontalFlex>
          <FlexChild className={styles.checkBox}>
            <CheckboxChild
              disabled={(used || disabled) && !isSelected}
              id={coupon.id}
            />
          </FlexChild>
          <VerticalFlex
            gap={10}
            padding={"20px 0 20px 15px"}
            alignItems="flex-start"
          >
            <P
              className={clsx(styles.name, {
                // [styles.expired]: isExpired,
                // [styles.used]: isUsed,
                [styles.used]: used,
              })}
            >
              {coupon.name}
            </P>
            <P
              className={clsx(styles.date, {
                // [styles.expired]: isExpired,
                // [styles.used]: isUsed,
                [styles.used]: used,
              })}
            >
              사용기간 {new Date(coupon?.ends_at || 0).toLocaleDateString()}{" "}
              까지
            </P>
          </VerticalFlex>

          <FlexChild className={styles.cutout_wrap}>
            <Div className={styles.cutout_left} />
            <Div className={styles.cutout_right} />
            <Div className={styles.dashed_line} />
            <Div className={styles.spacer} />
          </FlexChild>

          <FlexChild className={styles.icon_wrap} width={"fit-content"}>
            <Image
              src="/resources/icons/mypage/coupon_pink_icon.png"
              width={30}
              alt="쿠폰 아이콘"
            />
          </FlexChild>
        </HorizontalFlex>
      </label>
    </FlexChild>
  );
}

export default OrderCouponListModal;
