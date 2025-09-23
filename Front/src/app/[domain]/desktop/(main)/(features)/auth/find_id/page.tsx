import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivder";
import clsx from "clsx";
import Link from "next/link";
import { redirect } from "next/navigation";
import IdStepBox from "./client";
import styles from "./page.module.css";
import P from "@/components/P/P";

export default async function () {
  const { userData } = await useAuth();
  if (userData?.id) {
    redirect("/");
  }
  return (
    <>
      <section className={clsx("root ", "page_container", styles.container)}>
        <VerticalFlex className={styles.findBox}>
          <FlexChild className={styles.title_box}>
            <P>아이디 찾기</P>
          </FlexChild>

          <IdStepBox />
        </VerticalFlex>
      </section>
    </>
  );
}
