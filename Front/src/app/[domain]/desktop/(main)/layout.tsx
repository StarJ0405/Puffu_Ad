import React from "react";
import Header from '../Header/header'
import Footer from '../Footer/footer'

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/*  */}
      <Header />
      {children}
      <Footer />
      {/*  */}
    </>
  );
}
