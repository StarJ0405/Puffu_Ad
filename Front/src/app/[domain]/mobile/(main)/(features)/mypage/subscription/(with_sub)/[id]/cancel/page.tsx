import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";
import { requester } from "@/shared/Requester";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import Image from "@/components/Image/Image";
import Span from "@/components/span/Span";
import { ContentBox, ConfirmBtn } from "./client"
import { Params } from "next/dist/server/request/params";

export default async function ({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const sub = await requester.getMySubscribes({
    id: id,
    activeOnly: false,
  });

  const initSubscribe  = Array.isArray(sub?.content) ? sub.content?.[0] ?? null : sub?.content ?? null;

  return (
    <>
      <VerticalFlex className={clsx(styles.wrapper, 'mob_page_container')}>

        <VerticalFlex className={styles.title_box}>
          <P className={styles.title}>
            연간 회원권을 <br /> 정말 해지하시겠어요?
          </P>

          <P className={styles.text1}>
            해지하시게 되면 해지 이후부터 아래 혜택들을 <br />
            더 이상 이용하실 수 없습니다.
          </P>
        </VerticalFlex>

        <ContentBox initSubscribe={initSubscribe} />

        <VerticalFlex className={styles.cancel_giude}>
          <P className={styles.text1}>해지하신 이후에도 구독권은 언제든지 다시 <br /> 구매하실 수 있습니다.</P>

          <FlexChild className={styles.giude_unit} justifyContent="center">
            <P>
              해지 시 연간 결제 금액보다 혜택을 적게 <br />
              사용하셨을 경우 차액만큼 고객님께 돌려드려요.
            </P>
          </FlexChild>
        </VerticalFlex>

        <ConfirmBtn initSubscribe={initSubscribe} />

      </VerticalFlex>
    </>
  );
}
