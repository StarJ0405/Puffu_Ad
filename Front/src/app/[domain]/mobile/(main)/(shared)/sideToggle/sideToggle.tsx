"use client";
import Button from "@/components/buttons/Button";
import TopButton from "@/components/buttons/TopButton";
import Image from "@/components/Image/Image";
import clsx from "clsx";
import styles from "./sideToggle.module.css";

import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { usePathname } from "next/navigation";

// import AdminChatModal from "@/modals/adminChat/adminChat";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import AdminChat from "@/modals/main/adminChat/adminChat";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import { requester } from "@/shared/Requester";
import { useCallback, useEffect, useState } from "react";

// const navigate = useNavigate();

{
  /* 사이드 네비 */
}
export default function SideToggle() {
  const { userData } = useAuth();
  return <>{userData?.id && userData?.role !== "admin" && <ChatToggle />}</>;
}
function ChatToggle() {
  const controls = useAnimation();
  const { userData } = useAuth();
  const pathname = usePathname();
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

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const isChatable = useCallback(() => {
    switch (pathname) {
      case "/":
      case "/mypage/myOrders":
        return true;
    }
    return false;
  }, [pathname]);

  const customPositionPages = ["/orders/cart"];
  const isCustomPosition = customPositionPages.includes(pathname);

  const hiddenCheck = pathname.includes('/mypage/subscription');

  return (
    <nav
      id={styles.sideNavi}
      className={clsx(styles.sideNavi, 
        {[styles.customPosition]: isCustomPosition,},
        {[styles.hidden]: hiddenCheck,}
      )}
    >
      <FlexChild
        className={clsx(styles.Btn_frame, scrolled ? styles.scroll : "")}
      >
        <div className={clsx(styles.chat_btn, { [styles.hidden]: chatToggle })}>
          <TopButton />
        </div>
      </FlexChild>

      <AnimatePresence>
        <motion.div
          key="chat"
          initial={{ opacity: 0 }}
          animate={controls}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{}}
        >
          <AdminChat
            chatroom={chatroom}
            starts_at={date}
            onClose={() => setChatToggle(false)}
          />
        </motion.div>
      </AnimatePresence>
      {/* 채팅 토글 */}

      <button hidden id="reload_read" onClick={() => reload_read()} />
      {isChatable() && (
        <FlexChild position="relative">
          <P className={styles.chat_number} hidden={!chatroom?.unread}>
            {Math.min(99, chatroom?.unread || 0)}
          </P>
          <Button
            id="side_chat"
            className={clsx(styles.chat_btn, { [styles.hidden]: chatToggle })}
            hidden={!userData?.id}
            onClick={() => chatToggleClick()}
          >
            <Image
              src={"/resources/images/footer/chat_toggle_icon.png"}
              width={45}
            />
          </Button>
        </FlexChild>
      )}
    </nav>
  );
}
