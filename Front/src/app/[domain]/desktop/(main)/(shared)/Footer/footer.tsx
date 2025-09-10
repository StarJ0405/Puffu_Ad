import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";
import styles from "./footer.module.css";
import { NaviMenu, ChatToggle } from "./client";

export default async function Footer() {

  return (
    <>
      <footer className={styles.footer}>
        <HorizontalFlex className="desktop_container">
          <VerticalFlex className={styles.info_box} alignItems="start">
            <Image
              src={"/resources/images/footer/footer_logo.png"}
              width={150}
              className={styles.footer_logo}
            />

            <VerticalFlex alignItems={"start"} className={styles.text_box}>
              <P>푸푸글로벌(주)</P>
              <FlexChild className={styles.txt_item}>
                <Span>대표: 염희하</Span>
                <Span>주소: 대전광역시 서구 관저중로 95번길 관저동</Span>
                <Span>이메일: puffuglobal@gmail.com</Span>
              </FlexChild>

              <FlexChild className={styles.txt_item}>
                <Span>사업자등록번호: 559-81-02488</Span>
                <Span>통신판매업신고번호: 대전광역시 서구-0308</Span>
              </FlexChild>

              <FlexChild className={styles.txt_item}>
                <Span>
                  Copyright, ⓒ 2025 puffutoy.com. All rights reserved.
                </Span>
              </FlexChild>

              <FlexChild className={styles.policy_item}>
                <Link href={"/term"}>이용약관</Link>
                <Span>|</Span>
                <Link href={"/privacy"}>개인정보처리방침</Link>
              </FlexChild>
            </VerticalFlex>
          </VerticalFlex>

          <VerticalFlex className={styles.Cs_center} alignItems={"start"}>
            <P className={styles.cs_title}>CS CENTER</P>
            <P className={styles.cs_number}>010-7627-3243</P>
            <VerticalFlex className={styles.cs_days}>
              <P>
                <Span>평일 : </Span>09:30 ~ 18:30
              </P>
              <P>
                <Span>점심시간 :</Span> 12:00 ~ 13:00
              </P>
            </VerticalFlex>
          </VerticalFlex>
        </HorizontalFlex>
      </footer>

      <NaviMenu />

      <ChatToggle />
    </>
  );
}
