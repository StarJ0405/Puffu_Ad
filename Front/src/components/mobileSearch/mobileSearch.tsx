"use client";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import styles from './mobileSearch.module.css'
import VerticalFlex from "@/components/flex/VerticalFlex";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import useNavigate from "@/shared/hooks/useNavigate";
import Div from "@/components/div/Div";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";


export default function MobileSearch({onClose}: {onClose : (isClosed: boolean) => void}) {

   const { isMobile } = useBrowserEvent();
   const [value, setValue] = useState("");
   const navigate = useNavigate();

   const handleSearch = () => {
     if (value.trim()) {
       navigate(`/search?q=${value}`);
     }
   };

   const latestSearch = () => {
      if(value.trim()) {
         const stored = JSON.parse(localStorage.getItem('recentSearches') || "[]");

         const updated = [value, ...stored.filter((item: string) => item !== value)];

         const limited = updated.slice(0,5);

         localStorage.setItem("recentSearches", JSON.stringify(limited));

         navigate(`/search?q=${value}`);
      }
   }

   // 일괄 삭제
   const [recentSearches, setRecentSearches] = useState<string[]>([]);

   useEffect(() => {
     const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
     setRecentSearches(stored);
   }, []);

   // 개별 삭제
   const removeSearch = (word: string) => {
      const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");

     // 클릭한 word만 제외
     const updated = stored.filter((item: string) => item !== word);

     // localStorage & state 동기화
     localStorage.setItem("recentSearches", JSON.stringify(updated));
     setRecentSearches(updated);
   };

   return (
      <Div className={styles.search_wrap}>
         <VerticalFlex className={clsx('mob_page_container', styles.search_frame)}>
            <FlexChild className={styles.frame_header}>
               <FlexChild cursor="pointer" width={'auto'} onClick={()=> onClose(true)}>
                  <Image src={'/resources/icons/arrow/slide_arrow.png'} width={12} />
               </FlexChild>
   
               <FlexChild gap={10} className={`searchInput_Box ${styles.search_Box}`}>
                  <input
                     type="search"
                     placeholder="2025 신제품"
                     value={value}
                     onChange={(e) => setValue(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           onClose(true);
                           latestSearch();
                           handleSearch();
                        }
                     }}
                  />
   
                  <Image
                     src="/resources/images/header/input_search_icon.png"
                     width={18}
                     height="auto"
                     cursor="pointer"
                     onClick={()=>{
                        onClose(true);
                        latestSearch();
                     }}
                  />
               </FlexChild>
            </FlexChild>
   
            <VerticalFlex className={styles.latest_search_box}>
               <HorizontalFlex height={'auto'}>
                  <FlexChild width={'auto'}>
                     <P color="#fff" size={14}>최근 검색어</P>
                  </FlexChild>
   
                  <FlexChild 
                     className={styles.delete} 
                     width={'auto'}
                     onClick={() => {
                       localStorage.removeItem("recentSearches");
                       setRecentSearches([]);
                     }}
                  >
                     <P size={13} weight={600} color="#595959">전체삭제</P>
                  </FlexChild>
               </HorizontalFlex>
   
               <VerticalFlex className={styles.latest_list}>
                  {
                     recentSearches.map((word, i) => {
                        return (
                           <HorizontalFlex className={styles.item} key={i}>
                              <FlexChild
                                 onClick={() => {
                                   setValue(word);
                                   navigate(`/search?q=${word}`);
                                   onClose(true);
                                 }}
                              >
                                 <P color="#ccc" size={14}>{word}</P>
                              </FlexChild>
   
                              <FlexChild onClick={() => removeSearch(word)}>
                                 <Image src="/resources/icons/closeBtn.png" width={11} />
                              </FlexChild>
                           </HorizontalFlex>
                        )
                     })
                  }
               </VerticalFlex>
            </VerticalFlex>
         </VerticalFlex>
      </Div>
   );
}
