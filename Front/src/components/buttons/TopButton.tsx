"use client"
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Span from "@/components/span/Span";
import styles from "./TopButton.module.css";
import { useEffect, useState } from "react";
import clsx from "clsx";

function TopButton () {

   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
         const handleScroll = () => {
            setScrolled(window.scrollY > 0);
         };
      
         window.addEventListener("scroll", handleScroll);
         return () => window.removeEventListener("scroll", handleScroll);
      }, []);

      const onTopButtonClick: React.MouseEventHandler<HTMLDivElement> = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   return (
      <VerticalFlex className={clsx(styles.topToggleBtn, scrolled ? styles.scroll : "")} onClick={onTopButtonClick}>
         <Image src={'/resources/icons/arrow/arrow_bottom_icon.png'} width={13} />
         <Span>TOP</Span>
      </VerticalFlex>
   )
}

export default TopButton;