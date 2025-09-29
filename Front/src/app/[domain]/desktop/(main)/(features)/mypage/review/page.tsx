import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import clsx from "clsx";
import mypage from "../mypage.module.css";
import styles from "./page.module.css";
import { Params } from "next/dist/server/request/params";
import { Client } from "./client";
import { requester } from "@/shared/Requester";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import { notFound } from "next/navigation";
import useData from "@/shared/hooks/data/useData";

export default async function ({ params }: { params: Promise<Params> }) {
  const { detail_id } = await params;
  const initCondition = {
    relations: [
      "brand.methods",
      "variants.values",
      "variants.product.discounts.discount",
      "variants.discounts.discount",
      "options.values",
      "categories",
    ],
  };
  const initProduct = await requester.getProduct(
    detail_id as string,
    initCondition
  );
  return (
    <>
      <Client initCondition={initCondition} initProduct={initProduct}/>
    </>
  );
}
