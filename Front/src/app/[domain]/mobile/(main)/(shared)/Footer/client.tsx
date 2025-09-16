"use client";
import Button from "@/components/buttons/Button";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import TopButton from "@/components/buttons/TopButton";
import styles from "./footer.module.css";
import Link from "next/link";
import clsx from "clsx";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
// import AdminChatModal from "@/modals/adminChat/adminChat";
import { useState, useEffect } from "react";
import FlexChild from "@/components/flex/FlexChild";
import AdminChat from "@/modals/adminChat/adminChat";

// const navigate = useNavigate();

{/* 사이드 네비 */ }
export function SideToggle() {
  const pathname = usePathname();
  const [chatToggle, setChatToggle] = useState(false);

  const chatToggleClick = () => {
    setChatToggle(prev => !prev)
  }

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

      <FlexChild className={clsx(styles.Btn_frame, (scrolled ? styles.scroll : ''))}>
        <TopButton />
      </FlexChild>


      {/* 채팅 토글 */}

      {
        pathname == "/" && (
          <>
            <Button
              className={styles.chat_btn}
              // onClick={() => {NiceModal.show(AdminChatModal)}}
              onClick={() => chatToggleClick()}
            >
              <Image src={"/resources/images/footer/chat_toggle_icon.png"} width={45} />
            </Button>
            <AnimatePresence>
              {/* {chatToggle && (
                <motion.div
                  key='chat'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AdminChat onClose={() => setChatToggle(false)} />
                </motion.div>
              )} */}
            </AnimatePresence>
          </>
        )
      }
    </nav>
  );
}


