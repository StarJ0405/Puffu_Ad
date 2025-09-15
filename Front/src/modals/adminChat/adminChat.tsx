"use client";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import styles from './adminChat.module.css'
import VerticalFlex from "@/components/flex/VerticalFlex";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/container/Container";
import FlexChild from "@/components/flex/FlexChild";
import P from "@/components/P/P";
import Image from "@/components/Image/Image";
import Input from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";
import clsx from "clsx";


export default function AdminChat({ onClose }: { onClose: () => void }) {
   return (
      <VerticalFlex className={styles.chat_modal}>
         <FlexChild className={styles.title_header}>
            <P>관리자 문의하기</P>

            <Image 
               src={'/resources/icons/modal_close_icon.png'} cursor="pointer" width={20}
               onClick={onClose}
            />
         </FlexChild>

         <FlexChild>
            <VerticalFlex className={styles.chat_body}>
               <FlexChild className={clsx(styles.admin_chat, styles.bubble_wrap)}>
                  <FlexChild className={styles.chat_bubble}>
                     <P>
                        안녕하세요 푸푸토이입니다.질문을 적어주시면 몇분 내 답변을 받으실
                        수 있습니다. 어떤 서비스 관련 문의사항이 있으실까요?
                     </P>
                  </FlexChild>

                  <FlexChild className={styles.date}>
                     <P>2025-08-01 A.M 11:37</P>
                  </FlexChild>
               </FlexChild>

               <FlexChild className={clsx(styles.user_chat, styles.bubble_wrap)}>
                  <FlexChild className={styles.chat_bubble}>
                     <P>
                        안녕하세요. 문의사항이 있습니다.
                     </P>
                  </FlexChild>

                  <FlexChild className={styles.date}>
                     <P>2025-08-01 A.M 11:37</P>
                  </FlexChild>
               </FlexChild>
            </VerticalFlex>
         </FlexChild>

         <FlexChild className={styles.write_board}>
            <FlexChild>
               <Image src={'/resources/icons/board/chat_file_upload.png'} width={39} />
            </FlexChild>
            <FlexChild className={styles.chat_input}>
               <Input type="text" width={'100%'} placeHolder="메시지를 입력하세요..." />
            </FlexChild>
            <FlexChild>
               <Button className={styles.chat_btn}>전송</Button>
            </FlexChild>
         </FlexChild>
      </VerticalFlex>
   );
}
