"use client";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import styles from './adminChat.module.css'
import VerticalFlex from "@/components/flex/VerticalFlex";
import { AnimatePresence, motion } from "framer-motion";


const AdminChatModal = NiceModal.create(() => {
  const modal = useModal();

  return (
      <>
         <AnimatePresence mode="wait">
            <motion.div
               id="motion"
               // key={pathname}
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               // transition={{ duration: 0.2, ease: "easeInOut" }}
               transition={{ duration: 0.5, ease: "easeInOut" }}
            >
            
            </motion.div>
         </AnimatePresence>
      </>
  );
});

   //  <ModalBase
   //    width={'100%'}
   //    maxWidth={'470px'}
   //    height={'580px'}
   //    withHeader
   //    title={'관리자 채팅'}
   //    withFooter
   //    buttonText="닫기"
   //    onClose={modal.remove}
   //  >
   //    <VerticalFlex>
   //       1111
   //    </VerticalFlex>
   //  </ModalBase>

export default AdminChatModal;
