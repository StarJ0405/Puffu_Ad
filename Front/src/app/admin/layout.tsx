import AdminAuthProvider from "@/providers/AdminAuthPorivder/AdminAuthPorivder";
import ModalProvider from "@/providers/ModalProvider/ModalProvider";
import React from "react";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthProvider>
      <ModalProvider>
        {/*  */}
        {children}
        {/*  */}
      </ModalProvider>
    </AdminAuthProvider>
  );
}
