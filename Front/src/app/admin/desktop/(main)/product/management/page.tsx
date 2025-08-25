import { adminRequester } from "@/shared/AdminRequester";
import styles from "./page.module.css";
import Table from "./table";
export default async function () {
  const initCondition: any = {
    pageSize: 20,
    pageNumber: 0,
    relations: [
      "variants.values",
      "variants.product",
      "store",
      "options",
      "brand",
      "category",
    ],
  };
  const initData: Pageable = (await adminRequester.getProducts(
    initCondition
  )) as Pageable;
  const initStores = await adminRequester.getStores();

  return (
    <div className={styles.container}>
      <Table
        initData={initData}
        initCondition={initCondition}
        initStores={initStores}
      />
    </div>
  );
}
