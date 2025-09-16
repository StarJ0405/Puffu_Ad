"use client";
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
import styles from "./commentList.module.css";
import boardStyle from "../../boardGrobal.module.css";
import Input from "@/components/inputs/Input";
import ListPagination from "@/components/listPagination/ListPagination";
import Link from "next/link";
import PrivacyContent from "@/components/agreeContent/privacyContent";

import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";
import InputTextArea from "@/components/inputs/InputTextArea";

// 댓글란 -----------------------------------------------
export function CommentFrame() {

   // 기능작업할땐 map 처리할테니 그거 맞춰서 개별적으로 열게 하기
   const [reply, setReply] = useState(false);

   const reply_toggle = () => {
      setReply(prev => !prev);
   }

   return (
      <VerticalFlex className={styles.comment_Frame}>
         <HorizontalFlex className={styles.comment_header}>
            <FlexChild>
               <P>댓글 2</P>
            </FlexChild>
         </HorizontalFlex>

         <VerticalFlex className={styles.comment_list} gap={20}>
            <VerticalFlex className={styles.list_item}>
               <HorizontalFlex className={styles.item_header}>
               <FlexChild className={styles.name}>
                  <P>작은곰**</P>
               </FlexChild>

               <FlexChild className={styles.date}>
                  <P>2025-08-01 16:02:32</P>
               </FlexChild>

               <FlexChild className={styles.reply_btn} onClick={()=> reply_toggle()}>
                  <Image src={'/resources/icons/board/comment_bubble_icon.png'} width={16} />
                  <P>댓글</P>
               </FlexChild>
               </HorizontalFlex>

               <FlexChild className={styles.content}>
                  <P>잘 알겠습니다. 감사합니다.</P>
               </FlexChild>

               {
                  reply && (
                     <FlexChild className={clsx(styles.toggle_write, (reply && styles.active))}>
                        <CommentWrite reply={reply} onClose={reply_toggle} />
                     </FlexChild>
                  )
               }
            </VerticalFlex>

            <VerticalFlex className={clsx(styles.list_item, styles.reply_item)}>
               <HorizontalFlex className={styles.item_header}>
                  <FlexChild>
                     <Image src={'/resources/icons/board/comment_reply_icon.png'} width={20} />
                  </FlexChild>

                  <FlexChild className={styles.name}>
                     <P>큰곰**</P>
                  </FlexChild>

                  <FlexChild className={styles.date}>
                     <P>2025-08-01 16:02:32</P>
                  </FlexChild>

                  <FlexChild className={styles.reply_btn}>
                     <Image src={'/resources/icons/board/comment_bubble_icon.png'} width={16} />
                     <P>댓글</P>
                  </FlexChild>
               </HorizontalFlex>

               <FlexChild className={styles.content}>
                  <P>안녕하세요</P>
               </FlexChild>
            </VerticalFlex>

            <FlexChild justifyContent="center">
               <ListPagination />
            </FlexChild>

         </VerticalFlex>

         <CommentWrite />
      </VerticalFlex>
   );
}


export function CommentWrite({reply, onClose} : {reply?: boolean, onClose?: ()=> void}) {
   return (
      <VerticalFlex className={styles.comment_write}>
        <HorizontalFlex>
            <FlexChild width={'auto'} gap={10}>
               {
                  reply && (
                     <Image src={'/resources/icons/board/comment_reply_icon.png'} width={15} />
                  )
               }
               <P>댓글쓰기</P>
            </FlexChild>
            
            <FlexChild width={'auto'} onClick={onClose} cursor="pointer">
               <P>닫기</P>
            </FlexChild>
        </HorizontalFlex>

        <FlexChild className={styles.comment_form}>
            <FlexChild width={'100%'}>
              <InputTextArea className={styles.content_textArea} width={'100%'} placeHolder="댓글을 입력해 주세요" />
            </FlexChild>

            <FlexChild width={'auto'}>
              <Button className={styles.post_btn}>등록</Button>
            </FlexChild>
        </FlexChild>
      </VerticalFlex>
   )
}