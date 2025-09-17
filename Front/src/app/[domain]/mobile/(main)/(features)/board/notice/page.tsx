import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from "../boardGrobal.module.css";

import { requester } from "@/shared/Requester";
import { BoardTable, SearchBox } from "./client";

export default async function () {
  const initCondition = { type: "일반", pageSize: 10 };
  const initNotices = await requester.getNotices(initCondition);

  return (
    <>
      <VerticalFlex className={boardStyle.board_frame}>
        <BoardTable initCondition={initCondition} initNotices={initNotices} />
        <SearchBox />
      </VerticalFlex>
    </>
  );
}
