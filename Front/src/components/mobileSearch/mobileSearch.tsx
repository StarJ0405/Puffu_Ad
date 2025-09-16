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


export default function MobileSearch({onClose}: {onClose : ()=> void}) {

   const [value, setValue] = useState("");
   const navigate = useNavigate();

   const handleSearch = () => {
     if (value.trim()) {
       navigate(`/search?q=${value}`);
     }
   };

   const keyword = ['전기톱', '밤양갱', '냉동젤'];

   return (
      <VerticalFlex className={styles.search_frame}>
         <FlexChild className={styles.frame_header}>
            <FlexChild cursor="pointer" width={'auto'}>
               <Image src={'/resources/icons/arrow/slide_arrow.png'} width={12} />
            </FlexChild>

            <FlexChild gap={10} className={`searchInput_Box ${styles.search_Box}`}>
               <input
                  type="search"
                  placeholder="2025 신제품"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === "Enter") handleSearch();
                  }}
               />

               <Image
                  src="/resources/images/header/input_search_icon.png"
                  width={18}
                  height="auto"
                  cursor="pointer"
                  onClick={()=>handleSearch()}
               />
            </FlexChild>

            <VerticalFlex className={styles.latest_search_box}>
               <HorizontalFlex>
                  <FlexChild>
                     <P>최근 검색어</P>
                  </FlexChild>

                  <FlexChild className={styles.delete}>
                     <P>전체삭제</P>
                  </FlexChild>
               </HorizontalFlex>

               <VerticalFlex className={styles.latest_list}>
                  {
                     keyword.map((word, i) => {
                        return (
                           <HorizontalFlex className={styles.item}>
                              <FlexChild>
                                 <P>{word}</P>
                              </FlexChild>

                              <FlexChild>
                                 <Image src="/resources/icons/closeBtn.png" width={11} />
                              </FlexChild>
                           </HorizontalFlex>
                        )
                     })
                  }
               </VerticalFlex>
            </VerticalFlex>
         </FlexChild>
      </VerticalFlex>
   );
}
