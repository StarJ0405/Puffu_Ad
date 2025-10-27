import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import styles from "./page.module.css";
import { requester } from "@/shared/Requester";
import { HistoryList } from "./client";

export default async function () {
  return (
    <>
      <VerticalFlex className={clsx(styles.wrapper, 'mob_page_container')}>
        <HistoryList/>
      </VerticalFlex>
    </>
  );
}
