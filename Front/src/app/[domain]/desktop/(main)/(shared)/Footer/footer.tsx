import siteInfo from "@/shared/siteInfo";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";
import QuickMenu from "@/components/quickMenu/QuickMenu";
import styles from "./footer.module.css";
import clsx from "clsx";

export default async function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <HorizontalFlex className="page_container">
          <VerticalFlex className={styles.info_box} alignItems="start">
            <Image
              src={"/resources/images/footer/footer_logo.png"}
              width={140}
              className={styles.footer_logo}
            />

            <VerticalFlex alignItems={"start"} className={styles.text_box}>
              <FlexChild className={styles.policy_item}>
                <Link href={"/policies/term"}>이용약관</Link>
                <Span>|</Span>
                <Link href={"/policies/privacy"}>개인정보처리방침</Link>
              </FlexChild>

              <VerticalFlex alignItems="start" className={styles.info_dt}>
                <FlexChild className={styles.txt_item}>
                  <Span>{siteInfo.company}</Span>
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
              </VerticalFlex>

            </VerticalFlex>
          </VerticalFlex>

          <FlexChild className={styles.cs_box} alignItems="start">
            <VerticalFlex className={clsx(styles.item, styles.cs_item)} alignItems="inherit">
              <h5>고객센터</h5>
              <P className={styles.tel_number}>{siteInfo.cs_number}</P>
              <VerticalFlex className={styles.ct_box} alignItems="inherit">
                <P>평일 : {siteInfo.cs_workTime}</P>
                <P>점심시간 : {siteInfo.cs_breakTime}</P>
              </VerticalFlex>
            </VerticalFlex>

            <VerticalFlex className={clsx(styles.item, styles.pay_item)} alignItems="inherit">
              <h5>무통장 계좌 정보</h5>
              <VerticalFlex className={styles.ct_box} alignItems="inherit">
                <P>{siteInfo.account}</P>
                <P>예금주 : {siteInfo.account_holder}</P>
              </VerticalFlex>
            </VerticalFlex>
          </FlexChild>
        </HorizontalFlex>
      </footer>

      <QuickMenu />
    </>
  );
}
