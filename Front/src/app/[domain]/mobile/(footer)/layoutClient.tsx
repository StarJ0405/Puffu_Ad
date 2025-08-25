"use client";

import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

export function FooterSlot({
  src,
  active,
  name,
  paths,
  bans,
  requireLogin = false,
  to,
}: {
  src: string;
  active?: string;
  name: string;
  paths: string[];
  bans: string[];
  requireLogin?: boolean;
  to?: string;
}) {
  const path = usePathname();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const isActive =
    paths.some((_path) =>
      _path.includes("*")
        ? _path.split("*")[0].startsWith(path)
        : _path === path
    ) &&
    !bans.some((_ban) =>
      _ban.includes("*") ? _ban.split("*")[0].startsWith(path) : _ban === path
    );
  return (
    <FlexChild
      onClick={() => {
        if (requireLogin && !userData) {
          NiceModal.show("confirm", {
            confirmText: "로그인하기",
            cancelText: "취소",
            message: "로그인이 필요합니다.",
            onConfirm: () => {
              navigate("/login");
            },
          });
        } else if (to) navigate(to);
      }}
    >
      <VerticalFlex gap={12}>
        <Image src={isActive ? (active ? active : src) : src} size={18} />
        <P
          className={clsx(styles.categoryLabel, {
            [styles.active]: isActive,
          })}
        >
          {name}
        </P>
      </VerticalFlex>
    </FlexChild>
  );
}
