"use client"
import Image from "@/components/Image/Image";
import Span from "@/components/span/Span";
import styles from "./ProductLoadBtn.module.css";
import Button from "./Button";
import FlexChild from "@/components/flex/FlexChild";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";
import clsx from "clsx";



function ProductLoadBtn (
{
   maxPage,
   page,
   loading,
   showMore
} : {
   maxPage : number;
   page : number;
   loading : boolean;
   showMore : () => void;
}) {

   const {isMobile} = useBrowserEvent();

   return (
      <Button
         className={clsx(!isMobile ? styles.list_more_btn : styles.mob_list_more_btn)}
         hidden={maxPage < 1 || page >= maxPage}
         disabled={loading}
         onClick={showMore}
         >
         <FlexChild gap={6} justifyContent="center">
            <Span>{loading ? '불러오는 중' : '상품 더보기'}</Span>
            <Image
               src={"/resources/icons/arrow/arrow_bottom_icon.png"}
               width={10}
            />
         </FlexChild>
      </Button>
   )
}

export default ProductLoadBtn;