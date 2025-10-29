import VerticalFlex from "@/components/flex/VerticalFlex";
import clsx from "clsx";
import { Client } from "./client";
import styles from "./page.module.css";

export default async function () {
  
  return (
    <>
      <VerticalFlex className={clsx(styles.wrapper, 'mob_page_container')}>
        <Client />
      </VerticalFlex>
    </>
  );
}
