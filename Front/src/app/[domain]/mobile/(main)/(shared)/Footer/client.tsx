"use client";
import Button from "@/components/buttons/Button";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import TopButton from "@/components/buttons/TopButton";
import styles from "./footer.module.css";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
// import AdminChatModal from "@/modals/adminChat/adminChat";
import { useState } from "react";

// const navigate = useNavigate();

{/* 사이드 네비 */}
export function SideToggle() {

  const pathname = usePathname();

  return (
    <nav id={styles.sideNavi}>
      <TopButton />
      <ChatToggle />
    </nav>
  );
}


export function ChatToggle() {

  const [chatToggle, setChatToggle] = useState(false);

  const chatToggleClick = () => {
    setChatToggle(prev => !prev)
  }

  return (
    <Button
    className={styles.chat_btn}
    // onClick={() => {NiceModal.show(AdminChatModal)}}
    onClick={()=> chatToggleClick()}
    >
      <Image src={"/resources/images/footer/chat_toggle_icon.png"} width={56} />
    </Button>
  );
}


