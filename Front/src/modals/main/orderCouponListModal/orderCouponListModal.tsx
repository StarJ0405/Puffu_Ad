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
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useState } from "react";
import styles from "./orderCouponListModal.module.css";
import { toast } from "@/shared/utils/Functions";
import CouponItemMobile from "@/components/coupon/couponItemMobile";

const OrderCouponListModal = NiceModal.create(
  ({
    onConfirm,
    onCancel,
    // width = "80vw",
    height = "80dvh",
    // initCoupons,
    copType, // 모달 여는 경로가 상품, 주문, 배송 쿠폰인지 구분한 값
  }: {
    onConfirm?: () => void;
    onCancel?: () => void;
    // width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
    // initCoupons: Pageable;
    copType: String;
  }) => {
    const modal = useModal();
    const { isMobile } = useBrowserEvent();

    const { userData } = useAuth();
    const { coupons, page, maxPage, setPage } = usePageData(
      "coupons",
      (pageNumber) => ({
        pageNumber,
        pageSize: 12,
        type: copType,
        used: false,
      }),
      (condition) => requester.getCoupons(condition),
      (data: Pageable) => data?.totalPages || 0,
      {
        // fallbackData: initCoupons,
        onReprocessing: (data) => data?.content || [],
      }
    );
    
    const [selected, setSelected] = useState<string[]>([]);

    const couponSumbit = () => {
      if (selected.length === 0) {
        toast({ message: "적용할 쿠폰을 1개 이상 선택해 주세요." });
        return false;
      }
    };

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
          <FlexChild className={styles.list_header}>
            <P>일부 쿠폰 중복 적용 가능</P>
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
                    <CouponItemMobile key={coupon.id} coupon={coupon} selected={selected} />
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

export default OrderCouponListModal;
