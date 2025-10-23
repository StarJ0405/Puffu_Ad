"use client";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Span from "@/components/span/Span";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import styles from "./page.module.css";
import useNavigate from "@/shared/hooks/useNavigate";

export function PointDetail({
  initDetail,
  initOrder,
}: {
  initDetail: any;
  initOrder?: any | null;
}) {
  const navigate = useNavigate();
  const fmtNumber = (n: number | string | undefined) =>
    new Intl.NumberFormat("ko-KR").format(Number(n ?? 0));
  const fmtKST = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "";

  const point = Number(initDetail?.data?.point ?? 0);
  const isUsed = point < 0;
  const absPoint = Math.abs(point);
  const balance = Number(initDetail?.data?.total ?? 0);

  const order = initOrder || null;
  const items: any[] = Array.isArray(order?.items) ? order.items : [];

  const titleFromItem = (it: any) =>
    it?.title ?? (it?.variant?.product?.title ? it.variant.product.title : "");

  const imgFromItem = (it: any) =>
    it?.variant?.product?.thumbnail ?? "/resources/images/no_img.png";
  const productId = (it: any) => it?.variant?.product_id;
  return (
    <VerticalFlex
      className={styles.point_detail}
      alignItems="flex-start"
      gap={20}
    >
      <P className={styles.date}>{fmtKST(initDetail?.created_at)}</P>
      {isUsed && items.length > 0 ? (
        <>
          {items.map((it, idx) => (
            <FlexChild
              key={it?.id ?? idx}
              borderBottom={"1px solid #797979"}
              paddingBottom={15}
            >
              <HorizontalFlex gap={7} alignItems="flex-start">
                <FlexChild width={"fit-content"}>
                  <Image
                    src={imgFromItem(it)}
                    width={66}
                    onClick={() => navigate(`/products/${productId(it)}`)}
                  />
                </FlexChild>
                <VerticalFlex alignItems="flex-start" gap={10}>
                  <P className={styles.store}>{order?.store?.name ?? ""}</P>
                  <P
                    className={styles.title}
                    onClick={() => navigate(`/products/${productId(it)}`)}
                  >
                    {titleFromItem(it)}
                  </P>
                  <P className={styles.option}>
                    <Span>{fmtNumber(it?.quantity ?? it?.count ?? 0)}</Span>
                    <Span>개</Span>
                    <Span> / </Span>
                    <Span color="var(--main-color1)">
                      {fmtNumber(it?.total_final ?? 0)}
                    </Span>
                    <Span color="var(--main-color1)">원</Span>
                  </P>
                </VerticalFlex>
              </HorizontalFlex>
            </FlexChild>
          ))}
        </>
      ) : (
        <FlexChild borderBottom={"1px solid #797979"} padding={"20px 0 15px 0"}>
          <P>{initDetail?.name ?? "포인트 내역"}</P>
        </FlexChild>
      )}

      <FlexChild>
        <VerticalFlex>
          <HorizontalFlex className={styles.point_box}>
            <P>{isUsed ? "사용포인트" : "적립포인트"}</P>
            <P className={clsx(styles.point, { [styles.used]: isUsed })}>
              <Span>{isUsed ? "-" : "+"}</Span>
              <Span>{fmtNumber(absPoint)}</Span>
              <Span>P</Span>
            </P>
          </HorizontalFlex>
          <HorizontalFlex justifyContent="flex-end">
            <P className={styles.points_balance_txt}>
              <Span>잔액 </Span>
              <Span>{fmtNumber(balance)}</Span>
              <Span>P</Span>
            </P>
          </HorizontalFlex>
        </VerticalFlex>
      </FlexChild>
    </VerticalFlex>
  );
}
