"use client";
import Image from "@/components/Image/Image";
import Button from "@/components/buttons/Button";
import TopButton from "@/components/buttons/TopButton";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Link from "next/link";
import styles from "./sideNavi.module.css";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import FlexChild from "@/components/flex/FlexChild";
import AdminChat from "@/modals/main/adminChat/adminChat";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { useState } from "react";

// const navigate = useNavigate();

{
  /* 사이드 네비 */
}
export default function SideNavi() {
  const pathname = usePathname();

  return (
    <>
      <nav id={styles.sideNavi}>
        <VerticalFlex className={styles.outer_box}>
          <Link href={"/products/hot"} className={styles.hotDeal_link}>
            <Image
              src={"/resources/images/footer/sidenavi_hotDeal.png"}
              width={43}
            />
            <h4 className="SacheonFont">이달의 HOT딜</h4>
          </Link>

          <ul className={styles.link_list}>
            <li>
              <Link href={"/mypage"}>마이페이지</Link>
            </li>

            <li>
              <Link href={"/orders/cart"}>장바구니</Link>
            </li>

            <li>
              <Link href={"/mypage/wishList"}>위시리스트</Link>
            </li>

            <li>
              <Link href={"/board/inquiry"}>1:1문의</Link>
            </li>
          </ul>
        </VerticalFlex>

        <TopButton />
      </nav>

      <ChatToggle />
    </>
  );
}

export function ChatToggle() {
  const { userData } = useAuth();
  const [date, setDate] = useState(new Date());
  const [chatToggle, setChatToggle] = useState(false);

  const chatToggleClick = () => {
    setChatToggle((prev) => !prev);
  };

  return (
    <FlexChild className={styles.chat_btn}>
      <AnimatePresence>
        {userData?.id && chatToggle && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AdminChat
              starts_at={date}
              reload={() => setDate(new Date())}
              onClose={() => setChatToggle(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        id="side_chat"
        hidden={!userData?.id}
        onClick={() => chatToggleClick()}
      >
        <Image
          src={"/resources/images/footer/chat_toggle_icon.png"}
          width={56}
        />
      </Button>
    </FlexChild>
  );
}
