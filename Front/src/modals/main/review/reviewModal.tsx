"use client";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import P from "@/components/P/P";
import ModalBase from "@/modals/ModalBase";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

type Props = {
  review?: ReviewData;
  edit?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  width: React.CSSProperties["width"];
  height: React.CSSProperties["height"];
};

const ReviewModal = NiceModal.create(
  ({ review, edit = false, width = "80vw", height = "auto" }: Props) => {
    const modal = useModal();
    const title = "리뷰 " + (edit ? (review?.id ? "수정" : "작성") : "상세");
    return (
      <ModalBase
        withHeader
        // title={product.name}
        width={width}
        height={height}
        title={title}
        // withFooter
        // buttonText="닫기"
        with
        onClose={modal.remove}
        withCloseButton={true}
        clickOutsideToClose={true}
      >
        <HorizontalFlex>
          <P>11111</P>
        </HorizontalFlex>
      </ModalBase>
    );
  }
);

export default ReviewModal;
