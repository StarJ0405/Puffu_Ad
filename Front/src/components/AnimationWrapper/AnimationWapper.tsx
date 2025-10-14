"use client";
import { AnimatePresence, motion } from "framer-motion";

export default function (
  { children }: { children: React.ReactNode }
) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        id="motion"
        // key={pathname}
        // x: 20
        initial={{ opacity: 0,}}
        animate={{ opacity: 1,}}
        exit={{opacity: 0,}}
        // transition={{ duration: 0.2, ease: "easeInOut" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/*  */}
        {children}
        {/*  */}
      </motion.div>
    </AnimatePresence>
  )
}
