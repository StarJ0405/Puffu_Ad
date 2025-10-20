import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import styles from "./page.module.css";

import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";
import { BaseProductList } from "../products/baseClient";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const initCondition = {
    q,
    pageSize: 12,
    warehousing: "all",
  };
  const initProducts = await requester.getProducts(initCondition);

  return (
    <section className="mob_root">
      <VerticalFlex
        className="mob_page_container"
        marginTop={80}
        paddingBottom={40}
      >
        <VerticalFlex className={styles.title_box}>
          <h3>"{q}" 검색결과</h3>
          <P>
            {initProducts?.NumberOfTotalElements || 0}개의 상품이
            검색되었습니다.
          </P>
        </VerticalFlex>
        <VerticalFlex className={styles.list}>
          <BaseProductList
            id="search"
            initCondition={initCondition}
            initProducts={initProducts}
          />
        </VerticalFlex>
      </VerticalFlex>
    </section>
  );
}
