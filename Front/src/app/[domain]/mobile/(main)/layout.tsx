import React from "react";
import BottomNavi from "./(shared)/BottomNavi/bottomNavi";
import Footer from "./(shared)/Footer/footer";
import Header from "./(shared)/Header/header";
import QuickMenu from "@/components/quickMenu/QuickMenu";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className='mob_wrap'>
      {/*  */}
      <Header />
      {children}
      <Footer />
      <BottomNavi />
      <QuickMenu />
      {/*  */}
    </section>
  );
}
