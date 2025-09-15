"use client"
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import Span from "@/components/span/Span";
import style from "./TopButton.module.css";

function TopButton () {

   const onTopButtonClick: React.MouseEventHandler<HTMLDivElement> = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

   return (
      <VerticalFlex className={style.topToggleBtn} onClick={onTopButtonClick}>
         <Image src={'/resources/icons/arrow/arrow_bottom_icon.png'} width={13} />
         <Span>TOP</Span>
      </VerticalFlex>
   )
}

export default TopButton;