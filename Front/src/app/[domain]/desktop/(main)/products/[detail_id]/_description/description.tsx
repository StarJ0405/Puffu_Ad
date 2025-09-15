'use client'
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import styles from './description.module.css';
import sanitizeHtml from "sanitize-html";

export default function Description({product} : {product : any}) {

   const cleanHTML = sanitizeHtml(product.detail, {
     allowedTags: ["p", "b", "i", "strong", "em", "img", "ul", "li", "ol"],
     allowedAttributes: {
       img: ["src", "alt"],
     },
   });

   return (
      <VerticalFlex className={styles.description_box}>
         <FlexChild>
            <div className={styles.detail_thumb_box} dangerouslySetInnerHTML={{ __html: cleanHTML }} />
         </FlexChild>
      </VerticalFlex>
   )

}