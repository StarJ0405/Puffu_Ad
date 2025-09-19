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
        initial={{ opacity: 0, x: 20}}
        animate={{ opacity: 1, x: 0}}
        exit={{opacity: 0, x: 20}}
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
