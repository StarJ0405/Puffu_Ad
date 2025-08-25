import Div from "@/components/div/Div";
import { requester } from "@/shared/Requester";
import { Params } from "next/dist/server/request/params";
import { notFound } from "next/navigation";
import {
  Footer,
  ProductDetail,
  ProductHeader,
  ProductInfo,
  Question,
  Review,
  Shipping,
} from "./client";
import styles from "./page.module.css";
import { useStore } from "@/providers/StoreProvider/StorePorivder";

export default async function ({ params }: { params: Promise<Params> }) {
  const { storeData } = await useStore();
  const { product_id } = await params;
  if (!product_id) return notFound();
  const initCondition = {
    relations: [
      "brand.methods",
      "variants.values",
      "variants.product",
      "options.values",
    ],
  };
  const initProduct = await requester.getProduct(
    product_id as string,
    initCondition
  );
  if (!initProduct?.content || initProduct.content.store_id !== storeData?.id)
    return notFound();

  return (
    <>
      <ProductInfo initProduct={initProduct} initCondition={initCondition} />
      <Div className={styles.lineWrapper}>
        <Div className={styles.line} />
      </Div>
      <Shipping initProduct={initProduct} />
      <Div className={styles.block} />
      <ProductHeader />
      <ProductDetail initProduct={initProduct} />
      <Div className={styles.block} />
      <Review />
      <Div className={styles.block} />
      <Question />
      <Footer initProduct={initProduct} initCondition={initCondition} />
    </>
  );
}
