import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from '../../boardGrobal.module.css';
import styles from './page.module.css';

import { DetailFrame, BoardTable } from "./client";
import { CommentFrame } from "./comment/commentList";

export default async function () {

   return (
      <VerticalFlex className={boardStyle.board_frame}>
         <FlexChild className={boardStyle.board_titleBox}>
            {/* <h3>공지사항</h3> */}
         </FlexChild>

         <FlexChild>
            <DetailFrame />
         </FlexChild>

         {/* <FlexChild>
            <CommentFrame />
         </FlexChild> */}


         {/* 일단 보류*/}
         {/* <FlexChild marginTop={60}>
            <BoardTable />
         </FlexChild> */}
      </VerticalFlex>
   )


}