import Container from "@/components/container/Container";
import clsx from "clsx";
import style from "./page.module.css";
import SubPageHeader from "@/components/subPageHeader/subPageHeader";

import { CartWrap } from "./client";

export default async function () {
  return (
    <>
      <section className="mob_root mob_page_container">
        <Container className={clsx(style.container)}>
          <CartWrap />
        </Container>
      </section>
    </>
  );
}
