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
import ProductCard from "@/components/card/ProductCard";
import styles from "./page.module.css";
import boardStyle from "../../boardGrobal.module.css";
import Input from "@/components/inputs/Input";
import ListPagination from "@/components/listPagination/ListPagination";
import Link from "next/link";
import PrivacyContent from "@/components/agreeContent/privacyContent";


// 게시판 쓰기 -----------------------------------------------
export function BoardTitleBox() {
   return (
      <HorizontalFlex className={boardStyle.board_titleBox}>
         <FlexChild>
            {/* 여기 현재 path 주소에 맞게 이름 바뀌게 해야 함. */}
            <h3>공지사항</h3>
         </FlexChild>
      </HorizontalFlex>
   )
}

export function WriteFrame() {

   

   return (
      <VerticalFlex className={boardStyle.write_container}>
         <HorizontalFlex>
            <FlexChild>
               <FlexChild className={boardStyle.input_box}>
                  <Span>제목</Span>
                  <Input
                     type={'text'}
                     placeHolder="제목을 입력해 주세요."
                     className={boardStyle.input}
                  />
               </FlexChild>

               <FlexChild>
                  <FlexChild>
                     <CheckboxGroup name={'comment'}>
                        <label>
                           <FlexChild gap={10}>
                              <Span>댓글</Span>
                              <CheckboxChild id={'comment_Check'} />
                           </FlexChild>
                        </label>
                     </CheckboxGroup>
                  </FlexChild>

                  <FlexChild>
                     <CheckboxGroup name={'notice'}>
                        <label>
                           <FlexChild gap={10}>
                              <Span>공지사항</Span>
                              <CheckboxChild id={'notice_Check'} />
                           </FlexChild>
                        </label>
                     </CheckboxGroup>
                  </FlexChild>
               </FlexChild>
            </FlexChild>

            <FlexChild>
               <Button>임시저장</Button>
            </FlexChild>
         </HorizontalFlex>

         <FlexChild className={boardStyle.content_textArea}>
            <textarea name="" id=""></textarea>
         </FlexChild>

         <FlexChild className={boardStyle.fileUpload_box}>
            <P>이미지, 첨부파일 추가</P>
            <FlexChild>
               <FlexChild>
                  {/* 파일 첨부 버튼 onClick 걸기 */}
                  <VerticalFlex gap={5}>
                     <FlexChild className={boardStyle.thumbnail} >
                        <Image src={'/resources/images/file_unknown_thumbnail.png'} width={85} />
                     </FlexChild>
                     <P>파일 첨부</P>
                  </VerticalFlex>
                  
                  {/* 파일 드래그 영역 */}
                  <FlexChild>
                     <P>여기에 파일을 끌어놓거나 파일 첨부 버튼을 클릭하세요.</P>
                  </FlexChild>
               </FlexChild>
            </FlexChild>

               {/* 이미지 첨부 시 나오는 위치 */}
               {/* <VerticalFlex gap={5}>
                  <FlexChild className={boardStyle.thumbnail} >
                     <Image src={'/resources/images/file_unknown_thumbnail.png'} width={85} />
                  </FlexChild>
                  <P>파일명</P>
               </VerticalFlex> */}
         </FlexChild>

         <VerticalFlex className={boardStyle.privacy_box}>
            <FlexChild className={styles.title}>
               <P>개인정보 수집 동의</P>
            </FlexChild>

            <FlexChild className={styles.content}>
               <PrivacyContent />
            </FlexChild>

            <FlexChild className={styles.checkBox}>
               <CheckboxGroup name="privacy_check">
                  <FlexChild>
                     <CheckboxChild id="privacy_input" />
                     <P>개인정보수집에 동의합니다.</P>
                  </FlexChild>
               </CheckboxGroup>
            </FlexChild>
         </VerticalFlex>

         <FlexChild className={styles.button_group}>
            <Button className={styles.cancel_btn}>작성 취소</Button>
            <Button className={styles.submit_btn}>문의하기</Button>
         </FlexChild>
      </VerticalFlex>
   )
}


// 게시판 쓰기 end -----------------------------------------------
