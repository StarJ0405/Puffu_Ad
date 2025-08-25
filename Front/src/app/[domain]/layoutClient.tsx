"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        id="motion"
        key={pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
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
