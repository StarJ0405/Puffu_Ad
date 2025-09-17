import { Params } from "next/dist/server/request/params";
import React from "react";
import BoardHeader from "./boardHeader";

export default async function ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {

  return (
    <section className="root page_container">
      {/* <BoardHeader /> */}
      {children}
    </section>
  );
}
