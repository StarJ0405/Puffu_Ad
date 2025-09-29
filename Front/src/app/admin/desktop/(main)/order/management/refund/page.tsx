import { adminRequester } from "@/shared/AdminRequester";
import { Params } from "next/dist/server/request/params";
import styles from "./page.module.css";
import Table from "./table";
export default async function ({ params }: { params: Promise<Params> }) {
  const initCondition: any = {
    pageSize: 20,
    pageNumber: 0,
    order: JSON.stringify({ order: { display: "asc" } }),
    relations: [
      "order.user",
      "order.items.refunds",
      "order.shipping_method",
      "order.store",
      "items.item.brand",
      "items.item.refunds",
    ],
    withDeleted: true,
    completed_at: null,
    deleted_at: null,
  };

  const initData: Pageable = (await adminRequester.getReufnds(
    initCondition
  )) as Pageable;

  const initStores = await adminRequester.getStores();
  return (
    <div className={styles.container}>
      <Table
        initStores={initStores}
        initData={initData}
        initCondition={initCondition}
      />
    </div>
  );
}
