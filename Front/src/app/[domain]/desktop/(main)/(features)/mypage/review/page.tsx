import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { Params } from "next/dist/server/request/params";
import Container from "@/components/container/Container";
import styles from "./page.module.css";
import mypage from "../mypage.module.css";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Button from "@/components/buttons/Button";
import Link from "next/link";
import Span from "@/components/span/Span";
import clsx from "clsx";

import { ReviewList } from "./client";
import NoContent from "@/components/noContent/noContent";

export default async function () {

  return (
    <>
      <VerticalFlex className={clsx(mypage.box_frame, styles.delivery_box)} gap={35}>
        <FlexChild className={mypage.box_header}>
          <P>리뷰 관리</P>
          <FlexChild className={mypage.header_subTitle}>
            <P>전체 리뷰 56</P>
          </FlexChild>
        </FlexChild>

        <ReviewList />
      </VerticalFlex>
    </>
  );
}
