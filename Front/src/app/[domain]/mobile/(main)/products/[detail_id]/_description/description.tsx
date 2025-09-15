'use client'
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import styles from './description.module.css';
import sanitizeHtml from "sanitize-html";
import Button from "@/components/buttons/Button";
import { useState } from "react";
import clsx from "clsx";

export default function Description({product} : {product : any}) {

   const cleanHTML = sanitizeHtml(product.detail, {
     allowedTags: ["p", "b", "i", "strong", "em", "img", "ul", "li", "ol"],
     allowedAttributes: {
       img: ["src", "alt"],
     },
   });

   const [viewFull, setViewFull] = useState(false);

   return (
      <>
         <VerticalFlex className={styles.description_box}>
            <FlexChild className={clsx(styles.description_frame, {[styles.full]: viewFull})} alignItems="start">
               <div className={styles.detail_thumb_box} dangerouslySetInnerHTML={{ __html: cleanHTML }} />
            </FlexChild>
            <Button 
               className={clsx(styles.view_more_btn, {[styles.hidden]: viewFull})}
               onClick={()=> setViewFull(true)}
            >
               자세히 보기
            </Button>
         </VerticalFlex>
      </>
   )

}