import React from "react";
import BoardHeader from "./boardHeader";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardType?: string };
}) {
  const hideHeader = params.boardType === "photoReview";

  return (
    <section className="root desktop_container">
      {!hideHeader && <BoardHeader />}
      {children}
    </section>
  );
}