"use client";
import Image from "@/components/Image/Image";
import Button from "@/components/buttons/Button";
import TopButton from "@/components/buttons/TopButton";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Link from "next/link";
import styles from "./sideNavi.module.css";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { usePathname } from "next/navigation";
import FlexChild from "@/components/flex/FlexChild";
import AdminChat from "@/modals/main/adminChat/adminChat";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import { requester } from "@/shared/Requester";
import useData from "@/shared/hooks/data/useData";
import { useEffect, useState } from "react";
import P from "@/components/P/P";
import { useCart } from "@/providers/StoreProvider/StorePorivderClient";
import CountBadge from "@/components/countBadge/countBadge";


// const navigate = useNavigate();

{
  /* 사이드 네비 */
}
export default function SideNavi() {
  const { userData } = useAuth();

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
              <Link href={"/orders/cart"}>
                장바구니
                <CountBadge right={'10px'} top={'50%'} className={styles.sideNavi_count} />
              </Link>
            </li>

            <li>
              <Link href={"/mypage/wishList"}>관심리스트</Link>
            </li>

            <li>
              <Link href={"/board/inquiry"}>1:1문의</Link>
            </li>
          </ul>
        </VerticalFlex>

        <TopButton />
      </nav>

      {userData?.id && userData?.role !== "admin" && <ChatToggle />}
    </>
  );
}


export function CartLength() {
  const { cartData } = useCart();
  const [length, setLength] = useState<number>(0);

  useEffect(() => {
    setLength(cartData?.items.length ?? 0);
  }, [cartData]);
  
  return (
    <>
    {
      length > 0 && (
        <FlexChild className={styles.cart_length}>
          {length}
        </FlexChild>
      )
    }
    </>
  )
}

export function ChatToggle() {
  const controls = useAnimation();
  const { userData } = useAuth();
  const [date, setDate] = useState(new Date());
  const [chatToggle, setChatToggle] = useState(false);

  const chatToggleClick = () => {
    setChatToggle((prev) => !prev);
  };
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
  useEffect(() => {
    if (chatroom && date.getTime() < new Date(chatroom?.created_at).getTime()) {
      setDate(new Date());
    }
  }, [date, chatroom]);
  useEffect(() => {
    if (chatToggle) controls.start({ opacity: 1, display: "initial" });
    else controls.start({ opacity: 0, display: "none" });
  }, [chatToggle]);
  return (
    <FlexChild className={styles.chat_btn}>
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

      <button hidden id="reload_read" onClick={() => reload_read()} />
      <FlexChild position="relative">
        <P className={styles.chat_number} hidden={!chatroom?.unread}>
          {Math.min(99, chatroom?.unread || 0)}
        </P>
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
    </FlexChild>
  );
}
