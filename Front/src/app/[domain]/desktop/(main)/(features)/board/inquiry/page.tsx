import VerticalFlex from "@/components/flex/VerticalFlex";

// import style from './inquiry.module.css'
import boardStyle from '../boardGrobal.module.css';

import { BoardTable, BoardTitleBox } from "./client";

export default async function InquiryBoard() {

   return (
      <>
         <VerticalFlex className={boardStyle.board_frame}>
            <BoardTitleBox />
            <BoardTable />
         </VerticalFlex>
      </>
   )


}