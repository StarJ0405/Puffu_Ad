import SubPageHeader from "@/components/subPageHeader/subPageHeader";
import React from "react";
import LayoutClient from "./layoutClient";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <LayoutClient>
      <SubPageHeader />
      <section className="mob_root mob_page_container">
        {/*  */}
        {children}
        {/*  */}
      </section>
    </LayoutClient>
  );
}
