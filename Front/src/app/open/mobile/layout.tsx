import VerticalFlex from "@/components/flex/VerticalFlex";
import React from "react";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <VerticalFlex height={"100dvh"} overflow="scroll" id="scroll">
      {children}
    </VerticalFlex>
  );
}
