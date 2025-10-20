import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import styles from "./page.module.css";

import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";
import { SearchList } from "./client";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const initCondition = {
    q,
    pageSize: 24,
    warehousing: "all", /* "all" -> 전체 검색 가능(입고예정 포함) */
  };
  const initProducts = await requester.getProducts(initCondition);

  return (
    <section className="root">
      <Container className="page_container" marginTop={80}>
        <VerticalFlex className={styles.title_box}>
          <h3>"{q}" 검색결과</h3>

          <P>
            {initProducts?.NumberOfTotalElements || 0}개의 상품이
            검색되었습니다.
          </P>
        </VerticalFlex>

        <VerticalFlex className={styles.list}>
          <SearchList
            initCondition={initCondition}
            initProducts={initProducts}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
