'use client'

import siteInfo from "@/shared/siteInfo";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import styles from "./footer.module.css";
import { useParams, usePathname } from "next/navigation";
import Image from "@/components/Image/Image";

export default function Footer() {
  const params = useParams();
  const pathname = usePathname();

  
  const hideFooter = pathname.includes('/subscription');

  return (
    <>
      {
        !hideFooter && (
            <footer className={clsx(styles.footer)}>
            <FlexChild className={clsx(styles.logo, 'mob_page_container')}>
              <Image
                src={"/resources/images/footer/footer_logo.png"}
                width={140}
              ></Image>
            </FlexChild>

            <VerticalFlex
              className={clsx(styles.info_box, 'mob_page_container')}
              alignItems="start"
            >

              <VerticalFlex className={styles.cs_box} alignItems="start">
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

                <FlexChild className={styles.policy_item}>
                  <Link href={"/policies/term"}>이용약관</Link>
                  <Span>|</Span>
                  <Link href={"/policies/privacy"}>개인정보처리방침</Link>
                </FlexChild>
              </VerticalFlex>
      
              <VerticalFlex alignItems={"start"} className={styles.text_box}>
                  <P>{siteInfo.company}</P>
                  <P>대표: {siteInfo.ceo}</P>
                  <P>주소: {siteInfo.company_address}</P>
                  <P>이메일: {siteInfo.email}</P>
                  {/* <P>전화번호: {siteInfo.tel_number}</P> */}
                  <P>사업자등록번호: {siteInfo.business_number}</P>
                  <P>통신판매업신고번호: {siteInfo.order_business_number}</P>
      
                  <FlexChild className={styles.copy}>
                    <P>{siteInfo.copyright}</P>
                  </FlexChild>
              </VerticalFlex>
            </VerticalFlex>
            </footer>
        )
      }
    </>
  );
}
