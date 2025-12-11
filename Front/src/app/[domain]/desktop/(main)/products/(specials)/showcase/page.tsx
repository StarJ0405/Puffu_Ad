import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Pstyles from "../../products.module.css";
import { BestList, CategoryTab, ReviewSection, } from "./client";
import styles from "./page.module.css";
import Image from "@/components/Image/Image";
import { requester } from "@/shared/Requester";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category_id } = await searchParams;

  const initCondition: any = {
    pageSize: 24,
    _excludeType: true,
    warehousing: true,
  };

  if (category_id) {
    initCondition.category_id = category_id;
  }

  const categoryProducts = await requester.getProducts(initCondition);

  return (
    <section className="root page_container">
      <Container marginTop={80}>
        <VerticalFlex>
          <ReviewSection category_id={category_id as any} />
        </VerticalFlex>

        <VerticalFlex>
          <CategoryTab category_id={category_id as any} />
        </VerticalFlex>

        <VerticalFlex className={Pstyles.list}>
          <BestList
            initProducts={categoryProducts}
            initConiditon={initCondition}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
