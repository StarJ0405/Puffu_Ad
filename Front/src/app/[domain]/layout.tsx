import AuthProvider from "@/providers/AuthPorivder/AuthPorivder";
import ModalProvider from "@/providers/ModalProvider/ModalProvider";
import StoreProvider from "@/providers/StoreProvider/StorePorivder";
import React from "react";
import LayoutClient from "./layoutClient";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <StoreProvider>
        <ModalProvider>
          <LayoutClient>
            {/*  */}
            {children}
            {/*  */}
          </LayoutClient>
        </ModalProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
