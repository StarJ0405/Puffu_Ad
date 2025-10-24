"use client";

import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { AnimatePresence, motion } from "framer-motion";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userData } = useAuth();
  useEffect(() => {
    if (!userData?.id && pathname !== "/" && !pathname.startsWith("/auth"))
      redirect(`/auth/login?redirect_url=${pathname}`);
  }, [userData, pathname]);

  useEffect(() => {
    // 일부 페이지 로딩되면 상단으로 이동 안해서 추가함
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
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
  );
}
