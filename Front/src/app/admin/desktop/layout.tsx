import Div from "@/components/div/Div";
import { useAdminAuth } from "@/providers/AdminAuthPorivder/AdminAuthPorivder";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import LayoutClient from "./layoutClient";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname");
  const searchParams = new URLSearchParams(
    headerList.get("x-searchParams") as string
  );
  const redirect_url = searchParams.get("redirect_url");

  const { userData } = await useAdminAuth();

  if (pathname === "/login") {
    if (
      userData &&
      (userData.role === "admin" || userData.role === "developer")
    ) {
      redirect(redirect_url ? String(redirect_url) : "/");
    }
  } else {
    if (
      !userData ||
      (userData.role !== "admin" && userData.role !== "developer")
    ) {
      redirect(
        `/login${
          pathname?.startsWith("/login") ? "" : `?redirect_url=${pathname}`
        }`
      );
    }
  }

  return (
    <Div minHeight={"100dvh"}>
      <LayoutClient>
        {/*  */}
        {children}
        {/*  */}
      </LayoutClient>
    </Div>
  );
}
