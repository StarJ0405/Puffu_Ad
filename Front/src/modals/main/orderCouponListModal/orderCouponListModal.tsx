"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Div from "@/components/div/Div";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import StarRate from "@/components/star/StarRate";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import { toast, maskTwoThirds } from "@/shared/utils/Functions";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useRef, useEffect, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./orderCouponListModal.module.css";
import RecommendButton from "@/components/buttons/RecommendButton";
import usePageData from "@/shared/hooks/data/usePageData";
import { requester } from "@/shared/Requester";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import NoContent from "@/components/noContent/noContent";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";


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
      }),
      (condition) => requester.getCoupons(condition),
      (data: Pageable) => data?.totalPages || 0,
      {
        // fallbackData: initCoupons,
        onReprocessing: (data) => data?.content || [],
      }
    );

    const couponsTest = [
      {
        id: '0',
        name: '멤버쉽 브론즈 4000원 할인 쿠폰',
        ends_at: '2025-11-20',
      },
      {
        id: '1',
        name: '생일 할인 쿠폰',
        ends_at: '2025-12-30',
      },
      {
        id: '2',
        name: '생일 할인 쿠폰',
        ends_at: '2025-12-30',
      },
      {
        id: '3',
        name: '생일 할인 쿠폰',
        ends_at: '2025-12-30',
      },
      {
        id: '4',
        name: '생일 할인 쿠폰',
        ends_at: '2025-12-30',
      },
      {
        id: '5',
        name: '생일 할인 쿠폰',
        ends_at: '2025-12-30',
      }
    ]

    const [selected, setSelected] = useState<string[]>([]);

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
        width={'100%'}
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
              {couponsTest?.length > 0 ? (
                <>
                  {couponsTest?.map((coupon: CouponData, i) => (
                    <CouponCard key={i} coupon={coupon} selected={selected} />
                  ))}
                </>
              ) : (
                <NoContent type="쿠폰" />
              )}
            </VerticalFlex>
          </CheckboxGroup>

          <FlexChild className={styles.button_box}>
            <Button className={styles.submit_btn}>
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
}

function CouponCard({ coupon, selected }: { coupon: CouponData, selected: string[], }) {
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
            <CheckboxChild id={coupon.id} />
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
              })}
            >
              {coupon.name}
            </P>
            <P
              className={clsx(styles.date, {
                // [styles.expired]: isExpired,
                // [styles.used]: isUsed,
              })}
            >
              사용기간 {new Date(coupon?.ends_at || 0).toLocaleDateString()} 까지
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
