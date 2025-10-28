import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";

// import { ContentBox } from "./client";
import FlexChild from "@/components/flex/FlexChild";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Link from "next/link";
import { BoxHeader, ContentBox } from "./client";
import mypage from "../../../mypage.module.css";

export default async function () {
  
  return (
    <VerticalFlex gap={25}>
      <VerticalFlex className={clsx(mypage.box_frame, styles.manage_box)} gap={35}>
        <BoxHeader />
  
        <VerticalFlex className={clsx(styles.wrapper)}>
          <ContentBox />
        </VerticalFlex>
      </VerticalFlex>

      <FlexChild gap={20}>
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
            <P>구독 해지</P>

            <Image
              src={"/resources/icons/arrow/mypage_arrow.png"}
              width={10} height={'auto'}
            />
          </Link>
        </FlexChild>
      </FlexChild>
    </VerticalFlex>
  );
}
