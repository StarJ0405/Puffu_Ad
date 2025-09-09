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
import ProductCard from "@/components/card/ProductCard";
import style from "./page.module.css";
import Input from "@/components/inputs/Input";



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
               header: 'web_select',
               placeholder: 'web_select_placholder',
               line: 'web_select_line',
               arrow: 'web_select_arrow',
               search: 'web_select_search',
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


export function AgreeInfo() {
   return (
      <VerticalFlex alignItems="start">
         <article>
            <P className={style.list_title}>이용약관 동의</P>
         </article>

         <VerticalFlex className={style.agree_list}>
            <HorizontalFlex className={style.agree_item}>
               <FlexChild width={'auto'}>
                  <Span>전체 이용약관 동의</Span>
               </FlexChild>

               <Span className={style.more_btn}>자세히보기</Span>
            </HorizontalFlex>

            <HorizontalFlex className={style.agree_item}>
               <FlexChild width={'auto'}>
                  <Span>[필수] 구매조건 확인 및 결제진행 동의</Span>
               </FlexChild>

               <Span className={style.more_btn}>자세히보기</Span>
            </HorizontalFlex>

            <HorizontalFlex className={style.agree_item}>
               <FlexChild width={'auto'}>
                  <Span>[필수] 개인정보 수집 및 이용 동의</Span>
               </FlexChild>

               <Span className={style.more_btn}>자세히보기</Span>
            </HorizontalFlex>
         </VerticalFlex>

         <P>귀하의 정보는 안전하게 보호되고 손상되지 않으며, 당사의 개인정보 보호정책에 따라서만 처리됩니다.</P>
      </VerticalFlex>
   )
} 