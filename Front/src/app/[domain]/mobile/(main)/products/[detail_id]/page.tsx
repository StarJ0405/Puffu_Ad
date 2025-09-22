import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import { requester } from "@/shared/Requester";
import clsx from "clsx";
import { Params } from "next/dist/server/request/params";
import { notFound } from "next/navigation";
import {ProductSlider, ProductWrapper } from "./client";
import styles from "./page.module.css";
import SubPageHeader from "@/components/subPageHeader/subPageHeader";
import AnimationWapper from "@/components/AnimationWrapper/AnimationWapper";


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
  

  return (
    <div style={{overflow: 'hidden'}}>
      <AnimationWapper>
        <SubPageHeader />
        <ProductWrapper initCondition={initCondition} initProduct={initProduct}>
          <VerticalFlex position="relative" alignItems="start" className={styles.slide_wrap}>
            <FlexChild marginBottom={20}>
              <h3 className={clsx("SacheonFont", styles.slide_title)}>
                보시는 상품과 비슷한 추천 상품
              </h3>
            </FlexChild>
    
            <ProductSlider
              id={"relation"}
              lineClamp={2}
              listArray={relationProducts.content}
            />
          </VerticalFlex>
        </ProductWrapper>
      </AnimationWapper>
    </div>
  );
}
