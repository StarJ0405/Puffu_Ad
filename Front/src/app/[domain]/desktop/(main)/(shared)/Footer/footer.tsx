import siteInfo from "@/shared/siteInfo";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";
import SideNavi from "../sideNavi/sideNavi";
import styles from "./footer.module.css";

export default async function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <HorizontalFlex className="page_container">
          <VerticalFlex className={styles.info_box} alignItems="start">
            <Image
              src={"/resources/images/footer/footer_logo.png"}
              width={150}
              className={styles.footer_logo}
            />

            <VerticalFlex alignItems={"start"} className={styles.text_box}>
              <P>{siteInfo.company}</P>
              <FlexChild className={styles.txt_item}>
                <Span>대표: {siteInfo.ceo}</Span>
                <Span>주소: {siteInfo.company_address}</Span>
                <Span>이메일: {siteInfo.email}</Span>
              </FlexChild>

              <FlexChild className={styles.txt_item}>
                <Span>사업자등록번호: {siteInfo.business_number}</Span>
                <Span>통신판매업신고번호: {siteInfo.order_business_number}</Span>
              </FlexChild>

              <FlexChild className={styles.txt_item}>
                <Span>
                  {siteInfo.copyright}
                </Span>
              </FlexChild>

              <FlexChild className={styles.policy_item}>
                <Link href={"/policies/term"}>이용약관</Link>
                <Span>|</Span>
                <Link href={"/policies/privacy"}>개인정보처리방침</Link>
              </FlexChild>
            </VerticalFlex>
          </VerticalFlex>

          <VerticalFlex
            width={390}
            className={styles.Cs_center}
            alignItems={"start"}
          >
            <P className={styles.cs_title}>CS CENTER</P>
            <P className={styles.cs_number}>{siteInfo.cs_number}</P>
            <FlexChild gap={10} alignItems="start" width={"100%"}>
              <VerticalFlex className={styles.cs_days}>
                <P>
                  <Span>평일 : </Span>{siteInfo.cs_workTime}
                </P>
                <P>
                  <Span>점심시간 :</Span> {siteInfo.cs_breakTime}
                </P>
              </VerticalFlex>

              <VerticalFlex className={styles.cs_days}>
                <P>
                  <Span>[은행계좌] {siteInfo.account} </Span> <br />
                </P>
                <P>
                  <Span>예금주 : </Span>{siteInfo.account_holder}
                </P>
              </VerticalFlex>
            </FlexChild>
          </VerticalFlex>
        </HorizontalFlex>
      </footer>

      <SideNavi />
    </>
  );
}
