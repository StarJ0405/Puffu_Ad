"use client";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import useClientEffect from "@/shared/hooks/useClientEffect";
import useNavigate from "@/shared/hooks/useNavigate";
import clsx from "clsx";
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./ProductSelect.module.css";
import Image from "@/components/Image/Image";

export default function ProductSelect({
   // options,
   // value,
}: {
   // options?: 
   // value: 
}) {

   const options = [
      { id: "latest", display: "최신순" },
      { id: "best", display: "인기순" },
      // { id: "recommend", display: "추천순" },
      { id: "recommend", display: "높은 가격순" },
      { id: "recommend", display: "낮은 가격순" },
   ] as const;

   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
     console.log(e.target.value); // 👉 option의 value
   };

   return (
      <div className={styles.selectBody}>
         <select className={styles.selectBody} onChange={handleChange}>
            {
               options.map((op, i)=> (
                  <option key={i} value={op.id}>{op.display}</option>
               ))
            }
         </select>

         <Image
         src={"/resources/icons/arrow/board_arrow_bottom_icon.png"}
         width={15}
         />
      </div>
   );
}
