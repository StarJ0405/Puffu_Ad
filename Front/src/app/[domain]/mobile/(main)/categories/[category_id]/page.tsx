import Container from "@/components/container/Container";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { requester } from "@/shared/Requester";
import { Params } from "next/dist/server/request/params";
import { BaseProductList } from "../../products/baseClient";
import { TitleBox } from "./client";
import Pstyles from "../../products/products.module.css";
import clsx from "clsx";

export default async function ({ params }: { params: Promise<Params> }) {
  const { category_id } = await params;

  const initCondition = {
    category_id,
    pageSize: 12,
  };

  const initProducts = await requester.getProducts(initCondition);

  return (
    <section className="mob_root mob_page_container">
      <Container marginTop={40}>
        <TitleBox category_id={category_id} />

        <VerticalFlex className={clsx(Pstyles.list)}>
          <BaseProductList
            id="categories"
            initCondition={initCondition}
            initProducts={initProducts}
          />
        </VerticalFlex>
      </Container>
    </section>
  );
}
