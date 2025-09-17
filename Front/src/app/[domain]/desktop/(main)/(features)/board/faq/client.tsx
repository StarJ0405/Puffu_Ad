"use client"
import Input from "@/components/inputs/Input";
import Select from "@/components/select/Select";
import { usePathname } from "next/navigation";
import { useState } from "react";
import style from "./faq.module.css";




function linkTabActive() {
   const pathname = usePathname();
   if(pathname === 'notice') {
      return style.active;
   }
}

export function SelectBox() {

   const [selectedMessageOption, setSelectedMessageOption] = useState("");

//    const handleMessageOptionChange = (value) => {
//     setSelectedMessageOption(value);
//     if (value === t("enterDirectly")) {
//       setMessage("");
//       setCustomMessage("");
//     } else {
//       setMessage(value);
//     }
//   };

   return (
      <>
         <Select
            classNames={{
               search: style.requester_input_body
            }}
            options={[
               { value: "직접 입력하기", display: "직접 입력하기" },
               { value: "문 앞에 놓아주세요", display: "문 앞에 놓아주세요" },
               { value: "부재 시 연락 부탁드려요", display: "부재 시 연락 부탁드려요" },
               { value: "배송 전 미리 연락해 주세요", display: "배송 전 미리 연락해 주세요" },
            ]}
            placeholder={'선택 안함'}
            value={selectedMessageOption}
         />

         {/* 직접 입력하기 조건일때만 나타나게 작업하기 */}
         {
            selectedMessageOption && (
               <Input
                  width={'100%'}
                  className={style.direct_input}
                  // value={customMessage}
                  // onChange={(value) => {
                  //    setCustomMessage(value);
                  //    setMessage(value);
                  // }}
                  placeHolder={'배송 요청사항을 입력해 주세요.'}
                  // maxLength={50}
                  // style={{
                  //    borderRadius: "3px",
                  //    border: "1px solid #dadada",
                  // }}
               />
            )
         }
      </>
   )
}
