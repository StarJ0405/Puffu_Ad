import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from "../boardGrobal.module.css";

import { BoardTable, BoardTitleBox } from "./client";

export default async function () {

   return (
      <>
         <VerticalFlex className={boardStyle.board_frame}>
            <BoardTitleBox />
            <BoardTable />
         </VerticalFlex>
      </>
   )


}