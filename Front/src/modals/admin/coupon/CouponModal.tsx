import {
  getCouponDate,
  getCouponTarget,
  getCouponType,
} from "@/app/admin/desktop/(main)/product/coupon/management/table";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import NiceModal from "@ebay/nice-modal-react";
import { useEffect, useRef } from "react";
import ModalBase from "../../ModalBase";
import styles from "./CouponModal.module.css";

const getCategoryName = (category: CategoryData): string => {
  if (category.parent)
    return getCategoryName(category.parent) + " > " + category.name;
  return category.name;
};
const CouponModal = NiceModal.create(({ coupon }: { coupon: any }) => {
  const [withHeader, withFooter] = [true, false];
  const [width, height] = ["min(95%, 900px)", "auto"];
  const withCloseButton = true;
  const clickOutsideToClose = true;
  const title = "쿠폰 정보";
  const buttonText = "close";
  const modal = useRef<any>(null);

  useEffect(() => {
    if (!coupon) {
      modal.current.close();
    }
  }, [coupon]);

  return (
    <ModalBase
      borderRadius={10}
      zIndex={10055}
      ref={modal}
      width={width}
      height={height}
      withHeader={withHeader}
      withFooter={withFooter}
      withCloseButton={withCloseButton}
      clickOutsideToClose={clickOutsideToClose}
      title={title}
      buttonText={buttonText}
    >
      <VerticalFlex
        padding={"10px 20px"}
        maxHeight={"80vh"}
        overflow="scroll"
        overflowY="scroll"
        position="relative"
        hideScrollbar
      >
        <FlexChild>
          <P className={styles.title}>발급정보</P>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>스토어</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{coupon?.store?.name}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>쿠폰명</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{coupon.name}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>할인방식</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{coupon.calc === "fix" ? "고정값" : "퍼센트"}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.head}>
              <P>할인가</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>
                <Span>{coupon.value}</Span>
                <Span>{coupon.calc === "percent" ? "%" : "원"}</Span>
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>발급구분</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{getCouponTarget(coupon.target, coupon)}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild hidden={coupon.target !== "manual"}>
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>노출시점</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>
                {new Date().getTime() < new Date(coupon.appears_at).getTime()
                  ? `${new Date(coupon.appears_at).toLocaleString()}에 노출`
                  : "즉시 노출"}
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild
          hidden={
            !(coupon.target === "condition" && coupon.condition === "review")
          }
        >
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>리뷰작성 조건</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>
                리뷰 {coupon.review_min}개 이상 작성{" "}
                {coupon.review_photo ? "( 이미지 등록 필수 )" : ""}
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild
          hidden={
            !(
              coupon.target === "condition" &&
              (coupon.condition === "delivery" || coupon.condition === "order")
            )
          }
        >
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>발급 가능 결제 금액</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>
                {coupon.total_max
                  ? coupon.total_min
                    ? `${Number(coupon.total_min).toLocaleString(
                        "kr"
                      )} ~ ${Number(coupon.total_max).toLocaleString(
                        "kr"
                      )}원 사이 구매자`
                    : `최대 ${Number(coupon.total_max).toLocaleString(
                        "kr"
                      )}원이하 구매자`
                  : coupon.total_min
                  ? `최소 ${Number(coupon.total_min).toLocaleString(
                      "kr"
                    )}원이상 구매자`
                  : "제한 없음"}
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild
          hidden={
            !(coupon.target === "condition" && coupon.condition === "purchase")
          }
        >
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>수량 판단기준</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>
                {coupon.buy_type === "product"
                  ? "상품 수량 기준"
                  : coupon.buy_type === "order"
                  ? "주문 수량 기준"
                  : "알 수 없음"}
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild
          hidden={
            !(coupon.target === "condition" && coupon.condition === "purchase")
          }
        >
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>최소 구매 수량</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{coupon.buy_min}개</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild
          hidden={
            !(
              coupon.target === "condition" &&
              (coupon.condition === "delivery" ||
                coupon.condition === "order" ||
                coupon.condition === "first" ||
                coupon.condition === "purchase")
            )
          }
        >
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>주문기간 설정</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>
                {coupon.order_starts_at && coupon.order_ends_at
                  ? `${new Date(
                      coupon.order_starts_at
                    ).toLocaleString()} ~ ${new Date(
                      coupon.order_ends_at
                    ).toLocaleString()}`
                  : "제한 없음"}
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild
          hidden={
            !(
              coupon.target === "interval" ||
              coupon.target === "link" ||
              (coupon.target === "condition" &&
                (coupon.condition === "birthday" ||
                  coupon.condition === "date" ||
                  coupon.condition === "review" ||
                  coupon.condition === "delivery" ||
                  coupon.condition === "order" ||
                  coupon.condition === "purchase"))
            )
          }
        >
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>대상 회원등급</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{coupon.group?.name || "모든 회원"}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild
          hidden={
            !(
              coupon.target === "link" ||
              (coupon.target === "condition" &&
                (coupon.condition === "review" ||
                  coupon.condition === "delivery" ||
                  coupon.condition === "order" ||
                  coupon.condition === "purchase"))
            )
          }
        >
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>발급 수 제한</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>
                {coupon.max_quantity
                  ? `선착순 ${coupon.max_quantity}매`
                  : "제한 없음"}
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild
          hidden={
            !(
              coupon.target === "link" ||
              (coupon.target === "condition" &&
                (coupon.condition === "review" ||
                  coupon.condition === "delivery" ||
                  coupon.condition === "order" ||
                  coupon.condition === "purchase"))
            )
          }
        >
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>동일인 재발급 가능 여부</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>
                {coupon.duplicate
                  ? `추가수량 최대 ${coupon.duplicate}매`
                  : "불가능"}
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild
          hidden={
            !(coupon.target === "condition" && coupon.condition === "date")
          }
        >
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>발급시점</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>
                {coupon.issue_lunar ? "음력 " : "양력 "}
                {new Date(coupon.issue_date).toLocaleDateString()}
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>

        <FlexChild hidden={coupon.target !== "link"}>
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>링크</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{coupon.code}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild hidden={coupon.target !== "interval"}>
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>정규 발급 시점</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{coupon.interval}개월 단위로 1일 0시 0분에 쿠폰 자동 발급</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>상태</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{coupon.deleted_at ? "삭제(발급 불가)" : "발급 중"}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <P className={styles.title}>사용정보</P>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>사용기간</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{getCouponDate(coupon)}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>적용 범위</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{getCouponType(coupon.type)}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild hidden={coupon.type !== "item"}>
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>상품 선택</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              {coupon.products?.length > 0 ? (
                <VerticalFlex gap={10}>
                  <FlexChild>
                    <P>특정 상품</P>
                  </FlexChild>
                  <FlexChild>
                    <VerticalFlex
                      maxHeight={300}
                      minHeight={300}
                      overflow="scroll"
                      overflowY="scroll"
                      border={"1px solid #d0d0d0"}
                    >
                      <FlexChild
                        padding={"0 10px"}
                        borderBottom={"1px solid #d0d0d0"}
                        position="sticky"
                        top={0}
                        backgroundColor="#fff"
                        zIndex={1}
                      >
                        <HorizontalFlex gap={10} alignItems="stretch">
                          <FlexChild width={50} padding={"10px 0"}>
                            <P>썸네일</P>
                          </FlexChild>
                          <FlexChild
                            borderLeft={"1px solid #d0d0d0"}
                            borderRight={"1px solid #d0d0d0"}
                            padding={"10px 5px"}
                          >
                            <P>상품명</P>
                          </FlexChild>
                          <FlexChild width={120} padding={"10px 0"}>
                            <P>판매가</P>
                          </FlexChild>
                        </HorizontalFlex>
                      </FlexChild>
                      {coupon.products.map((product: ProductData) => (
                        <FlexChild
                          key={product.id}
                          padding={"0 10px"}
                          borderBottom={"1px solid #d0d0d0"}
                        >
                          <HorizontalFlex gap={10} alignItems="stretch">
                            <FlexChild width={50} padding={"10px 0"}>
                              <Image
                                src={product.thumbnail}
                                size={50}
                                border={"1px solid #d0d0d0"}
                              />
                            </FlexChild>
                            <FlexChild
                              borderLeft={"1px solid #d0d0d0"}
                              borderRight={"1px solid #d0d0d0"}
                              padding={"10px 5px"}
                            >
                              <P>{product.title}</P>
                            </FlexChild>
                            <FlexChild width={120} padding={"10px 0"}>
                              <P>{product.price}</P>
                            </FlexChild>
                          </HorizontalFlex>
                        </FlexChild>
                      ))}
                    </VerticalFlex>
                  </FlexChild>
                </VerticalFlex>
              ) : coupon.categories?.length > 0 ? (
                <VerticalFlex gap={10}>
                  <FlexChild>
                    <P>특정 카테고리</P>
                  </FlexChild>
                  <FlexChild flexWrap="wrap" gap={6}>
                    {coupon.categories.map((category: CategoryData) => (
                      <P className={styles.category}>
                        {getCategoryName(category)}
                      </P>
                    ))}
                  </FlexChild>
                </VerticalFlex>
              ) : (
                <P>전체상품</P>
              )}
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex justifyContent="flex-start">
            <FlexChild className={styles.head}>
              <P>최소 금액</P>
            </FlexChild>
            <FlexChild className={styles.content}>
              <P>{coupon.min ? `${coupon.min}원` : "제한 없음"}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>

        <FlexChild justifyContent="center" gap={5} position="sticky" bottom={0}>
          <Button
            styleType="white"
            padding={"12px 20px"}
            fontSize={18}
            onClick={() => modal.current.close()}
          >
            닫기
          </Button>
        </FlexChild>
      </VerticalFlex>
    </ModalBase>
  );
});

export default CouponModal;
