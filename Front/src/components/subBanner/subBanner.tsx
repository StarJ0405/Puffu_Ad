"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import Link from "next/link";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import styles from "./subBanner.module.css";
import { requester } from "@/shared/Requester";

type MiniBannerItem = {
  name: string;
  link: string;
  thumbnail: { pc: string; mobile: string };
  index: number;
};

export default function SubBanner({
  index,
  storeId,
  width,
  height = "auto",
  variant = "pc",
}: {
  index: number;
  storeId?: string;
  width: number | string;
  height?: number | string;
  variant?: "pc" | "mobile";
}) {
  const { userData } = useAuth();
  const [item, setItem] = useState<MiniBannerItem | null>(null);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!storeId) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("SubBanner: storeId 미지정");
        }
        return;
      }
      try {
        const res = await requester.getStoreMiniBanners(storeId);
        const items: MiniBannerItem[] = res?.items ?? [];
        const picked =
          Number.isInteger(index) && index >= 0 && index < items.length
            ? items[index]
            : null;
        if (alive) setItem(picked);
      } catch {
        if (alive) setItem(null);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [storeId, index]);

  if (!storeId || !item) {
    return <div className={styles.banner_wrapper} style={{ width, height }} />;
  }

  const href = item.link || "#";
  const src =
    (variant === "mobile" ? item.thumbnail?.mobile : item.thumbnail?.pc) ||
    "/resources/images/no-img.png";
  const canClick = !!item.link && !!userData?.adult;

  return (
    <div className={styles.banner_wrapper} style={{ width, height }}>
      <FlexChild width={"100%"}>
        {userData?.adult ? (
          canClick ? (
            <Link href={href} className={styles.enabled}>
              <Image src={src} width={"100%"} height={"auto"} />
            </Link>
          ) : (
            <Image src={src} width={"100%"} height={"auto"} />
          )
        ) : (
          <Image
            src={"/resources/images/19_only_sub_banner_pc.png"}
            width={"100%"}
            height={"auto"}
          />
        )}
      </FlexChild>
    </div>
  );
}
