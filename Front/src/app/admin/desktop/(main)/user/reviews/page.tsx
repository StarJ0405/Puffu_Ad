import { adminRequester } from "@/shared/AdminRequester";
import styles from "./page.module.css";
import Table from "./table";
export default async function () {
  const initCondition: any = {
    pageSize: 20,
    pageNumber: 0,
    relations: ["user", "item"],
    order: { idx: "desc" },
  };
  const initData: Pageable = (await adminRequester.getReviews(
    initCondition
  )) as Pageable;
  const initBestCondition: any = {
    relations: ["user", "item"],
    order: { index: "asc", idx: "desc" },
    best: true,
  };
  const initBest: Pageable = (await adminRequester.getReviews(
    initBestCondition
  )) as Pageable;

  return (
    <div className={styles.container}>
      <Table
        initData={initData}
        initCondition={initCondition}
        initBest={initBest}
        initBestCondition={initBestCondition}
      />
    </div>
  );
}
