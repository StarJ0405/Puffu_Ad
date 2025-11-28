import VendorAuthProvider from "@/providers/VendorAuthProiveder/VendorAuthProvider";
import ModalProvider from "@/providers/ModalProvider/ModalProvider";
import React from "react";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <VendorAuthProvider>
      <ModalProvider>
        {/*  */}
        {children}
        {/*  */}
      </ModalProvider>
    </VendorAuthProvider>
  );
}
