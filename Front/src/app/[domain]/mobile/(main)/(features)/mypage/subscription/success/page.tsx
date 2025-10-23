import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";

// import { ContentBox } from "./client";
import Button from "@/components/buttons/Button";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Link from "next/link";

export default async function () {
  
  return (
    <>
      <VerticalFlex className={clsx(styles.wrapper, 'mob_page_container')}>

        <VerticalFlex className={styles.complete_box}>
          <Image
            src={"/resources/images/mypage/subscription_success_img01.png"}
            width={135}
          />

          <P className={styles.title}>
            결제가 완료되었습니다.
          </P>

          <P className={styles.text1}>
            이제부터 전제품 <strong>10% 할인</strong> + <br/>
            매월 프리머니 <strong>1만원 쿠폰</strong> 지급 <br/>
            혜택을 누리실 수 있습니다.
          </P>
        </VerticalFlex>

        <VerticalFlex className={styles.confirm_btn}>
          <Link href={'/'}>
            <Button className={styles.shop_btn}>
              쇼핑하러 가기
            </Button>
          </Link>

          <Link href={'/mypage/subcription/manage'}>
            <Button className={styles.manage_btn}>
              구독 관리로 이동
            </Button>
          </Link>
        </VerticalFlex>

      </VerticalFlex>
    </>
  );
}
