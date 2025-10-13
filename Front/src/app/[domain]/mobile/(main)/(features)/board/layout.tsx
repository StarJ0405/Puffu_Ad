import { Params } from "next/dist/server/request/params";
import React from "react";
import BoardHeader from "./boardHeader";
import SubPageHeader from "@/components/subPageHeader/subPageHeader";

export default async function ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {

  return (
    <>
      <SubPageHeader />
      <section className="mob_root mob_page_container">
        {/* <BoardHeader /> */}
        {children}
      </section>
    </>
  );
}
