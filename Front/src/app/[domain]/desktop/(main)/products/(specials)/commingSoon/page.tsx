import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";
import Pstyles from "../../products.module.css";
import { CommingSoonList } from "./client";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;
  const newCondition: any = {
    pageSize: 24,
    order: "new",
    warehousing: true,
  };
  if (category_id) newCondition.category_id = category_id;

  const newProducts = await requester.getProducts(newCondition);

  return (
    <section className="root">
      <Container className="page_container" marginTop={80}>
        <VerticalFlex className={Pstyles.title_box}>
          <h3>입고예정</h3>
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <CommingSoonList
            initProducts={newProducts}
            initConiditon={newCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
