import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import Container from "@/components/container/Container";
import Center from "@/components/center/Center";
import Input from "@/components/inputs/Input";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";

import clsx from "clsx";
import styles from './page.module.css'
import boardStyle from '../../boardGrobal.module.css'


import { DetailFrame, CommentFrame } from "./client";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";
import InputTextArea from "@/components/inputs/InputTextArea";

export default async function () {

   const uploadFile = [
      '24hours_20250811_06_30_52.jpg',
      '46hours_20250811_06_30_51.jpg',
   ]

   return (
      <VerticalFlex className={boardStyle.board_frame}>
         <FlexChild className={boardStyle.board_titleBox}>
            <h3>공지사항</h3>
         </FlexChild>

         <VerticalFlex className={boardStyle.detail_container}>
            <VerticalFlex className={styles.board_header}>
               <HorizontalFlex className={styles.title_box}>
                  <FlexChild>
                     <P>공지사항 게시판입니다.</P>
                  </FlexChild>
   
                  <FlexChild>
                     <P>2025-08-11 14:25</P>
                  </FlexChild>
               </HorizontalFlex>
   
               <HorizontalFlex className={styles.title_box}>
                  <FlexChild>
                     <P>푸푸토이 관리자</P>
                  </FlexChild>
   
                  <FlexChild>
                     <FlexChild>
                        <P>조회수 18</P>
                     </FlexChild>
   
                     <FlexChild>
                        <P>댓글 2</P>
                     </FlexChild>
                  </FlexChild>
               </HorizontalFlex>

               <HorizontalFlex>
                  <VerticalFlex>
                     {
                        uploadFile.map((item, i)=> (
                           <FlexChild key={i}>
                              <P>첨부파일 : {item}</P>
                           </FlexChild>
                        ))
                     }
                  </VerticalFlex>

                  <FlexChild>
                     <FlexChild> {/* 공유 버튼 */}
                        <Image src={'/resources/icons/main/share_icon.png'} width={35} />
                     </FlexChild>

                     <FlexChild className={styles.button_group}>
                        <Button className={styles.delete_btn}>삭제</Button>
                        <Button className={styles.edit_btn}>수정</Button>
                     </FlexChild>
                  </FlexChild>
               </HorizontalFlex>
            </VerticalFlex>

            <VerticalFlex className={styles.content_box}>
               <FlexChild>
                  <P>공지사항 안내문입니다. 공지사항이니까 댓글은 달 수 없습니다. 감사합니다.</P>
               </FlexChild>

               <FlexChild>
                  {
                     uploadFile.map((item, i)=> (
                        <Image key={i} src={'/resources/images/dummy_img/product_05.png'} width={'100%'} />
                     ))
                  }
               </FlexChild>
            </VerticalFlex>

            <FlexChild>
               <Button className={styles.list_btn}>목록으로</Button>
            </FlexChild>
         </VerticalFlex>

         <FlexChild>
            <VerticalFlex className={styles.Comment_Frame}>
               <HorizontalFlex>
                  <FlexChild>
                     <P>댓글 2</P>
                  </FlexChild>
               </HorizontalFlex>

               <VerticalFlex className={styles.comment_list}>
                  <VerticalFlex className={styles.list_item}>
                     <HorizontalFlex>
                        <FlexChild className={styles.name}>
                           <P>이름</P>
                        </FlexChild>

                        <FlexChild className={styles.date}>
                           <P>2025-08-01 16:02:32</P>
                        </FlexChild>
                     </HorizontalFlex>

                     <FlexChild className={styles.content}>
                        <P>잘 알겠습니다. 감사합니다.</P>
                     </FlexChild>
                  </VerticalFlex>

                  <VerticalFlex className={clsx(styles.list_item, styles.reply_item)}>
                     <HorizontalFlex>
                        <FlexChild>
                           <Image src={'/resources/icons/board/comment_reply_icon.png'} width={24} />
                        </FlexChild>
                        <FlexChild className={styles.name}>
                           <P>이름</P>
                        </FlexChild>

                        <FlexChild className={styles.date}>
                           <P>2025-08-01 16:02:32</P>
                        </FlexChild>
                     </HorizontalFlex>

                     <FlexChild className={styles.content}>
                        <P>안녕하세요</P>
                     </FlexChild>
                  </VerticalFlex>
               </VerticalFlex>

               <VerticalFlex className={styles.comment_write}>
                  <FlexChild>
                     <P>댓글쓰기</P>
                  </FlexChild>

                  <FlexChild>
                     <FlexChild>
                        <InputTextArea />
                     </FlexChild>

                     <FlexChild>
                        <Button className={styles.post_btn}>등록</Button>
                     </FlexChild>
                  </FlexChild>
               </VerticalFlex>
            </VerticalFlex>
         </FlexChild>

         {/* <CommentFrame /> */}
         {/* 게시판 불러오기 */}
      </VerticalFlex>
   )


}