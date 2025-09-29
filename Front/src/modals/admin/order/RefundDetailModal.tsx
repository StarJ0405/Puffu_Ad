import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import ModalBase from "@/modals/ModalBase";
import { adminRequester } from "@/shared/AdminRequester";
import { copy, toast } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./RefundDetailModal.module.css";
import { SP } from "next/dist/shared/lib/utils";

const RefundDetailModal = NiceModal.create(
  ({
    refund,
    edit = false,
    onSuccess,
  }: {
    refund: RefundData;
    edit?: boolean;
    onSuccess?: () => void;
  }) => {
    const modal = useRef<any>(null);
    const [withHeader, withFooter] = [true, false];
    const [width, height] = ["730px", "75vh"];
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "환불 " + (edit ? "편집" : "상세");
    const inputs = useRef<any[]>([]);
    const [selects, setSelects] = useState<RefundItemData[]>(
      refund?.items || []
    );
    const swiperRef = useRef<SwiperType | null>(null);

    const paintBullets = (swiper: SwiperType) => {
      // 페이지네이션 스타일 설정
      const bullets = swiper.pagination?.el?.querySelectorAll(
        ".swiper-pagination-bullet"
      );
      if (!bullets) return;

      bullets.forEach((el) => {
        const bullet = el as HTMLElement;
        bullet.style.setProperty("background-color", "#000", "important");
        bullet.style.setProperty("opacity", "0.3", "important");
        bullet.style.setProperty("transform", "scale(1)");
        bullet.style.setProperty("margin", "0 4px", "important");
        bullet.style.setProperty("left", "0", "important");
        bullet.style.setProperty("top", "2px", "important");
      });

      const active = swiper.pagination?.el?.querySelector(
        ".swiper-pagination-bullet-active"
      ) as HTMLElement | null;
      if (active) {
        active.style.setProperty("opacity", "1", "important");
        active.style.setProperty(
          "background-color",
          "var(--admin-color)",
          "important"
        );
        active.style.setProperty("transform", "scale(1.66)");
      }
    };

    return (
      <ModalBase
        borderRadius={"10px"}
        ref={modal}
        width={width}
        height={height}
        withHeader={withHeader}
        withFooter={withFooter}
        withCloseButton={withCloseButton}
        clickOutsideToClose={clickOutsideToClose}
        title={title}
        closeBtnWhite={true}
      >
        <div
          style={{
            overflowY: "auto",
            padding: "20px 13px",
            height: "100%",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            display: "flex",
            flexGrow: 1,
          }}
        >
          <VerticalFlex gap={10}>
            <VerticalFlex>
              <HorizontalFlex
                justifyContent="flex-start"
                gap={20}
                borderBottom={"1px solid #EFEFEF"}
              >
                <FlexChild
                  width={120}
                  padding={"18px 15px"}
                  backgroundColor={"#F5F6FB"}
                  justifyContent={"center"}
                >
                  <P size={16} weight={600}>
                    주문번호
                  </P>
                </FlexChild>
                <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                  <P
                    cursor="pointer"
                    textHover
                    onClick={() =>
                      copy({
                        text: refund?.order?.display || "",
                        message: "주문번호를 복사했습니다",
                      })
                    }
                  >
                    {refund?.order?.display}
                  </P>
                </FlexChild>
              </HorizontalFlex>
              <HorizontalFlex justifyContent="flex-start">
                <FlexChild gap={20} borderBottom={"1px solid #EFEFEF"}>
                  <FlexChild
                    width={120}
                    padding={"18px 15px"}
                    backgroundColor={"#F5F6FB"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600}>
                      주문자
                    </P>
                  </FlexChild>
                  <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                    <P>{refund?.order?.user?.name}</P>
                  </FlexChild>
                </FlexChild>
              </HorizontalFlex>
              <HorizontalFlex justifyContent="flex-start">
                <FlexChild
                  alignItems="stretch"
                  gap={20}
                  borderTop={"1px solid #EFEFEF"}
                  borderBottom={"1px solid #EFEFEF"}
                >
                  <FlexChild
                    width={120}
                    padding={"18px 15px"}
                    backgroundColor={"#F5F6FB"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600}>
                      환불가능 금액
                    </P>
                  </FlexChild>
                  <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                    <P>
                      <Span color="green">
                        {refund.items?.reduce(
                          (acc, item) =>
                            acc +
                            ((item.item?.discount_price || 0) +
                              (item?.item?.shared_price || 0)) *
                              item.quantity,
                          0
                        ) || 0}
                      </Span>
                      <Span>원 | </Span>
                      <Span color="green">
                        {refund.items?.reduce(
                          (acc, item) =>
                            acc +
                            ((refund?.order?.point || 0) /
                              (refund?.order?.total_discounted || 0)) *
                              (item?.item?.discount_price || 0) *
                              item.quantity,
                          0
                        ) || 0}
                      </Span>
                      <Span>P</Span>
                      <Span> / (</Span>
                      <Span>
                        {(refund?.order?.shipping_method?.amount || 0) +
                          (refund?.order?.total_discounted || 0) -
                          (refund?.order?.point || 0)}
                      </Span>
                      <Span>원 | </Span>
                      <Span>{refund?.order?.point}</Span>
                      <Span>P)</Span>
                    </P>
                  </FlexChild>
                </FlexChild>
              </HorizontalFlex>
              <FlexChild
                marginTop={20}
                width={"100%"}
                padding={"18px 15px"}
                backgroundColor={"#383e58"}
                justifyContent={"center"}
              >
                <P size={16} color={"#ffffff"} weight={600}>
                  상품
                </P>
              </FlexChild>
              {edit && (
                <Select
                  minHeight={62}
                  multiple
                  zIndex={10080}
                  classNames={{
                    line: styles.select_row,
                  }}
                  value={selects.map((rl) => rl.item_id)}
                  onChange={(value) => {
                    const items: RefundItemData[] = (value as string[]).map(
                      (v) => {
                        let item: any = refund.items?.find(
                          (f) => f.item_id === v
                        );
                        if (item) return item;
                        item = refund.order?.items.find((i) => i.id === v);

                        return {
                          item_id: item.id,
                          item,
                          quantity: item.total_quantity,
                        } as RefundItemData;
                      }
                    );
                    if (items) {
                      setSelects(items);
                      document.getElementById("quantity")?.focus();
                    }
                  }}
                  width={"100%"}
                  options={
                    refund?.order?.items.map((item) => ({
                      display: (
                        <HorizontalFlex key={item.id} color="#111">
                          <FlexChild gap={10}>
                            <Image src={item.thumbnail} size={40} />
                            <P>{item.title}</P>
                          </FlexChild>
                          <FlexChild width={"max-content"}>
                            <P>
                              {` X ${item.quantity}
                      ${
                        item.extra_quantity ? ` + ${item.extra_quantity}` : ""
                      }`}
                            </P>
                          </FlexChild>
                        </HorizontalFlex>
                      ),
                      value: item.id,
                    })) || []
                  }
                />
              )}
            </VerticalFlex>

            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              modules={[Pagination]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              onAfterInit={(swiper) => {
                // Pagination DOM이 생성된 뒤
                paintBullets(swiper);
              }}
              onSlideChange={(swiper) => {
                // active bullet이 바뀔 때마다
                paintBullets(swiper);
              }}
              onPaginationUpdate={(swiper) => {
                // dynamicBullets로 bullet 구성이 바뀌는 경우
                paintBullets(swiper);
              }}
            >
              {selects?.map((item, index) => (
                <SwiperSlide key={item?.id}>
                  <Item
                    ref={(el) => {
                      inputs.current[index] = el;
                    }}
                    item={item}
                    refund={refund}
                    edit={edit}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {edit ? (
              <FlexChild gap={20} position="sticky" bottom={0} padding={20}>
                <Button
                  className={styles.cancel_button}
                  onClick={() => modal.current.close()}
                >
                  취소
                </Button>
                <Button
                  className={styles.confirm_button}
                  onClick={() =>
                    adminRequester.updateRefund(
                      refund.id,
                      {
                        items: inputs.current
                          .filter(Boolean)
                          .map((input) => input.getValue()),
                      },
                      () => {
                        onSuccess?.();
                        modal.current.close();
                      }
                    )
                  }
                >
                  편집
                </Button>
              </FlexChild>
            ) : (
              <FlexChild gap={20} position="sticky" bottom={0} padding={20}>
                <Button
                  hidden={!!refund.deleted_at || !!refund.completed_at}
                  className={styles.confirm_button}
                  onClick={() =>
                    NiceModal.show("confirm", {
                      message: (
                        <VerticalFlex>
                          <P>환불 신청을 철회하시겠습니까?</P>
                          <P>
                            수정이 필요한 경우 반드시 [편집 기능]을 이용해주세요
                          </P>
                        </VerticalFlex>
                      ),
                      confirmText: "철회",
                      cancelText: "그만두기",
                      onConfirm: () =>
                        adminRequester.cancelRefund(refund.id, {}, () => {
                          onSuccess?.();
                          modal.current.close();
                        }),
                    })
                  }
                >
                  철회
                </Button>
                <Button
                  hidden={refund.completed_at}
                  className={styles.cancel_button}
                  onClick={() => {
                    const value =
                      refund.items?.reduce(
                        (acc, item) =>
                          acc +
                          Math.round(
                            (item.item?.discount_price || 0) +
                              (item?.item?.shared_price || 0)
                          ) *
                            item.quantity,
                        0
                      ) || 0;
                    const point =
                      refund.items?.reduce(
                        (acc, item) =>
                          acc +
                          Math.round(
                            ((refund?.order?.point || 0) /
                              (refund?.order?.total_discounted || 0)) *
                              (item?.item?.discount_price || 0)
                          ) *
                            item.quantity,
                        0
                      ) || 0;
                    // 무통장 여부
                    const isBank = !!refund?.order?.payment_data?.bank;
                    NiceModal.show("input", {
                      message: isBank ? (
                        <VerticalFlex>
                          <P size={18} weight={600} color="#111">
                            환불 정보
                          </P>
                          <P size={14} weight={500} color="red">
                            무통장 입금은 환불을 직접하고 진행할 것!
                          </P>
                        </VerticalFlex>
                      ) : (
                        "환불 정보"
                      ),
                      input: [
                        {
                          label: isBank
                            ? "환불 해준 금액(기록용)"
                            : "환불 금액",
                          type: "number",
                          max: value,
                          value: value,
                        },
                        {
                          label: "환불 포인트",
                          type: "number",
                          max: point,
                          value: point,
                        },
                      ],
                      confirmText: "환불하기",
                      cancelText: "취소",
                      preventable: true,
                      onConfirm: async (values: number[]) => {
                        if (values.every((value) => value === 0)) {
                          setTimeout(
                            () =>
                              toast({
                                message:
                                  "환불액이나 환불포인트이 모두 0이 될 수는 없습니다.",
                              }),
                            1
                          );
                          return false;
                        }
                        const response = await adminRequester.completeRefund(
                          refund.id,
                          {
                            value: values[0],
                            point: values[1],
                          }
                        );
                        if (response.message) {
                          onSuccess?.();
                          modal.current.close();
                          return true;
                        }
                      },
                    });
                  }}
                >
                  환불 청구
                </Button>
              </FlexChild>
            )}
          </VerticalFlex>
        </div>
      </ModalBase>
    );
  }
);

const Item = forwardRef(
  (
    {
      item,
      refund,
      edit,
    }: { item: RefundItemData; refund: RefundData; edit: boolean },
    ref
  ) => {
    const max =
      (item.item?.quantity || 0) -
      (item.item?.refunds?.reduce((acc, now) => acc + now.quantity, 0) || 0);
    const [quantity, setQuantity] = useState<number>(item.quantity);
    const [memo, setMemo] = useState<string>(item.memo || "");
    useImperativeHandle(ref, () => ({
      getValue() {
        const _item = { ...item, quantity, memo };
        delete _item.item;
        return _item;
      },
    }));
    return (
      <VerticalFlex marginTop={20} className={styles.content_wrapper}>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header}>
            <P>상품명</P>
          </FlexChild>
          <FlexChild className={styles.value}>
            <P>{item?.item?.title}</P>
          </FlexChild>
        </FlexChild>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header}>
            <P>
              <Span>수량</Span>
              <Span fontWeight={500} fontSize={12}>
                (증정 미포함)
              </Span>
            </P>
          </FlexChild>
          {edit ? (
            <FlexChild>
              <InputNumber
                id="quantity"
                min={1}
                width={300}
                max={max}
                hideArrow
                style={{
                  fontWeight: 600,
                  fontSize: 20,
                }}
                value={quantity}
                onChange={(quantity) => setQuantity(quantity)}
              />
            </FlexChild>
          ) : (
            <FlexChild className={styles.value}>
              <P>{quantity}</P>
            </FlexChild>
          )}
        </FlexChild>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header}>
            <P>
              <Span display="inline-block">판매된 가격</Span>
              <Span display="inline-block" fontSize={12} fontWeight={500}>
                (프로모션 적용)
              </Span>
            </P>
          </FlexChild>
          <FlexChild className={styles.value}>
            <P>
              <Span>{(item?.item?.discount_price || 0) * item.quantity}</Span>
              <Span>원</Span>
            </P>
            <P hidden={quantity === 1} fontSize={15} fontWeight={400}>
              <Span>(</Span>
              <Span>{item.item?.discount_price}</Span>
              <Span> * </Span>
              <Span>{item.quantity}</Span>
              <Span>)</Span>
            </P>
          </FlexChild>
        </FlexChild>
        <FlexChild className={styles.row}>
          <P className={styles.header}>배송비</P>
          <P className={styles.value}>
            <Span>
              {((refund?.order?.shipping_method?.amount || 0) /
                (refund?.order?.total_discounted || 0)) *
                (item.item?.discount_price || 0) *
                quantity}
            </Span>
            <Span>원</Span>
          </P>
        </FlexChild>
        <FlexChild className={styles.row}>
          <P className={styles.header}>기타 할인</P>
          <P className={styles.value}>
            <Span>
              {((item?.item?.shared_price || 0) +
                (((refund?.order?.point || 0) -
                  (refund?.order?.shipping_method?.amount || 0)) /
                  (refund?.order?.total_discounted || 0)) *
                  (item?.item?.discount_price || 0)) *
                item.quantity}
            </Span>

            <Span>원</Span>
          </P>
        </FlexChild>
        <FlexChild className={styles.row}>
          <P className={styles.header}>환불가능 금액</P>
          <P className={styles.value}>
            <Span>
              {((item.item?.discount_price || 0) +
                (item?.item?.shared_price || 0)) *
                quantity}
            </Span>
            <Span>원</Span>
          </P>
        </FlexChild>
        <FlexChild className={styles.row}>
          <P className={styles.header}>환불가능 포인트</P>
          <P className={styles.value}>
            <Span>
              {((refund?.order?.point || 0) /
                (refund?.order?.total_discounted || 0)) *
                (item?.item?.discount_price || 0) *
                quantity}
            </Span>
            <Span>P</Span>
          </P>
        </FlexChild>
        <FlexChild className={styles.row}>
          <FlexChild className={styles.header}>
            <P>메모</P>
          </FlexChild>
          {edit ? (
            <FlexChild>
              <Input
                style={{
                  width: 300,
                  fontWeight: 600,
                  fontSize: 20,
                  padding: "1px 4px",
                }}
                value={memo}
                onChange={(value) => setMemo(value as string)}
                placeHolder="관리자용으로 메모할 내용을 작성해주세요"
              />
            </FlexChild>
          ) : (
            <FlexChild className={styles.value}>
              <P>{memo || "없음"}</P>
            </FlexChild>
          )}
        </FlexChild>
      </VerticalFlex>
    );
  }
);
export default RefundDetailModal;
