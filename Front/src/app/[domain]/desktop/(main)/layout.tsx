import React from "react";
import Header from './(shared)/Header/header'
import Footer from './(shared)/Footer/footer'

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/*  */}
      <Header />
      {children}
      <Footer />
      {/*  */}
    </div>
  );
}
