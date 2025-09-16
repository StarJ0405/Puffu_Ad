"use client"
import FlexChild from "@/components/flex/FlexChild";
import { useCart } from "@/providers/StoreProvider/StorePorivderClient";
import { useEffect, useState } from "react";
import styles from './subPageHeader.module.css'


export function CartLength() {
  const { cartData } = useCart();
  const [length, setLength] = useState<number>(0);

  useEffect(() => {
    setLength(cartData?.items.length ?? 0);
  }, [cartData]);
  
  return (
    <FlexChild className={styles.cart_length}>
      {length}
    </FlexChild>
  )
}