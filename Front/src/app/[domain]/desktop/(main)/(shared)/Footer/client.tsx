"use client";
import Button from "@/components/buttons/Button";
import Image from "@/components/Image/Image";
import styles from "./footer.module.css";

// const navigate = useNavigate();

export function ChatToggle() {
  return (
    <Button
    className={styles.chat_btn}
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
