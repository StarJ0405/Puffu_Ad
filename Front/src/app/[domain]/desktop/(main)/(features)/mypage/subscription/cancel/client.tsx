"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import ConfirmModal from "@/modals/confirm/ConfirmModal";
import useNavigate from "@/shared/hooks/useNavigate";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import styles from "./page.module.css";
import { toast } from "@/shared/utils/Functions";

export function ContentBox({}: {}) {
  return (
    <VerticalFlex className={clsx(styles.box_layer)} gap={10}>
      <FlexChild className={styles.premium_layer}>
        <VerticalFlex className={styles.premium_box}>
          <VerticalFlex className={styles.item_content}>
            <VerticalFlex className={styles.cumulative}>
              <FlexChild justifyContent="center" className={styles.txt}>
                <P>지금까지 혜택 받은 금액</P>

                <Image
                  src={"/resources/icons/mypage/subscription_heart.png"}
                  width={20}
                  height={"auto"}
                />
              </FlexChild>

              <P className={styles.total}>300,000원</P>
            </VerticalFlex>

            <VerticalFlex className={styles.unit} alignItems="start">
              <FlexChild>
                <Image
                  src={"/resources/icons/arrow/checkBox_check.png"}
                  width={13}
                  height={"auto"}
                />
                <P>
                  전제품 <Span>10% 상시 할인</Span>
                </P>
              </FlexChild>

              <FlexChild>
                <Image
                  src={"/resources/icons/arrow/checkBox_check.png"}
                  width={13}
                  height={"auto"}
                />
                <P>
                  매월 프리 머니 <Span>10,000원</Span> 쿠폰 지급
                </P>
              </FlexChild>
            </VerticalFlex>
          </VerticalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}

export function ConfirmBtn({}: {}) {
  const navigate = useNavigate();

  const deleteAccountModal = () => {
    // 로그아웃

    NiceModal.show(ConfirmModal, {
      message: (
        <FlexChild justifyContent="center" marginBottom={30}>
          <P color="#fff" fontSize={20} weight={600}>
            구독 서비스를 해지하시겠습니까?
          </P>
        </FlexChild>
      ),
      title: '알림',
      classNames: {
        title: 'confirm_title',
      },
      backgroundColor: 'var(--confirmModal-bg)',
      confirmText: "해지하기",
      cancelText: "취소",
      withCloseButton: true,
      onConfirm: () => {
        toast({ message: "해지가 완료되었습니다." });
      },
    });
  };

  const deleteAccountHandler = () => {
   deleteAccountModal();
  };

  return (
    <VerticalFlex className={styles.confirm_box}>
      <FlexChild
        onClick={() => navigate("/mypage/subscription/manage")}
        className={styles.continue_btn}
      >
        <Button>회원권 계속 유지하기</Button>
      </FlexChild>

      {/* onClick={()=> ()} */}
      <FlexChild className={styles.delete_btn} onClick={deleteAccountModal}>
        <Button>회원권 해지하기</Button>
      </FlexChild>
    </VerticalFlex>
  );
}
