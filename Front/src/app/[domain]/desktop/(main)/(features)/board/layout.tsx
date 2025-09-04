import React from "react";
import BoardHeader from '../board/boardHeader'

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className={'root desktop_container'}>
      <BoardHeader />
      {children}
    </section>
  );
}

