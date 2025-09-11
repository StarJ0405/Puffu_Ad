import { Params } from "next/dist/server/request/params";
import React from "react";
import BoardHeader from "./boardHeader";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { boardType } = await params; // 비동기 해제
  const hideHeader = boardType === "photoReview";

  return (
    <section className="root page_container">
      {!hideHeader && <BoardHeader />}
      {children}
    </section>
  );
}
