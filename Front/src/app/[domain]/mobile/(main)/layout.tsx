import React from "react";
import Header from './(shared)/Header/header'
import Footer from './(shared)/Footer/footer'
import BottomNavi from './(shared)/BottomNavi/bottomNavi'

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
      <BottomNavi />
      {/*  */}
    </>
  );
}
