import { adminRequester } from "@/shared/AdminRequester";
import { Params } from "next/dist/server/request/params";
import styles from "./page.module.css";
import Table from "./table";
export default async function ({ params }: { params: Promise<Params> }) {
  const { status } = await params;
  const start_date = new Date();
  start_date.setHours(0, 0, 0, 0);
  start_date.setDate(start_date.getDate() - 7);
  const initCondition: any = {
    pageSize: 20,
    pageNumber: 0,
    order: { display: "asc" },
    relations: ["items.brand", "address", "shipping_method", "user", "store"],
    start_date,
  };

  switch (status?.[0]) {
    case "product":
      initCondition.status = "pending";
      break;
    case "ready":
      initCondition.status = "fulfilled";
      break;
    case "shipping":
      initCondition.status = "shipping";
      break;
    case "completed":
      initCondition.status = "complete";
      break;
    case "cancel":
      initCondition.status = "cancel";
      break;
  }
  const initData: Pageable = (await adminRequester.getOrders(
    initCondition
  )) as Pageable;

  const initStores = await adminRequester.getStores();
  return (
    <div className={styles.container}>
      <Table
        initStores={initStores}
        initData={initData}
        initCondition={initCondition}
        status={status?.[0]}
      />
    </div>
  );
}
