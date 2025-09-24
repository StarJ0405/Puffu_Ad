"use client"
import FlexChild from "@/components/flex/FlexChild";
import { useCart } from "@/providers/StoreProvider/StorePorivderClient";
import { useEffect, useState } from "react";
import styles from './countBadge.module.css'
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import clsx from "clsx";

export default function CountBadge(
   {
      top, 
      right, 
      left, 
      bottom,
      className
   }
   : {
      top?: string,
      right?: string, 
      left?: string, 
      bottom?: string,
      className?: string,
   }) {
  const { cartData } = useCart();
  const [length, setLength] = useState<number>(0);
  const {isMobile} = useBrowserEvent();

  useEffect(() => {
    setLength(cartData?.items.length ?? 0);
  }, [cartData]);
  
  return (
    <>
      {
         length > 0 && (
            <div
               className={clsx(
                  !isMobile ? styles.cart_length_pc : styles.cart_length_mob,
                  className
               )}
               style={{
                  top: top,
                  right: right,
                  left: left,
                  bottom: bottom,
               }}
            >
              {length}
            </div>
         )
      }
   </>
  )
}