import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import { useStore } from "@/providers/StoreProvider/StorePorivder";
import { requester } from "@/shared/Requester";
import {
  Banner,
  Categorry,
  HotProducts,
  Name,
  NewProducts,
  ProductList,
  WeekProducts,
} from "./client";

export default async function () {
  const { storeData } = await useStore();
  const { userData } = await useAuth();
  const _default_condition: any = {
    relations: ["variants"],
    select: [
      "id",
      "price",
      "thumbnail",
      "title",
      "store_id",
      "created_at",
      "visible",
    ],
  };
  if (!userData || !userData?.adult) {
    _default_condition.adult = false;
  }

  const newProducts: any = await requester.getProducts({
    pageSize: 3,
    store_id: storeData.id,
    ..._default_condition,
  });
  const hotProducts: any = await requester.getProducts({
    pageSize: 3,
    store_id: storeData.id,
    ..._default_condition,
  });
  const bestProducts: any = await requester.getProducts({
    pageSize: 10,
    store_id: storeData.id,
    ..._default_condition,
  });
  const productList: any = await requester.getProducts({
    pageSize: 10,
    store_id: storeData.id,
    ..._default_condition,
  });
  return (
    <VerticalFlex id="scroll" height={"calc(100dvh - 70px)"} overflow="scroll">
      <Name />
      <FlexChild position={"relative"} zIndex={0}>
        <Banner />
      </FlexChild>
      <FlexChild padding={"13px 9px"}>
        <Categorry />
      </FlexChild>
      <FlexChild padding={15}>
        <VerticalFlex gap={12}>
          <FlexChild>
            <P fontSize={18} weight={700}>
              포인트 적립
            </P>
          </FlexChild>
          <FlexChild>
            <Image src="/resources/images/point.png" width={"100%"} />
          </FlexChild>
        </VerticalFlex>
      </FlexChild>
      {newProducts?.content?.length > 0 && (
        <FlexChild padding={15}>
          <VerticalFlex gap={12}>
            <FlexChild>
              <P fontSize={18} weight={700}>
                새로 나온 상품
              </P>
            </FlexChild>
            <FlexChild>
              <NewProducts
                initProducts={newProducts}
                initCondition={_default_condition}
              />
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      )}
      {hotProducts?.content?.length > 0 && (
        <FlexChild padding={15}>
          <VerticalFlex gap={12}>
            <FlexChild>
              <VerticalFlex gap={6}>
                <FlexChild>
                  <P fontSize={18} weight={700}>
                    당신을 위한 추천 상품
                  </P>
                </FlexChild>
                <FlexChild>
                  <P color="#8b8b8b" weight={400} size={12}>
                    <Span paddingRight={"1em"}>#실시간_인기템</Span>
                    <Span paddingRight={"1em"}>#지금_뜨는_상품</Span>
                    <Span>🔥지금 핫한 PICK</Span>
                  </P>
                </FlexChild>
              </VerticalFlex>
            </FlexChild>
            <FlexChild>
              <HotProducts
                initProducts={hotProducts}
                initCondition={_default_condition}
              />
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      )}
      {bestProducts?.content?.length > 0 && (
        <FlexChild padding={15}>
          <VerticalFlex gap={12}>
            <FlexChild>
              <P fontSize={18} weight={700}>
                이번주 BEST 상품
              </P>
            </FlexChild>
            <FlexChild>
              <WeekProducts
                initProducts={newProducts}
                initCondition={_default_condition}
              />
            </FlexChild>
          </VerticalFlex>
        </FlexChild>
      )}
      <FlexChild height={10} backgroundColor={"var(--bg-base-color)"} />
      {productList?.content?.length > 0 && (
        <FlexChild position="relative">
          <VerticalFlex paddingTop={41 - 15}>
            <FlexChild padding={15}>
              <P weight={700} fontSize={18}>
                전체 상품
              </P>
            </FlexChild>
            <ProductList
              initPorudcts={productList}
              initCondition={_default_condition}
            />
          </VerticalFlex>
        </FlexChild>
      )}
    </VerticalFlex>
  );
}
