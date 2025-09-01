"use client"
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import MasonryGrid from "@/components/masonry/MasonryGrid";
import StarRate from "@/components/star/StarRate";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "@/components/card/ProductCard";
import style from "./TopButton.module.css";

function TopButton () {

   const onTopButtonClick: React.MouseEventHandler<HTMLDivElement> = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

   return (
      <VerticalFlex className={style.topToggleBtn} onClick={onTopButtonClick}>
         <Image src={'./resources/icons/arrow/arrow_bottom_icon.png'} width={13} />
         <Span>TOP</Span>
      </VerticalFlex>
   )
}

export default TopButton;