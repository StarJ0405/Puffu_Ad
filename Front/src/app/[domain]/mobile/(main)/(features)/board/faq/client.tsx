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
import { usePathname } from "next/navigation";
import Span from "@/components/span/Span";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import { useAuth } from "@/providers/AuthPorivder/AuthPorivderClient";
import useData from "@/shared/hooks/data/useData";
import useNavigate from "@/shared/hooks/useNavigate";
import { requester } from "@/shared/Requester";
import NiceModal from "@ebay/nice-modal-react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "@/components/card/dummyProductCard";
import style from "./page.module.css";
import Input from "@/components/inputs/Input";


const pathname = usePathname();

function linkTabActive() {
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
