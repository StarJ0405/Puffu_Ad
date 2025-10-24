import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import ModalBase from "@/modals/ModalBase";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import NiceModal from "@ebay/nice-modal-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./DeliveryModal.module.css";
import clsx from "clsx";
import Div from "@/components/div/Div";
interface Step {
  display: string;
  icon: React.ReactNode;
  active?: string;
}
const steps: Step[] = [
  {
    display: "상품발송",
    icon: <Icon type="svg" name={"delivery_pickup"} size={50} />,
    active: "pickup",
  },
  {
    display: " ",
    icon: (
      <Image
        src="/resources/icons/arrow_right.png"
        height={10}
        width={"auto"}
      />
    ),
  },
  {
    display: "배송중",
    icon: <Icon type="svg" name={"delivery_shipping"} size={50} />,
    active: "shipping",
  },
  {
    display: " ",
    icon: (
      <Image
        src="/resources/icons/arrow_right.png"
        height={10}
        width={"auto"}
      />
    ),
  },
  {
    display: "배송완료",
    icon: <Icon type="svg" name={"delivery_complete"} size={50} />,
    active: "complete",
  },
];
const DeliveryDetailModal = NiceModal.create(
  ({ order }: { order: OrderData }) => {
    const modal = useRef<any>(null);
    const [withHeader, withFooter] = [true, false];
    const { isMobile } = useBrowserEvent();
    const [width, height] = isMobile ? ["100vw", "100dvh"] : ["730px", "auto"];
    const slideUp = isMobile;
    const withCloseButton = true;
    const clickOutsideToClose = true;
    const title = "배송 조회";
    const [data, setData] = useState<any>(null);
    const [status, setStatus] = useState<string>("pickup");
    const close = () => {
      modal.current.close();
    };

    useEffect(() => {
      const tracking_number = String(
        order.shipping_method?.tracking_number
      ).replace(/-/g, "");

      axios
        .get(
          `https://apis.tracker.delivery/carriers/kr.cjlogistics/tracks/${tracking_number}`
        )
        .then((res) => {
          setData(res.data);
          const progresses: any[] = res.data?.progresses || [];
          setStatus(
            progresses.some((f) => f.status?.id === "delivered")
              ? "complete"
              : progresses.some((f) => f?.status?.id === "at_pickup") &&
                progresses.length > 1
              ? "shipping"
              : "pickup"
          );
        });
    }, [order]);

    useEffect(() => {
      if (!order?.shipping_method?.tracking_number) close();
    }, [order]);

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
        slideUp={slideUp}
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
          <VerticalFlex>
            <FlexChild paddingBottom={20}>
              <HorizontalFlex justifyContent="center" gap={28}>
                {steps.map((step, index) => (
                  <FlexChild key={index} width={"max-content"}>
                    <VerticalFlex
                      gap={8}
                      //           color={index === 2 ? "#FF7C5C" : "#D9D9D9"}
                      className={clsx(styles.step, {
                        [styles.active]: status === step.active,
                      })}
                    >
                      {step.icon}
                      <P textAlign="center" height={16}>
                        {step.display}
                      </P>
                    </VerticalFlex>
                  </FlexChild>
                ))}
              </HorizontalFlex>
            </FlexChild>
            {isMobile ? (
              <>
                <Info data={data} order={order} />
                <Status data={data} />
              </>
            ) : (
              <FlexChild>
                <HorizontalFlex gap={29} alignItems="stretch">
                  <Info data={data} order={order} />
                  <Status data={data} />
                </HorizontalFlex>
              </FlexChild>
            )}
          </VerticalFlex>
        </div>
      </ModalBase>
    );
  }
);

function Info({ data, order }: { data: any; order: OrderData }) {
  return (
    <FlexChild>
      <VerticalFlex height={"100%"} flexStart>
        <FlexChild className={styles.subtitle}>
          <P>배송정보</P>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.infoLabel}>
              <P>택배사</P>
            </FlexChild>
            <FlexChild className={styles.infoValue}>
              <P>{data?.carrier?.name}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.infoLabel}>
              <P>송장 번호</P>
            </FlexChild>
            <FlexChild className={styles.infoValue}>
              <P>{order.shipping_method?.tracking_number}</P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
        <FlexChild>
          <HorizontalFlex>
            <FlexChild className={styles.infoLabel}>
              <P>택배연락처</P>
            </FlexChild>
            <FlexChild className={styles.infoValue}>
              <P>
                {String(data?.carrier?.tel).replace("+82", "").slice(0, 4)}-
                {String(data?.carrier?.tel).slice(
                  (data?.carrier?.tel?.length || 0) - 4,
                  data?.carrier?.tel?.length || 0
                )}
              </P>
            </FlexChild>
          </HorizontalFlex>
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
}
function Status({ data }: { data: any }) {
  return (
    <FlexChild>
      <VerticalFlex height={"100%"} flexStart>
        <FlexChild className={styles.subtitle}>
          <P>배송상태</P>
        </FlexChild>
        <FlexChild className={styles.status}>
          <VerticalFlex>
            {(data?.progresses || [])
              .sort((p1: any, p2: any) =>
                String(p2.time).localeCompare(p1.time)
              )
              .map((progress: any, index: number) => {
                const time = new Date(progress.time);
                return (
                  <FlexChild key={index} position="relative" padding={"11px 0"}>
                    <HorizontalFlex>
                      <FlexChild
                        width={14}
                        marginRight={13}
                        alignItems="flex-start"
                        className={clsx(styles.circle, {
                          [styles.active]:
                            progress?.status?.id === data?.state?.id,
                        })}
                      >
                        <Div
                          width={1}
                          position="absolute"
                          left={5}
                          border={"2px solid #eaeaea"}
                          height={"100%"}
                          hidden={index === data?.progresses?.length - 1}
                        />
                        <Icon name="color_circle" type="svg" size={14} />
                      </FlexChild>
                      <FlexChild
                        width={100}
                        className={clsx(styles.time, {
                          [styles.active]:
                            progress?.status?.id === data?.state?.id,
                        })}
                      >
                        <VerticalFlex>
                          <FlexChild>
                            <P>{`${time.getFullYear()}.${String(
                              time.getMonth() + 1
                            ).padStart(2, "0")}.${String(
                              time.getDate()
                            ).padStart(2, "0")}`}</P>
                          </FlexChild>
                          <FlexChild>
                            <P notranslate>
                              {`${String(time.getHours()).padStart(
                                2,
                                "0"
                              )}:${String(time.getMinutes()).padStart(2, "0")}`}
                            </P>
                          </FlexChild>
                        </VerticalFlex>
                      </FlexChild>
                      <FlexChild>
                        <VerticalFlex>
                          <FlexChild
                            className={clsx(styles.id, {
                              [styles.active]:
                                progress?.status?.id === data?.state?.id,
                            })}
                          >
                            <P>{progress?.status?.text}</P>
                          </FlexChild>
                          <FlexChild
                            className={clsx(styles.location, {
                              [styles.active]:
                                progress?.status?.id === data?.state?.id,
                            })}
                          >
                            <P>{progress?.location?.name}</P>
                          </FlexChild>
                        </VerticalFlex>
                      </FlexChild>
                    </HorizontalFlex>
                  </FlexChild>
                );
              })}
          </VerticalFlex>
        </FlexChild>
      </VerticalFlex>
    </FlexChild>
  );
}
export default DeliveryDetailModal;
