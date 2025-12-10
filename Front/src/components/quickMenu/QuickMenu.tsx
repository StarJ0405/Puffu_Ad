"use client";
import Button from "@/components/buttons/Button";
import TopButton from "@/components/buttons/TopButton";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import styles from "./QuickMenu.module.css";

import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { usePathname } from "next/navigation";

// import AdminChatModal from "@/modals/adminChat/adminChat";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import AdminChat from "@/modals/main/adminChat/adminChat";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import { requester } from "@/shared/Requester";
import { useCallback, useEffect, useState, useRef } from "react";
import useNavigate from "@/shared/hooks/useNavigate";
import siteInfo from "@/shared/siteInfo";
import { useBrowserEvent } from "@/providers/BrowserEventProvider/BrowserEventProviderClient";

// const navigate = useNavigate();

{
  /* 사이드 네비 */
}
export default function QuickMenu() {
   const { userData } = useAuth();
   const { isMobile } = useBrowserEvent();
   const controls = useAnimation();
   const pathname = usePathname();
   const navigate = useNavigate();
   const naviRef = useRef<HTMLDivElement | null>(null);
   const [toggle, setToggle] = useState(true);
   const [chatToggle, setChatToggle] = useState(false);
   const [date, setDate] = useState(new Date());
   const { chatroom, mutate: reload_read } = useData(
      "chatroom",
      {
         open: chatToggle,
      },
      (condition) => requester.getChatroom(condition),
      {
         onReprocessing: (data) => data?.content,
      }
   );

   const chatToggleClick = () => {
         setDate(new Date());
         setChatToggle((prev) => !prev);
   };

   useEffect(() => {
      if (chatToggle) {
         document.body.style.overflow = "hidden";
         document.documentElement.style.overflow = "hidden";
         controls.start({ opacity: 1, display: "initial" });
      } else {
         document.body.style.overflow = "";
         document.documentElement.style.overflow = "";
         controls.start({ opacity: 0, display: "none" });
      }
   }, [chatToggle]);

   useEffect(() => {
      if (chatroom && date.getTime() < new Date(chatroom?.created_at).getTime()) {
         setDate(new Date());
      }
   }, [date, chatroom]);

   const isChatable = useCallback(() => {
      switch (pathname) {
         case "/":
         case "/mypage/myOrders":
         return true;
      }
      return false;
   }, [pathname]);

   const adminCheck = !!userData?.id && userData?.role !== "admin";

   const customPositionPages = ["/orders/cart"];
   const isCustomPosition = customPositionPages.includes(pathname);
   const hiddenCheck = pathname.includes("/mypage/subscription");

   // 버튼 열림/숨김 처리
   // const w = toggleBtnRef.current?.offsetWidth ?? 0;
   // toggle이 false가 된 상태일때 naviRef의 외부 영역을 클릭하면 true로 바뀜.
   useEffect(() => {
      function OutsideClickHandler(e: MouseEvent | TouchEvent) {
         if (
         !toggle &&
         naviRef.current &&
         !naviRef.current.contains(e.target as Node)
         ) {
         setToggle(true);
         }
      }

      document.addEventListener("mousedown", OutsideClickHandler);
      document.addEventListener("touchstart", OutsideClickHandler);

      return () => {
         document.removeEventListener("mousedown", OutsideClickHandler);
         document.removeEventListener("touchstart", OutsideClickHandler);
      };
   }, [toggle]);

   return (
      <>
         <nav
         ref={naviRef}
         className={clsx(
            styles.sideNavi,
            isMobile ? styles.mob_sideNavi : "",
            { [styles.customPosition]: isCustomPosition },
            { [styles.hidden]: hiddenCheck },
            toggle ? "" : styles.open
         )}
         // style={{'--navi-move': !toggle ? `${w}px` : '13px'} as React.CSSProperties}
         >
         {/* on/off 버튼 */}
         <FlexChild
            className={clsx(styles.navi_toggle_btn, !toggle ? styles.close : "")}
            onClick={() => setToggle(false)}
         ></FlexChild>

         {/* 맵 버튼 */}
         <FlexChild position="relative">
            <Button
               className={styles.location_btn}
               onClick={() => navigate(siteInfo.map_location)}
            >
               <Image
               src={"/resources/images/footer/quick_map_icon.png"}
               width={!isMobile ? 24 : 16}
               />
            </Button>
         </FlexChild>

         {/* 채팅 모달 */}
         <AnimatePresence>
            <motion.div
               key="chat"
               initial={{ opacity: 0 }}
               animate={controls}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
            >
               <AdminChat
               chatroom={chatroom}
               starts_at={date}
               onClose={() => setChatToggle(false)}
               />
            </motion.div>
         </AnimatePresence>

         {/* 채팅 버튼 */}
         {/* <button hidden id="reload_read" onClick={() => reload_read()} /> */}
         {(isChatable() && adminCheck) && (
               <FlexChild position="relative">
               <P className={styles.chat_number} hidden={!chatroom?.unread}>
                  {Math.min(99, chatroom?.unread || 0)}
               </P>
               <Button
                  id="side_chat"
                  className={clsx(styles.chat_btn, {
                     [styles.hidden]: chatToggle,
                  })}
                  hidden={!userData?.id}
                  onClick={() => chatToggleClick()}
               >
                  <Image
                     src={"/resources/images/footer/chat_toggle_icon.png"}
                     width={!isMobile ? 30 : 22}
                  />
               </Button>
               </FlexChild>
            )}
         </nav>

         <FlexChild className={clsx(styles.Btn_frame)} hidden={chatToggle}>
         <TopButton />
         </FlexChild>
      </>
   );
}
