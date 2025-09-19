import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";
import styles from "./footer.module.css";
import clsx from "clsx";

export default async function Footer() {

  return (
    <>
      <footer className={styles.footer}>
        <VerticalFlex className={clsx(styles.info_box, 'page_container')} alignItems="start">
          <FlexChild className={styles.policy_item}>
            <Link href={"/policies/term"}>이용약관</Link>
            <Span>|</Span>
            <Link href={"/policies/privacy"}>개인정보처리방침</Link>
          </FlexChild>

          <VerticalFlex alignItems={"start"} className={styles.text_box}>
            <P>푸푸글로벌(주)</P>
            <FlexChild className={styles.txt_item}>
              <Span>대표: 염희하</Span>
              <Span>주소: 대전광역시 서구 관저중로 95번길 관저동</Span>
            </FlexChild>

            <FlexChild className={styles.txt_item}>
              <Span>이메일: puffuglobal@gmail.com</Span>
            </FlexChild>

            <FlexChild className={styles.txt_item}>
              <Span>사업자등록번호: 559-81-02488</Span>
            </FlexChild>

            <FlexChild className={styles.txt_item}>
              <Span>통신판매업신고번호: 대전광역시 서구-0308</Span>
            </FlexChild>

            <FlexChild className={styles.txt_item}>
              <Span>
                Copyright, ⓒ 2025 puffutoy.com. All rights reserved.
              </Span>
            </FlexChild>
          </VerticalFlex>
        </VerticalFlex>
      </footer>
    </>
  );
}
