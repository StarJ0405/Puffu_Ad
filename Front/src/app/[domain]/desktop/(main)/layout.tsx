import React from "react";
import Header from './(shared)/Header/header'
import Footer from './(shared)/Footer/footer'

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{minWidth: '1300px'}}>
      {/*  */}
      <Header />
      {children}
      <Footer />
      {/*  */}
    </div>
  );
}
