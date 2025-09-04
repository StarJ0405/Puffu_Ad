"use client"
import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import P from "@/components/P/P";
import Select from "@/components/select/Select";
import Span from "@/components/span/Span";
import StarRate from "@/components/star/StarRate";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import useNavigate from "@/shared/hooks/useNavigate";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import style from "./footer.module.css";
import Link from "next/link";



// const navigate = useNavigate();





export function ChatToggle() {
   return (
      <Button 
         className={style.chat_btn}
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
         <Image src={'/resources/images/footer/chat_toggle_icon.png'} width={56} />
      </Button>
   )
}



