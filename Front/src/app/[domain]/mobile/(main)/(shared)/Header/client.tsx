"use client"
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./header.module.css";
import NiceModal from "@ebay/nice-modal-react";
import SideMenu from "./sideMenu";
import { useCart } from "@/providers/StoreProvider/StorePorivderClient";


// 햄버거 메뉴
export function SideMenuBtn() {

   const SideMenuOpen = () => {
    NiceModal.show(SideMenu);
  };

   return (
      <FlexChild gap={10} width={'auto'} cursor="pointer" onClick={SideMenuOpen}>
         <Image 
            src='/resources/images/header/category_menu_icon.png'
            width={18}
         />
      </FlexChild>
   )
}



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


interface ShopMenuItem {
   name: string;
   link: string;
   icon?: string; // menu1에 icon이 있음
}

interface HeaderBottomProps {
   menu1: ShopMenuItem[];
}

export function SearchBox() {
   return (
      <FlexChild gap={10} className={`searchInput_Box ${styles.search_Box}`}>
         <input type="search" placeholder="2025 신제품" onClick={()=> {'검색창 클릭'}} />

         <Image 
            src='/resources/images/header/input_search_icon.png'
            width={18}
            height="auto"
            cursor="pointer"
         />
      </FlexChild>
   )
}

export function HeaderBottom({menu1} : HeaderBottomProps) {

   const bottomRef = useRef<HTMLDivElement | null>(null);
   const [fixed, setFixed] = useState(false);
   const [CaOpen, SetCaOpen] = useState(false);
   const router = useRouter();

   useEffect(()=> {
      const headerScroll = () => {
         const elmt = bottomRef.current?.getBoundingClientRect();
         if (!elmt) return;
         setFixed(elmt.top <= 0);
      }

      window.addEventListener('scroll', headerScroll);
      return () => window.removeEventListener('scroll', headerScroll);

   }, [bottomRef]);

   return (
      <>
      {/* <HeaderCatgeory CaOpen={CaOpen} /> */}
      <div ref={bottomRef}></div>{/* 헤더 높이계산용 더미 */}
      <div className={`${fixed ? styles.fixed : ''}`}>
         <HorizontalFlex 
            className={clsx('page_container', styles.Menu_box)} 
         >
            <nav>
               <ul className={clsx(styles.outerMenu, styles.shop_outer)}>
                  {
                     menu1.map((item, i)=> (
                        <li key={i} onClick={() => router.push(item.link)} className="SacheonFont">
                           {item.name}
                           {item.icon ? <Image src={item.icon} width={12} /> : null}
                        </li>
                     ))
                  }
               </ul>
            </nav>
         </HorizontalFlex>
      </div>
      </>
   )
}





