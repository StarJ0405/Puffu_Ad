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
import styles from "./couponProductsModal.module.css";
import { toast } from "@/shared/utils/Functions";
import CouponItem from "@/components/coupon/couponItem";
import ProductCard from "@/components/card/ProductCard";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import useNavigate from "@/shared/hooks/useNavigate";
import Span from "@/components/span/Span";

const CouponProductsModal = NiceModal.create(
  ({
    products,
    categories,
    onConfirm,
    onCancel,
    // width = "80vw",
    height = "80dvh",
  }: {
    products: ProductData[];
    categories: CategoryData[];
    onConfirm?: () => void;
    onCancel?: () => void;
    // width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
  }) => {
    const modal = useModal();
    const { isMobile } = useBrowserEvent();
    const navigate = useNavigate();

    const itemPropsCheck = () => {
      if (products.length !== 0) {
        return "쿠폰 적용 상품";
      } else if (categories.length !== 0) {
        return "쿠폰 적용 카테고리";
      } else {
        return "쿠폰 적용";
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
        title={itemPropsCheck()}
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
          <FlexChild className={styles.title_header}>
            {products.length !== 0 && (
              <P>{(products.length || 0).toLocaleString()}개 상품</P>
            )}

            {categories.length !== 0 && (
              <P>적용되는 카테고리 내 모든 상품 대상입니다.</P>
            )}
          </FlexChild>

          <FlexChild className={styles.item_list} alignItems="start">
            {
              // 상품일 때
              products.length !== 0 && (
                <MasonryGrid
                  width={"100%"}
                  gap={15}
                  breakpoints={!isMobile ? 3 : 2}
                >
                  {products.map((product) => {
                    const procutLink = () => {
                      onCancel?.();
                      modal.remove();
                      navigate(`/products/${product.id}`);
                    };

                    return (
                      <ProductCard
                        onClick={procutLink}
                        lineClamp={1}
                        width={"auto"}
                        product={product}
                        key={product.id}
                      />
                    );
                  })}
                </MasonryGrid>
              )
            }

            {
              // 카테고리일 때
              categories.length !== 0 && (
                <FlexChild className={styles.ca_box}>
                  {categories.map((item) => {

                    const caLink = () => {
                      onCancel?.();
                      modal.remove();
                      navigate(`/categories/${item.id}`);
                    };

                    return (
                      <FlexChild
                        className={styles.ca_item}
                        key={item.id}
                        onClick={caLink}
                      >
                        <P>{item.name}</P>
                      </FlexChild>
                    );
                  })}
                </FlexChild>
              )
            }
          </FlexChild>
          <FlexChild className={styles.button_box}>
            <Button
              className={styles.submit_btn}
              onClick={() => {
                onCancel?.();
                modal.remove();
              }}
            >
              확인
            </Button>
          </FlexChild>
        </VerticalFlex>
      </ModalBase>
    );
  }
);

export default CouponProductsModal;
