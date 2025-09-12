import AuthProvider from "@/providers/AuthPorivder/AuthPorivder";
import ModalProvider from "@/providers/ModalProvider/ModalProvider";
import React from "react";
import LayoutClient from "./layoutClient";
import StoreProvider from "@/providers/StoreProvider/StorePorivder";

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
