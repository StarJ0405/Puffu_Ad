import React from "react";
import BottomNavi from "./(shared)/BottomNavi/bottomNavi";
import Footer from "./(shared)/Footer/footer";
import Header from "./(shared)/Header/header";

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
