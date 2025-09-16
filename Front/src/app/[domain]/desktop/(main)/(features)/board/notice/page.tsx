import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from "../boardGrobal.module.css";

import { requester } from "@/shared/Requester";
import { BoardTable, BoardTitleBox } from "./client";

export default async function () {
  const initCondition = { type: "일반", pageSize: 10 };
  const initNotices = await requester.getNotices(initCondition);

  return (
    <>
      <VerticalFlex className={boardStyle.board_frame}>
        <BoardTitleBox />
        <BoardTable initCondition={initCondition} initNotices={initNotices} />
      </VerticalFlex>
    </>
  );
}
