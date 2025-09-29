import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import ModalBase from "@/modals/ModalBase";
import { copy, dateToString } from "@/shared/utils/Functions";
import NiceModal from "@ebay/nice-modal-react";
import { useRef } from "react";
import styles from "./OrderDetailModal.module.css";
const OrderDetailModal = NiceModal.create(({ order }: { order: OrderData }) => {
  const modal = useRef<any>(null);
  const [withHeader, withFooter] = [true, false];
  const [width, height] = ["730px", "75vh"];
  const withCloseButton = true;
  const clickOutsideToClose = true;
  const title = "주문 상세";
  const close = () => {
    modal.current.close();
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
          padding: "20px 13px 100px",
          height: "100%",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <VerticalFlex gap={10}>
          <VerticalFlex>
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
                    주문일
                  </P>
                </FlexChild>
                <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                  <P>{dateToString(new Date(order?.created_at), true, true)}</P>
                </FlexChild>
              </FlexChild>
            </HorizontalFlex>
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
                      text: order?.display,
                      message: "주문번호를 복사했습니다",
                    })
                  }
                >
                  {order?.display}
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
                  <P>{order?.user?.name}</P>
                </FlexChild>
              </FlexChild>
            </HorizontalFlex>

            <HorizontalFlex
              marginTop={20}
              justifyContent="flex-start"
              gap={20}
              alignItems={"stretch"}
              borderTop={"1px solid #EFEFEF"}
              borderBottom={"1px solid #EFEFEF"}
            >
              <FlexChild width={"fit-content"} alignItems={"stretch"}>
                <VerticalFlex
                  alignItems={"center"}
                  width={"fit-content"}
                  gap={10}
                >
                  <FlexChild
                    width={120}
                    height={"100%"}
                    padding={"18px 15px"}
                    backgroundColor={"#383e58"}
                    justifyContent={"center"}
                  >
                    <P size={16} color={"#ffffff"} weight={600}>
                      상품
                    </P>
                  </FlexChild>
                </VerticalFlex>
              </FlexChild>
              <FlexChild padding={"15px 15px 15px 0"} flex={1}>
                <div
                  style={{
                    height: 300,
                    border: "1px solid #c6c6c6",
                    width: "100%",
                    overflowY: "auto",
                    padding: 10,
                  }}
                >
                  <VerticalFlex gap={10}>
                    {order?.items
                      ?.sort((i1, i2) =>
                        String(
                          `${i1?.brand?.name} ${i1.product_title} ${new Date(
                            i1.created_at
                          ).getTime()}`
                        ).localeCompare(
                          String(
                            `${i2?.brand?.name} ${i2.product_title} ${new Date(
                              i2.created_at
                            ).getTime()}`
                          )
                        )
                      )
                      ?.map((item: LineItemData) => {
                        const refund_total =
                          item.total_quantity -
                          (item.refunds
                            ?.filter((f) => f.refund?.completed_at)
                            ?.reduce((acc, now) => acc + now.quantity, 0) || 0);
                        return (
                          <HorizontalFlex
                            key={item?.id}
                            gap={10}
                            flexShrink={1}
                          >
                            <FlexChild width={"max-content"}>
                              <Image src={item?.thumbnail} size={40} />
                            </FlexChild>
                            <FlexChild flexShrink={1} gap={10}>
                              <FlexChild>
                                <P>{item.title}</P>
                              </FlexChild>
                              <FlexChild width={"max-content"}>
                                <VerticalFlex>
                                  <P
                                    width={"max-content"}
                                    textDecorationLine={
                                      item?.refunds?.length
                                        ? "line-through"
                                        : undefined
                                    }
                                  >
                                    <Span>X {item.total_quantity}</Span>
                                    <Span hidden={!item.refunds?.length}>
                                      {item.extra_quantity > 0
                                        ? ` (${item.quantity} + ${item.extra_quantity})`
                                        : ""}
                                    </Span>
                                  </P>
                                  <P
                                    width={"max-content"}
                                    hidden={!item.refunds?.length}
                                  >
                                    <Span>X </Span>
                                    <Span color="red">{refund_total}</Span>
                                  </P>
                                </VerticalFlex>
                              </FlexChild>
                            </FlexChild>
                            <FlexChild gap={"0.5em"} width={80}>
                              <VerticalFlex>
                                <P
                                  hidden={
                                    item.total === item.total_discount ||
                                    refund_total === 0
                                  }
                                  className={styles.total}
                                  fontSize={12}
                                >
                                  <Span>
                                    {((item.total || 0) * refund_total) /
                                      item.quantity}
                                  </Span>
                                  <Span>{item.currency_unit}</Span>
                                </P>
                                <P>
                                  <Span>
                                    {((item.total_discount || 0) *
                                      refund_total) /
                                      item.quantity}
                                  </Span>
                                  <Span>{item.currency_unit}</Span>
                                </P>
                              </VerticalFlex>
                            </FlexChild>
                          </HorizontalFlex>
                        );
                      })}
                  </VerticalFlex>
                </div>
              </FlexChild>
            </HorizontalFlex>
            <HorizontalFlex
              justifyContent="flex-start"
              gap={20}
              alignItems="stretch"
              borderBottom={"1px solid #EFEFEF"}
            >
              <FlexChild
                width={120}
                padding={"18px 15px"}
                backgroundColor={"#383e58"}
                justifyContent={"center"}
              >
                <P size={16} weight={600} color={"#ffffff"}>
                  배송지 정보
                </P>
              </FlexChild>
              <FlexChild padding={"15px 15px 15px 0"} flex={1}>
                <div
                  style={{
                    border: "1px solid #c6c6c6",
                    width: "100%",
                    padding: 10,
                  }}
                >
                  <VerticalFlex>
                    <HorizontalFlex
                      justifyContent="flex-start"
                      gap={20}
                      alignItems="stretch"
                      borderBottom={"1px solid #EFEFEF"}
                      borderTop={"1px solid #EFEFEF"}
                    >
                      <FlexChild
                        width={90}
                        padding={"8px"}
                        backgroundColor={"#F5F6FB"}
                        justifyContent={"center"}
                      >
                        <P weight={600}>받는분</P>
                      </FlexChild>
                      <FlexChild
                        width="max-content"
                        padding={"10px 10px 10px 0"}
                      >
                        <P color={"#000"}>{order?.address?.name}</P>
                      </FlexChild>
                    </HorizontalFlex>
                    <HorizontalFlex
                      justifyContent="flex-start"
                      gap={20}
                      alignItems="stretch"
                      borderBottom={"1px solid #EFEFEF"}
                    >
                      <FlexChild
                        width={90}
                        padding={"8px"}
                        backgroundColor={"#F5F6FB"}
                        justifyContent={"center"}
                      >
                        <P weight={600}>전화번호</P>
                      </FlexChild>
                      <FlexChild
                        width="max-content"
                        padding={"10px 10px 10px 0"}
                      >
                        <P color={"#000"}>{order?.address?.phone}</P>
                      </FlexChild>
                    </HorizontalFlex>
                    <HorizontalFlex
                      justifyContent="flex-start"
                      gap={20}
                      alignItems="stretch"
                      borderBottom={"1px solid #EFEFEF"}
                    >
                      <FlexChild
                        width={90}
                        padding={"8px"}
                        backgroundColor={"#F5F6FB"}
                        justifyContent={"center"}
                      >
                        <P weight={600}>우편번호</P>
                      </FlexChild>
                      <FlexChild
                        width="max-content"
                        padding={"10px 10px 10px 0"}
                      >
                        <P color={"#000"}>{order?.address?.postal_code}</P>
                      </FlexChild>
                    </HorizontalFlex>
                    <HorizontalFlex
                      justifyContent="flex-start"
                      gap={20}
                      alignItems="stretch"
                      borderBottom={"1px solid #EFEFEF"}
                    >
                      <FlexChild
                        width={90}
                        padding={"8px"}
                        backgroundColor={"#F5F6FB"}
                        justifyContent={"center"}
                      >
                        <P weight={600}>주소</P>
                      </FlexChild>
                      <FlexChild padding={"10px 10px 10px 0"}>
                        <P color={"#000"}>
                          {order?.address?.address1} {order?.address?.address2}
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                    <HorizontalFlex
                      justifyContent="flex-start"
                      gap={20}
                      alignItems="stretch"
                      borderBottom={"1px solid #EFEFEF"}
                    >
                      <FlexChild
                        width={90}
                        padding={"8px"}
                        backgroundColor={"#F5F6FB"}
                        justifyContent={"center"}
                      >
                        <P weight={600}>배송메모</P>
                      </FlexChild>
                      <FlexChild padding={"10px 10px 10px 0"}>
                        <P width={"100%"} color={"#000"}>
                          {order?.address?.message || "없음"}
                        </P>
                      </FlexChild>
                    </HorizontalFlex>
                  </VerticalFlex>
                </div>
              </FlexChild>
            </HorizontalFlex>
            <HorizontalFlex justifyContent="flex-start" marginTop={20}>
              <FlexChild
                gap={20}
                alignItems="stretch"
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
                    배송종류
                  </P>
                </FlexChild>
                <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                  <P>{order?.shipping_method?.name}</P>
                </FlexChild>
              </FlexChild>
              <FlexChild
                gap={20}
                alignItems="stretch"
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
                    등기번호
                  </P>
                </FlexChild>
                <FlexChild width="max-content">
                  <P
                    textHover
                    cursor="pointer"
                    onClick={() => {
                      NiceModal.show("deliveryCheck", { order: order });
                    }}
                  >
                    {order?.shipping_method?.tracking_number || "미지정"}
                  </P>
                </FlexChild>
              </FlexChild>
            </HorizontalFlex>
            <FlexChild>
              <VerticalFlex>
                <FlexChild
                  gap={20}
                  alignItems="stretch"
                  borderBottom={"1px solid #EFEFEF"}
                >
                  <FlexChild
                    width={120}
                    padding={"18px 15px"}
                    backgroundColor={"#F5F6FB"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600}>
                      결제방법
                    </P>
                  </FlexChild>
                  <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                    <P>
                      {order.total_discounted +
                        order.total_tax +
                        (order?.shipping_method?.amount || 0) -
                        order.point <=
                      0
                        ? "포인트 결제"
                        : order?.payment_data?.bank
                        ? "무통장"
                        : order?.payment_data?.trackId
                        ? "NESTPAY(신용카드)"
                        : order?.payment_data?.type === "BRANDPAY"
                        ? "토스"
                        : "알 수 없음"}
                    </P>
                  </FlexChild>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
            <HorizontalFlex justifyContent="flex-start" alignItems="flex-start">
              <FlexChild>
                <VerticalFlex>
                  <FlexChild
                    gap={20}
                    alignItems="stretch"
                    borderBottom={"1px solid #EFEFEF"}
                  >
                    <FlexChild
                      width={120}
                      padding={"18px 15px"}
                      backgroundColor={"#F5F6FB"}
                      justifyContent={"center"}
                    >
                      <P size={16} weight={600}>
                        총 결제액
                      </P>
                    </FlexChild>
                    <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                      <P>
                        <Span>
                          {order?.total_discounted +
                            (order?.shipping_method?.amount || 0) -
                            order.point -
                            (order.refunds?.reduce(
                              (acc, now) => acc + now.value,
                              0
                            ) || 0)}
                        </Span>
                        <Span>{order?.store?.currency_unit}</Span>
                      </P>
                      <P
                        paddingLeft={"0.5em"}
                        textDecorationLine="line-through"
                        hidden={
                          order.refunds?.filter((f) => f.value > 0).length === 0
                        }
                      >
                        <Span>(</Span>
                        <Span>
                          {order?.total_discounted +
                            (order?.shipping_method?.amount || 0) -
                            order.point}
                        </Span>
                        <Span>{order?.store?.currency_unit}</Span>
                        <Span>)</Span>
                      </P>
                    </FlexChild>
                  </FlexChild>
                </VerticalFlex>
              </FlexChild>
              <FlexChild>
                <HorizontalFlex
                  gap={20}
                  justifyContent={"start"}
                  alignItems="stretch"
                  borderBottom={"1px solid #EFEFEF"}
                >
                  <FlexChild
                    width={120}
                    padding={"18px 15px"}
                    backgroundColor={"#F5F6FB"}
                    justifyContent={"center"}
                  >
                    <P size={16} weight={600}>
                      총 상품금액
                    </P>
                  </FlexChild>
                  <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                    <P>
                      <Span>{order?.total_discounted}</Span>
                      <Span>{order?.store?.currency_unit}</Span>
                    </P>
                  </FlexChild>
                </HorizontalFlex>
              </FlexChild>
            </HorizontalFlex>
            <HorizontalFlex>
              <HorizontalFlex
                justifyContent="flex-start"
                gap={20}
                alignItems="stretch"
                borderBottom={"1px solid #EFEFEF"}
              >
                <FlexChild
                  width={120}
                  padding={"18px 15px"}
                  backgroundColor={"#F5F6FB"}
                  justifyContent={"center"}
                >
                  <P size={16} weight={600}>
                    사용포인트
                  </P>
                </FlexChild>
                <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                  <P>
                    <Span>
                      {(order.point || 0) -
                        (order.refunds?.reduce(
                          (acc, now) => acc + now.point,
                          0
                        ) || 0)}
                    </Span>
                    <Span>P</Span>
                  </P>
                  <P
                    paddingLeft={"0.5em"}
                    hidden={
                      order.refunds?.filter((f) => f.point > 0)?.length === 0
                    }
                    textDecorationLine="line-through"
                  >
                    <Span>(</Span>
                    <Span>{order.point || 0}</Span>
                    <Span>P</Span>
                    <Span>)</Span>
                  </P>
                </FlexChild>
              </HorizontalFlex>
              <HorizontalFlex
                justifyContent="flex-start"
                gap={20}
                alignItems="stretch"
                borderBottom={"1px solid #EFEFEF"}
              >
                <FlexChild
                  width={120}
                  padding={"18px 15px"}
                  backgroundColor={"#F5F6FB"}
                  justifyContent={"center"}
                >
                  <P size={16} weight={600}>
                    배송비
                  </P>
                </FlexChild>
                <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                  <HorizontalFlex>
                    <P>{order?.shipping_method?.amount || 0}</P>
                    <P>{order?.store?.currency_unit}</P>
                  </HorizontalFlex>
                </FlexChild>
              </HorizontalFlex>
            </HorizontalFlex>
            <HorizontalFlex
              justifyContent="flex-start"
              gap={20}
              alignItems="stretch"
              borderBottom={"1px solid #EFEFEF"}
            >
              <FlexChild
                width={120}
                padding={"18px 15px"}
                backgroundColor={"#F5F6FB"}
                justifyContent={"center"}
              >
                <P size={16} weight={600}>
                  관리자 메모
                </P>
              </FlexChild>
              <FlexChild width="100%" padding={"15px 15px 15px 0"} flex={1}>
                <P color={order?.metadata?.memo ? "red" : undefined}>
                  {String(order?.metadata?.memo || "없음")}
                </P>
              </FlexChild>
            </HorizontalFlex>

            <FlexChild hidden={order.refunds?.length === 0}>
              <VerticalFlex>
                <FlexChild marginTop={20}>
                  <P fontWeight={700} fontSize={20}>
                    환불내역
                  </P>
                </FlexChild>
                {order.refunds?.map((refund) => (
                  <FlexChild key={refund.id} marginTop={10}>
                    <VerticalFlex>
                      <HorizontalFlex
                        justifyContent="flex-start"
                        gap={20}
                        alignItems="stretch"
                        borderBottom={"1px solid #EFEFEF"}
                      >
                        <FlexChild
                          width={120}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            환불 신청일
                          </P>
                        </FlexChild>
                        <FlexChild
                          width="100%"
                          padding={"15px 15px 15px 0"}
                          flex={1}
                        >
                          <P>{dateToString(refund.created_at, true)}</P>
                        </FlexChild>
                      </HorizontalFlex>
                      <HorizontalFlex
                        justifyContent="flex-start"
                        gap={20}
                        alignItems="stretch"
                        borderBottom={"1px solid #EFEFEF"}
                      >
                        <FlexChild
                          width={120}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            환불 상태
                          </P>
                        </FlexChild>
                        <FlexChild
                          width="100%"
                          padding={"15px 15px 15px 0"}
                          flex={1}
                        >
                          <P>
                            {refund.completed_at
                              ? `환불 완료 (${dateToString(
                                  refund.completed_at,
                                  true
                                )})`
                              : "처리중"}
                          </P>
                        </FlexChild>
                      </HorizontalFlex>

                      <HorizontalFlex hidden={!refund.completed_at}>
                        <HorizontalFlex
                          justifyContent="flex-start"
                          gap={20}
                          alignItems="stretch"
                          borderBottom={"1px solid #EFEFEF"}
                        >
                          <FlexChild
                            width={120}
                            padding={"18px 15px"}
                            backgroundColor={"#F5F6FB"}
                            justifyContent={"center"}
                          >
                            <P size={16} weight={600}>
                              환불액
                            </P>
                          </FlexChild>
                          <FlexChild
                            width="100%"
                            padding={"15px 15px 15px 0"}
                            flex={1}
                          >
                            <P>
                              <Span>{refund.value}</Span>
                              <Span>원</Span>
                            </P>
                          </FlexChild>
                        </HorizontalFlex>
                        <HorizontalFlex
                          justifyContent="flex-start"
                          gap={20}
                          alignItems="stretch"
                          borderBottom={"1px solid #EFEFEF"}
                        >
                          <FlexChild
                            width={120}
                            padding={"18px 15px"}
                            backgroundColor={"#F5F6FB"}
                            justifyContent={"center"}
                          >
                            <P size={16} weight={600}>
                              환불 포인트
                            </P>
                          </FlexChild>
                          <FlexChild
                            width="100%"
                            padding={"15px 15px 15px 0"}
                            flex={1}
                          >
                            <P>
                              <Span>{refund.point}</Span>
                              <Span>P</Span>
                            </P>
                          </FlexChild>
                        </HorizontalFlex>
                      </HorizontalFlex>
                      <HorizontalFlex
                        justifyContent="flex-start"
                        gap={20}
                        alignItems="stretch"
                        borderBottom={"1px solid #EFEFEF"}
                      >
                        <FlexChild
                          width={120}
                          padding={"18px 15px"}
                          backgroundColor={"#F5F6FB"}
                          justifyContent={"center"}
                        >
                          <P size={16} weight={600}>
                            환불 상품
                          </P>
                        </FlexChild>
                        <FlexChild
                          // width="100%"
                          padding={"15px 15px 15px 0"}
                          flex={1}
                          gap={2}
                          flexWrap="wrap"
                        >
                          {refund.items?.map((item) => (
                            <P
                              key={item.id}
                              padding={"5px 10px"}
                              borderRadius={5}
                              backgroundColor="#d0d0d0"
                            >
                              <Span>{item?.item?.title}</Span>
                              <Span> X </Span>
                              <Span>{item.quantity}</Span>
                            </P>
                          ))}
                        </FlexChild>
                      </HorizontalFlex>
                    </VerticalFlex>
                  </FlexChild>
                ))}
              </VerticalFlex>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </div>
    </ModalBase>
  );
});

export default OrderDetailModal;
