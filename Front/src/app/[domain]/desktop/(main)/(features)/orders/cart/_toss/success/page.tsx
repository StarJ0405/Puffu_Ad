import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import { requester } from "@/shared/Requester";
import { getDeviceType } from "@/shared/utils/Functions";
import clsx from "clsx";
import { SearchParams } from "next/dist/server/request/search-params";
import { headers } from "next/headers";
import Client, { NotFoundClient } from "./client";
import styles from "./page.module.css";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { paymentKey, orderId, amountStr, amount } = await searchParams;
  const res = await requester.tossSuccess({
    paymentKey,
    orderId,
    amount,
  });
  const payload = res?.content ?? res?.data ?? res;
  if (payload.ok && payload?.payment?.metadata?.json) {
    const data = JSON.parse(payload.payment.metadata.json);
    const copy = { ...payload.payment };
    delete copy.metadata;
    data.payment = copy;

    const { content } = await requester.createOrder(data);
    return <Client order={content} />;
  }
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  const deviceType = getDeviceType(userAgent);
  return (
    <VerticalFlex className={styles.wrapper}>
      <P className={clsx(styles.title, styles[deviceType])}>
        {payload?.message || "알 수 없는 오류가 발생했습니다."}
      </P>
      <NotFoundClient deviceType={deviceType} />
    </VerticalFlex>
  );
}
