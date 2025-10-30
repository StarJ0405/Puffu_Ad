import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";
import Button from "@/components/buttons/Button";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Link from "next/link";
import {ClientTxt} from './client'

export default async function () {
  
  return (
    <>
      <VerticalFlex className={clsx(styles.wrapper)}>

        <VerticalFlex className={styles.complete_box}>
          <Image
            src={"/resources/images/mypage/subscription_success_img01.png"}
            width={250}
          />

          <P className={styles.title}>
            가입이 완료되었습니다.
          </P>

          <ClientTxt />
        </VerticalFlex>

        <VerticalFlex className={styles.confirm_btn}>
          <Link href={'/'}>
            <Button className={styles.shop_btn}>
              쇼핑하러 가기
            </Button>
          </Link>

          <Link href={'/mypage/subscription/manage'}>
            <Button className={styles.manage_btn}>
              구독 관리로 이동
            </Button>
          </Link>
        </VerticalFlex>

      </VerticalFlex>
    </>
  );
}
