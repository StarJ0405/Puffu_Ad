"use client";
import Button from "@/components/buttons/Button";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import ListPagination from "@/components/listPagination/ListPagination";
import NoContent from "@/components/noContent/noContent";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import clsx from "clsx";
import Link from "next/link";
import boardStyle from "../boardGrobal.module.css";
import styles from "./page.module.css";

// 게시판 리스트 -----------------------------------------------
export function ContinueGroup() {
  return (
    <FlexChild className={styles.continue_box}>
      <Button className={styles.prev_btn}>이전</Button>
      <Button className={styles.next_btn}>다음</Button>
    </FlexChild>
  );
}