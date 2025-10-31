import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";

import FlexChild from "@/components/flex/FlexChild";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { CheckConfirm, ContentBox } from "./client";

export default async function () {
  return (
    <>
      <VerticalFlex className={clsx(styles.wrapper)}>

        <article className={clsx(styles.bg, styles.heart)}>
          <Image
            src={"/resources/icons/mypage/subscription_heart.png"}
          />
        </article>

        <article className={clsx(styles.bg, styles.gift1)}>
          <Image
            src={"/resources/images/mypage/subscription_gift.png"}
          />
        </article>

        <article className={clsx(styles.bg, styles.gift2)}>
          <Image
            src={"/resources/images/mypage/subscription_gift.png"}
          />
        </article>

        <FlexChild className={styles.title} justifyContent="center">
          <P className={clsx('GmarketFont')}>
            연 4만원대로 매월 <br/> 누리는 풍성한 혜택!
          </P>
        </FlexChild>

        <VerticalFlex className={styles.content_container}>
          <ContentBox />
  
          <FlexChild className={styles.itemBox} justifyContent="center">
            <VerticalFlex className={styles.txt_list}>
              <FlexChild className={styles.item}>
                <P>결제 후에 언제든지 구독 취소 가능</P>
              </FlexChild>
  
              <FlexChild className={styles.item}>
                <P>해지 시 연간 결제액보다 적게 사용한 경우 차액 계산하여 환급</P>
              </FlexChild>
  
              <FlexChild className={styles.item}>
                <P>해지 후엔 언제든 다시 재가입 가능!</P>
              </FlexChild>
            </VerticalFlex>
          </FlexChild>
        </VerticalFlex>
  
        <FlexChild className={styles.payment_check} width={'auto'}>
          <P>
            <Span>※</Span> 결제 방식은 수동 결제이며 결제일 이후 <br/> 다음 결제일 한달 전에 알림
          </P>
        </FlexChild>


        <CheckConfirm />

      </VerticalFlex>
    </>
  );
}
