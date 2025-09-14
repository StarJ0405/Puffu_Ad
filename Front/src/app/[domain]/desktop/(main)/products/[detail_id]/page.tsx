import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import { Params } from "next/dist/server/request/params";
import { notFound } from "next/navigation";
import {
  DetailTabContainer,
  MiniInfoBox,
  DetailFrame,
  ProductSlider,
} from "./client";
import styles from "./page.module.css";
import { log } from "@/shared/utils/Functions";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";

export default async function ({ params }: { params: Promise<Params> }) {
  const { detail_id } = await params;
  const initCondition = {
    relations: [
      "brand.methods",
      "variants.values",
      "variants.product.discounts.discount",
      "variants.discounts.discount",
      "options.values",
    ],
  };
  const initProduct = await requester.getProduct(
    detail_id as string,
    initCondition
  );
  if (!initProduct?.content?.id) return notFound();
  const { userData } = await useAuth();
  if (userData?.id) {
    requester.addRecent({
      user_id: userData.id,
      detail_id,
    });
  }
  const relationProducts = await requester.getProducts({
    category_id: initProduct.content.category_id,
    pageSize: 24,
  });
  // console.log('상품 정보', relationProducts);

  return (
    <section className="root">
      <Container
        className={clsx("page_container", styles.detail_container)}
        marginTop={100}
      >
        <DetailFrame initCondition={initCondition} initProduct={initProduct} />

        <VerticalFlex position="relative" marginTop={40} alignItems="start">
          <FlexChild marginBottom={20}>
            <h3 className={clsx("SacheonFont", styles.slide_title)}>
              보시는 상품과 비슷한 추천 상품
            </h3>
          </FlexChild>

          <ProductSlider id={"relation"} lineClamp={1} listArray={relationProducts.content} />
        </VerticalFlex>

        <HorizontalFlex marginTop={30} alignItems="start" gap={40}>
          <VerticalFlex className={styles.contents_container} width={850}>
            <DetailTabContainer initCondition={initCondition} initProduct={initProduct} />
          </VerticalFlex>

          <MiniInfoBox initCondition={initCondition} initProduct={initProduct} />
        </HorizontalFlex>
      </Container>
    </section>
  );
}
