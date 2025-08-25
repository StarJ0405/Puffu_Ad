"use client";
import FlexChild from "@/components/flex/FlexChild";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import useNavigate from "@/shared/hooks/useNavigate";
import { throttle } from "@/shared/utils/Functions";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import styles from "./layout.module.css";

export function Back({
  header,
  to,
}: {
  header?: React.ReactNode;
  to?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const handleScroll = useCallback((e: any) => {
    setIsScrolled(e.target.scrollTop > 7);
  }, []);
  const Header = () => {
    if (typeof header === "string") {
      return (
        <P color="#000" weight={600} size={18}>
          {header}
        </P>
      );
    } else return <>{header}</>;
  };
  useEffect(() => {
    const main = document.getElementById("scroll");

    // 스로틀링된 스크롤 핸들러
    const throttledHandleScroll = throttle(handleScroll, 50); // 100ms마다 한 번 실행

    // 컴포넌트 마운트 시 이벤트 리스너 추가
    main?.addEventListener("scroll", throttledHandleScroll);
    main?.addEventListener("scrollend", throttledHandleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 (클린업 함수)
    return () => {
      main?.removeEventListener("scroll", throttledHandleScroll);
      main?.removeEventListener("scrollend", throttledHandleScroll);
    };
  }, [handleScroll]); // handleScroll 함수가 변경될 때마다 useEffect 재실행 (여기서는 한 번만 실행될 것임)

  return (
    <FlexChild
      className={clsx(styles.mainHeader, { [styles.scrolled]: isScrolled })}
      gap={15}
    >
      <Image
        src="/resources/images/left_arrow.png"
        size={20}
        onClick={() => {
          if (to) navigate(to);
          else if (window.history.length > 2) {
            navigate(-1);
          } else navigate("/");
        }}
      />
      <Header />
    </FlexChild>
  );
}
