import { adminRequester } from "@/shared/AdminRequester";
import styles from "./page.module.css";
import Table from "./table";
export default async function () {
  const initCondition: any = {
    pageSize: 20,
    relations: ["user"],
  };
  const initData: Pageable = (await adminRequester.getQAs(
    initCondition
  )) as Pageable;

  return (
    <div className={styles.container}>
      <Table initData={initData} initCondition={initCondition} />
    </div>
  );
}
