
import VerticalFlex from "@/components/flex/VerticalFlex";
import mypage from "../mypage.module.css";
import clsx from "clsx";
import styles from "./page.module.css";

import { WishListTable } from "./client";
import { requester } from "@/shared/Requester";

export default async function () {
  const initWishList = await requester.getWishlists({
    relations: ["product", "product.brand", "product.wishlists","product.variants"],
    pageSize: 10,
  });
  return (
    <>
      <VerticalFlex
        className={clsx(mypage.box_frame, styles.delivery_box, 'mob_page_container')}
        gap={35}
      >

        <WishListTable initWishList={initWishList} />
      </VerticalFlex>
    </>
  );
}
