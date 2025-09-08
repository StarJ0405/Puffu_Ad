import AuthProvider from "@/providers/AuthPorivder/AuthPorivder";
import ModalProvider from "@/providers/ModalProvider/ModalProvider";
import React from "react";
import LayoutClient from "./layoutClient";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ModalProvider>
        <LayoutClient>
          {/*  */}
          {children}
          {/*  */}
        </LayoutClient>
      </ModalProvider>
    </AuthProvider>
  );
}
