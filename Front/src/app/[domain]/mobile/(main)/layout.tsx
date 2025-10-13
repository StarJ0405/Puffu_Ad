import React from "react";
import BottomNavi from "./(shared)/BottomNavi/bottomNavi";
import Footer from "./(shared)/Footer/footer";
import Header from "./(shared)/Header/header";
import SideToggle from "./(shared)/sideToggle/sideToggle";

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
      <SideToggle />
      {/*  */}
    </section>
  );
}
