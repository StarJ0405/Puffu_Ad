"use client";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import styles from './photoReviewModal.module.css'

type Props = {
  product: ProductData;
};

const ProductDetailModal = NiceModal.create(({ product }: Props) => {
  const modal = useModal();

  return (
    <ModalBase
      withHeader
      // title={product.name}
      withFooter
      buttonText="닫기"
      onClose={modal.remove}
    >
      <HorizontalFlex>
         11111
      </HorizontalFlex>
    </ModalBase>
  );
});

export default ProductDetailModal;
