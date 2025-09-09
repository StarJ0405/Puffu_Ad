"use client";
import Button from "@/components/buttons/Button";
import Image from "@/components/Image/Image";
import styles from "./footer.module.css";

import NiceModal, { useModal } from "@ebay/nice-modal-react";
import ModalBase from "@/modals/ModalBase";

// const navigate = useNavigate();


// const AdminChatModal = NiceModal.create(() => {
//   const modal = useModal();

//   return (
//     <ModalBase
//       withHeader
//       title="관리자 문의하기"
//       withFooter
//       buttonText="닫기"
//       onClose={modal.remove} // 닫기 연동
//     >
//       <div style={{ padding: 20 }}>
//         <p>이곳에 원하는 내용을 넣을 수 있습니다.</p>
//       </div>
//     </ModalBase>
//   );
// });


export function ChatToggle() {
  return (
    <Button
    className={styles.chat_btn}
   //  onClick={() => {
   //    NiceModal.show(AdminChatModal)
   //  }}
    // onClick={() => {
      // //   if (requireLogin && !userData) {
      //     NiceModal.show("confirm", {
      //       confirmText: "로그인하기",
      //       cancelText: "취소",
      //       message: "로그인이 필요합니다.",
      //       onConfirm: () => {
      //         navigate("/login");
      //       },
      //     });
      // //   }
      // //   else if (to) navigate(to);
      // }}
    >
      <Image src={"/resources/images/footer/chat_toggle_icon.png"} width={56} />
    </Button>
  );
}


