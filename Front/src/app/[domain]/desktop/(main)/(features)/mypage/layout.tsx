import React from "react";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="desktop_container">
      {/*  */}
      <></>
      {children}
      {/*  */}
    </section>
  );
}
