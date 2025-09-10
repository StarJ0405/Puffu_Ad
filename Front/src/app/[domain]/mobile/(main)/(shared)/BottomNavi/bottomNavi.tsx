import Image from "@/components/Image/Image";
import styles from "./bottomNavi.module.css";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Div from "@/components/div/Div";
import Link from "next/link";
import Span from "@/components/span/Span";
import clsx from "clsx";

import TopButton from "@/components/buttons/TopButton";

export default async function BottomNavi() {

   const menu1 = [ // 임시 데이터
      { name: 'BEST 상품', link: '/products/best'},
      { name: '입고예정', link: '/products/commingSoon'},
      { name: '신상품', link: '/products/new'},
      { name: '데이 핫딜', link: '/products/sales', icon: '/resources/images/header/HotDeal_icon.png'},
      { name: '랜덤박스', link: '/products/randomBox'},
   ]

   return (
      <>
         <header className={styles.header}>
            <HorizontalFlex className={clsx('page_container',styles.headerTop)}>
               <FlexChild gap={20}>
                  <FlexChild gap={10} width={'auto'} cursor="pointer">
                     <Image 
                        src='/resources/images/header/category_menu_icon.png'
                        width={18}
                     />
                  </FlexChild>

                  <FlexChild className={styles.logo}>
                     <Link href='/'>
                        <Image
                           src='/resources/images/header/logo.png'
                           width={100}
                           height={'auto'}
                        />
                     </Link>
                  </FlexChild>

               </FlexChild>

               <FlexChild width={'auto'} className={styles.info_box}>
                  <VerticalFlex gap={20} alignItems="end">
                     <HorizontalFlex width={'auto'} gap={10}>
                        <FlexChild>
                           <Image src='/resources/images/header/input_search_icon.png' width={22} cursor="pointer"/>
                        </FlexChild>

                        <FlexChild>
                           <Link href={'/orders/cart'}>
                              <Image src='/resources/icons/main/cart_icon.png' width={25} cursor="pointer"/>
                           </Link>
                        </FlexChild>
                     </HorizontalFlex>
                  </VerticalFlex>
               </FlexChild>
            </HorizontalFlex>
         </header>

         
      </>
   )
}
