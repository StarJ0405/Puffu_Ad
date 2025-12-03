import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { adminRequester } from "@/shared/AdminRequester";
import Link from "next/link";
import {
  AlmostOutStockProduct,
  ChoiceToggleMenu,
  OutOfStock,
  ProductStatus,
} from "./dashboard";
import styles from "./page.module.css";
export default async function () {
  // const Status = { list: 0, sale: 0, min: 0, hide: 0 };
  const Status = await adminRequester.getProducts({
    _type: "status",
  });
  const Stock = await adminRequester.getVariants({
    _type: "outOfStock",
    pageSize: 3,
    order: {
      stack: "asc",
    },
  });
  const Almost = await adminRequester.getVariants({
    _type: "almostOutOfStock",
    pageSize: 3,
    order: {
      stack: "asc",
    },
  });
  const stores: any = await adminRequester.getStores({
    order: { created_at: "ASC" },
  });
  return (
    <Container padding={20} width={"100%"} maxWidth={'var(--maxWidthDesktop, 1274px)'} margin={"0 auto"}>
      <VerticalFlex gap={20} flexStart={true}>
        <ProductStatus Status={Status} />

        <HorizontalFlex gap={15} justifyContent={"flex-start"}>
          <FlexChild width="49.4%">
            <OutOfStock Stock={Stock} />
          </FlexChild>
          <FlexChild width="49.4%">
            <AlmostOutStockProduct Almost={Almost} />
          </FlexChild>
        </HorizontalFlex>
        <HorizontalFlex
          gap={15}
          justifyContent={"flex-start"}
          flexWrap={"wrap"}
        >
          <Link
            href="/product/regist"
            style={{
              width: "calc(100% / 4 - 12px)",
            }}
          >
            <FlexChild className={styles.itemBox}>
              <ChoiceToggleMenu
                title="상품등록"
                content="쇼핑몰에 판매할 상품 등록"
                icon={"/resources/images/productRegister_2.png"}
              />
            </FlexChild>
          </Link>
          <Link
            href="/product/management"
            style={{
              width: "calc(100% / 4 - 12px)",
            }}
          >
            <FlexChild className={styles.itemBox}>
              <ChoiceToggleMenu
                title="상품관리"
                content="등록된 상품 관리 페이지"
                icon={"/resources/images/productManagement2_2.png"}
              />
            </FlexChild>
          </Link>
          <Link
            href="/product/stock"
            style={{
              width: "calc(100% / 4 - 12px)",
            }}
          >
            <FlexChild className={styles.itemBox}>
              <ChoiceToggleMenu
                title="재고관리"
                content="재고수량 편집 및 관리"
                icon={"/resources/images/inventoryControl_2.png"}
              />
            </FlexChild>
          </Link>
          <FlexChild width="calc(100% / 4 - 12px)" className={styles.itemBox}>
            <ChoiceToggleMenu
              title="카테고리 관리"
              content="상품 카테고리 수정 및 추가"
              icon={"/resources/images/category_2.png"}
              name="categories"
              data={{ stores: stores.content }}
            />
          </FlexChild>
          <FlexChild width="calc(100% / 4 - 12px)" className={styles.itemBox}>
            <ChoiceToggleMenu
              title="메인 진열 관리"
              content="메인 페이지에 등록된 상품 관리"
              icon={"/resources/images/mainProductManagement.png"}
              name="confirm"
            />
          </FlexChild>
        </HorizontalFlex>
      </VerticalFlex>
    </Container>
  );
}
