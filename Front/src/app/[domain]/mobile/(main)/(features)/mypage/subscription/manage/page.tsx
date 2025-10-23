import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";

// import { ContentBox } from "./client";
import { requester } from "@/shared/Requester";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import Image from "@/components/Image/Image";
import Button from "@/components/buttons/Button";
import Span from "@/components/span/Span";
import { ContentBox } from "./client"
import Link from "next/link";

export default async function () {
  
  return (
    <>
      <VerticalFlex className={clsx(styles.wrapper, 'mob_page_container')}>

        <VerticalFlex className={styles.list}>
          <ContentBox />
  
          <FlexChild className={styles.link_btn}>
            <Link href={'/mypage/subscription/history'}>
              <P>구독 내역 확인</P>

              <Image
                src={"/resources/icons/arrow/mypage_arrow.png"}
                width={10} height={'auto'}
              />
            </Link>
          </FlexChild>
  
          <FlexChild className={styles.link_btn}>
            <Link href={'/mypage/subscription/cancel'}>
              <P>구독 서비스 해지</P>

              <Image
                src={"/resources/icons/arrow/mypage_arrow.png"}
                width={10} height={'auto'}
              />
            </Link>
          </FlexChild>
        </VerticalFlex>

      </VerticalFlex>
    </>
  );
}
