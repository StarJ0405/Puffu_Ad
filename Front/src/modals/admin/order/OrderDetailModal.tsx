import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Tooltip from "@/components/tooltip/Tooltip";
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
      headerStyle
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
                      text: order?.id,
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
                      ?.map((item: LineItemData) => (
                        <HorizontalFlex key={item?.id} gap={10}>
                          <FlexChild width="max-content">
                            <Tooltip
                              content={
                                <Image
                                  src={item.thumbnail}
                                  size={"min(30vw,30vh)"}
                                />
                              }
                              disable={!item?.thumbnail}
                            >
                              <Image src={item?.thumbnail} size={40} />
                            </Tooltip>
                          </FlexChild>
                          <FlexChild>
                            <FlexChild width="max-content">
                              <P>
                                {item.title} X {item.total_quantity}
                                {item.extra_quantity > 0
                                  ? ` (${item.quantity} + ${item.extra_quantity})`
                                  : ""}
                              </P>
                            </FlexChild>
                          </FlexChild>
                          <FlexChild width={"max-content"} gap={"0.5em"}>
                            <P
                              hidden={item.total === item.total_discount}
                              className={styles.total}
                            >
                              <Span>{item.total}</Span>
                              <Span>{item.currency_unit}</Span>
                            </P>
                            <P>
                              <Span>{item.total_discount}</Span>
                              <Span>{item.currency_unit}</Span>
                            </P>
                          </FlexChild>
                        </HorizontalFlex>
                      ))}
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
                    maxWidth: "520px",
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
                      <FlexChild
                        width="max-content"
                        padding={"10px 10px 10px 0"}
                      >
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
                          {order?.address?.message}
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
                  <P>{order?.shipping_methods?.[0]?.name}</P>
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
                    {order?.shipping_methods?.[0]?.tracking_number || "미지정"}
                  </P>
                </FlexChild>
              </FlexChild>
            </HorizontalFlex>
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
                        총금액
                      </P>
                    </FlexChild>
                    <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                      <P>
                        {order?.total_discounted +
                          (order?.shipping_methods?.[0]?.amount || 0) -
                          order.point}
                      </P>
                      <P>{order?.store?.currency_unit}</P>
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
                    <HorizontalFlex justifyContent={"start"}>
                      <P>{order?.total_discounted}</P>
                      <P>{order?.store?.currency_unit}</P>
                    </HorizontalFlex>
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
                    배송비
                  </P>
                </FlexChild>
                <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                  <HorizontalFlex>
                    <P>{order?.shipping_methods?.[0]?.amount || 0}</P>
                    <P>{order?.store?.currency_unit}</P>
                  </HorizontalFlex>
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
                    사용포인트
                  </P>
                </FlexChild>
                <FlexChild width="max-content" padding={"15px 15px 15px 0"}>
                  <HorizontalFlex>
                    <P>{order.point || 0}</P>
                    <P>P</P>
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
          </VerticalFlex>
        </VerticalFlex>
      </div>
    </ModalBase>
  );
});

export default OrderDetailModal;
