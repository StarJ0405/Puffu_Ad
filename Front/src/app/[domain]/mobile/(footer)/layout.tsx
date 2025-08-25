import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import React from "react";
import { FooterSlot } from "./layoutClient";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <VerticalFlex height={"100dvh"}>
      {/*  */}
      {children}
      {/*  */}
      <Footer />
    </VerticalFlex>
  );
}

interface FooterSlotProps {
  src: string;
  active: string;
  name: string;
  paths: string[];
  bans: string[];
  requireLogin?: boolean;
  to?: string;
}
function Footer() {
  const slots: FooterSlotProps[] = [
    {
      src: "/resources/icons/category.png",
      active: "/resources/icons/category_black.png",
      name: "카테고리",
      paths: [],
      bans: [],
    },
    {
      src: "/resources/icons/QR.png",
      active: "/resources/icons/QR_black.png",
      name: "QR스캔",
      paths: [],
      bans: [],
      // requireLogin: true,
    },
    {
      src: "/resources/icons/home.png",
      active: "/resources/icons/home_black.png",
      name: "홈",
      paths: ["/"],
      bans: [],
      to: "/",
    },
    {
      src: "/resources/icons/my.png",
      active: "/resources/icons/my_black.png",
      name: "마이",
      paths: [],
      bans: [],
      // requireLogin: true,
    },
    {
      src: "/resources/icons/recent.png",
      active: "/resources/icons/recent_black.png",
      name: "최근 본 상품",
      paths: [],
      bans: [],
      // requireLogin: true,
    },
  ];
  return (
    <FlexChild boxShadow="0px -1px 6px 0px #0D0D0D1A" padding={15} height={70}>
      {slots.map((slot, index) => (
        <FooterSlot
          key={`slot_${index}`}
          src={slot.src}
          active={slot?.active}
          name={slot.name}
          paths={slot.paths}
          bans={slot.bans}
          requireLogin={slot?.requireLogin}
          to={slot.to}
        />
      ))}
    </FlexChild>
  );
}
