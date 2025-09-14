import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Link from "next/link";
import { Auth, HeaderBottom, SearchBox, CartLength } from "./client";
import styles from "./header.module.css";

export default async function Header() {

  return (
    <>
      <header className={styles.header}>
        <HorizontalFlex
          className="page_container"
          alignItems="end"
          marginBottom={35}
        >
          <FlexChild gap={20}>
            <FlexChild className={styles.logo}>
              <Link href="/">
                <Image
                  src="/resources/images/header/logo.png"
                  width={150}
                  height={"auto"}
                />
              </Link>
            </FlexChild>
            <SearchBox /> {/* 검색창 */}
          </FlexChild>

          <FlexChild width={"auto"} className={styles.info_box}>
            <VerticalFlex gap={20} alignItems="end">
              <Auth />

              <HorizontalFlex width={"auto"} gap={10}>
                <FlexChild>
                  <Link href={"/mypage"}>
                    <Image
                      src="/resources/icons/main/user_icon.png"
                      width={28}
                      height={"auto"}
                      cursor="pointer"
                    />
                  </Link>
                </FlexChild>

                <FlexChild>
                  <Link href={"/orders/cart"} className={styles.cart_btn}>
                    <Image
                      src="/resources/icons/main/cart_icon.png"
                      width={30}
                      height={"auto"}
                      cursor="pointer"
                    />
                    <CartLength />
                  </Link>
                </FlexChild>

                <FlexChild>
                  <Link href={"/mypage/wishList"}>
                    <Image
                      src="/resources/icons/main/product_heart_icon.png"
                      width={30}
                      height={"auto"}
                      cursor="pointer"
                    />
                  </Link>
                </FlexChild>
              </HorizontalFlex>
            </VerticalFlex>
          </FlexChild>
        </HorizontalFlex>

        <HeaderBottom />
      </header>
    </>
  );
}
