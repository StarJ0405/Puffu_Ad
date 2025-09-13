import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import mypage from "../mypage.module.css";

import clsx from "clsx";
import styles from "./page.module.css";
// import boardStyle from "../../boardGrobal.module.css"

import { requester } from "@/shared/Requester";
import { DeliveryTable } from "./client";
// import { useState } from "react";

export default async function () {
  const initAddresses = await requester.getAddresses();
  // const [pickTab, setPickTab] = useState(false);

  return (
    <>
      <VerticalFlex
        className={clsx(mypage.box_frame, styles.delivery_box)}
        gap={35}
      >
        <FlexChild className={mypage.box_header}>
          <P>배송지 관리</P>
        </FlexChild>

        <HorizontalFlex className={styles.top_box}>
          <FlexChild className={styles.all_txt}>
            <P>전체 배송지</P>
            <Span>({initAddresses?.content?.length || 0}건)</Span>
          </FlexChild>

          <FlexChild className={styles.add_btn}>
            <Button
            // onClick={()=>{}}
            >
              배송지 추가
            </Button>
          </FlexChild>
        </HorizontalFlex>

        <DeliveryTable initAddresses={initAddresses} />
      </VerticalFlex>
    </>
  );
}
