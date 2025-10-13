"use client";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import styles from "./LoadingCard.module.css";
import { useEffect } from "react";
import clsx from "clsx";
// lineClamp 구별해주기, TestProdcutCard는 임시로 만든거임. 나중에 프로덕트카드에 스타일만 입히면 됨.
// 라인클램프는 제목태그에 달아서 속성 주기.

export function LoadingCard() {
  
  return (
    <VerticalFlex
      className={styles.loading_card}
    >
      <FlexChild className={styles.thumb}></FlexChild>
      <FlexChild className={styles.content}></FlexChild>
      <FlexChild className={styles.content}></FlexChild>
    </VerticalFlex>
  );
}

export default LoadingCard;
