"use client";

import Center from "@/components/center/Center";
import VerticalFlex from "@/components/flex/VerticalFlex";
import P from "@/components/P/P";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { requester } from "@/shared/Requester";
import { AnimatePresence, motion } from "framer-motion";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
export default function ({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userData } = useAuth();
  useEffect(() => {
    if (!userData?.id && pathname !== "/" && !pathname.startsWith("/auth"))
      redirect(`/auth/login?redirect_url=${pathname}`);
  }, [userData, pathname]);

  useEffect(() => {    
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    // <Wating>
    <AnimatePresence mode="wait">
      <motion.div
        id="motion"
        key={pathname}
        initial={{ opacity: 0 }}
        // x: -20
        animate={{ opacity: 1 }}
        // transition={{ duration: 0.2, ease: "easeInOut" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/*  */}
        {children}
        {/*  */}
      </motion.div>
    </AnimatePresence>
    //  </Wating>
  );
}

export function Wating({ children }: { children: React.ReactNode }) {
  const interval = useRef<any>(null);
  const [active, setActive] = useState<boolean>(true);
  const [key, setKey] = useState<string>();
  const lastRef = useRef<Date>(new Date());
  const [waiting, setWaiting] = useState<number>();
  useEffect(() => {
    if (active) {
      requester.getConnection({}, (res: any) => {
        setWaiting(res.waiting);
        if (res.key) setKey(res.key);
      });
    } else {
      requester.deleteConnection({ key }, () => setKey(undefined));
    }
  }, [active]);
  useEffect(() => {
    if (key) {
      clearInterval(interval.current);
      interval.current = setInterval(() => {
        if (
          new Date().getTime() >=
          (lastRef.current?.getTime() || 0) + 1000 * 15 * 1
        ) {
          setActive(false);
          clearInterval(interval.current);
        } else
          requester.getConnection({ key }, (res: any) => {
            setWaiting(res.waiting);
            if (res.key) setKey(res.key);
          });
      }, 1000 * 15);
    }
  }, [key]);

  useEffect(() => {
    const _key = key;
    const updateLast = () => {
      lastRef.current = new Date();
      if (!_key) setActive(true);
    };
    window.addEventListener("mousemove", updateLast);
    window.addEventListener("touchstart", updateLast);
    window.addEventListener("touchend", updateLast);

    return () => {
      window.removeEventListener("mousemove", updateLast);
      window.removeEventListener("touchstart", updateLast);
      window.removeEventListener("touchend", updateLast);
    };
  }, [key]);
  if (typeof waiting === "undefined") return children;
  return (
    <Center height={"100dvh"}>
      <VerticalFlex backgroundColor={"#fff"} color="#111">
        <P>대기열 서비스 안내</P>
        <P>원활한 접속을 위해 대기열에 등록되었습니다.</P>
        <P>잠시만 기다려주시면 접속한 순서대로 자동 이동합니다.</P>
        <P>남은 대기자수 : {waiting + 1}</P>
        <P>새로 고침시 처음부터 대기해야합니다.</P>
      </VerticalFlex>
    </Center>
  );
}
