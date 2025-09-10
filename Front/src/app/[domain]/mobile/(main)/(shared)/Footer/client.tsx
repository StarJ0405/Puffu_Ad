"use client";
import Button from "@/components/buttons/Button";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Image from "@/components/Image/Image";
import styles from "./footer.module.css";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
// import AdminChatModal from "@/modals/adminChat/adminChat";
import { useState } from "react";

// const navigate = useNavigate();


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


