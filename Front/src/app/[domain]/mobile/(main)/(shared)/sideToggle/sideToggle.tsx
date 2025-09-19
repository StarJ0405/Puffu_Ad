"use client";
import Button from "@/components/buttons/Button";
import TopButton from "@/components/buttons/TopButton";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import styles from "./sideToggle.module.css";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

// import AdminChatModal from "@/modals/adminChat/adminChat";
import FlexChild from "@/components/flex/FlexChild";
import AdminChat from "@/modals/adminChat/adminChat";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useEffect, useState } from "react";

// const navigate = useNavigate();

{
  /* 사이드 네비 */
}
export default function SideToggle() {
  const { userData } = useAuth();
  const pathname = usePathname();
  const [chatToggle, setChatToggle] = useState(false);

  const [date, setDate] = useState(new Date());

  const chatToggleClick = () => {
    setDate(new Date());
    setChatToggle((prev) => !prev);
  };

  useEffect(() => {
    if (chatToggle) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [chatToggle]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav id={styles.sideNavi}>
      <FlexChild
        className={clsx(styles.Btn_frame, scrolled ? styles.scroll : "")}
      >
        <div className={clsx(styles.chat_btn, { [styles.hidden]: chatToggle })}>
          <TopButton />
        </div>
      </FlexChild>

      <AnimatePresence>
        {chatToggle && (
            <motion.div
               key="chat"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
               style={{
                  
               }}
            >
               <AdminChat
               // onOpen={chatToggle}
               starts_at={date}
               reload={() => setDate(new Date())}
               onClose={() => setChatToggle(false)}
               />
            </motion.div>
         )
        }
      </AnimatePresence>
      {/* 채팅 토글 */}

      {pathname == "/" && (
        <Button
          className={clsx(styles.chat_btn, { [styles.hidden]: chatToggle })}
          hidden={!userData?.id}
          onClick={() => chatToggleClick()}
        >
          <Image
            src={"/resources/images/footer/chat_toggle_icon.png"}
            width={45}
          />
        </Button>
      )}
    </nav>
  );
}
