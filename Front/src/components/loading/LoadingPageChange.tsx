"use client";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./LoadingPageChange.module.css";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Div from "@/components/div/Div";

export default function LoadingPageChange() {
  return (
   <AnimatePresence mode="wait">
      <motion.div
        id="motion"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
         <VerticalFlex className={styles.element} gap={20} alignItems="center" justifyContent="center">
            <FlexChild width={'auto'}>
               <Image
                  src={"/resources/images/header/logo.png"}
                  width={200}
                  marginBottom={5}
                />
            </FlexChild>
            <FlexChild justifyContent="center" alignItems="end" gap={10}>
               <P lineHeight={1}>로딩중</P>
               <FlexChild width={'auto'} className={styles.dote_ani}>
                  <Div className={styles.dote}></Div>
                  <Div className={styles.dote}></Div>
                  <Div className={styles.dote}></Div>
               </FlexChild>
            </FlexChild>
         </VerticalFlex>
      </motion.div>
    </AnimatePresence>
  );
}
