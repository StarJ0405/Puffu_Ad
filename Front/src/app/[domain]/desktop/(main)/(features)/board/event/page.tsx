import VerticalFlex from "@/components/flex/VerticalFlex";

import boardStyle from "../boardGrobal.module.css";

import { requester } from "@/shared/Requester";
import { BoardTitleBox, GalleryTable } from "./client";

export default async function EventBoard() {
  const initCondition = { type: "이벤트", pageSize: 10 };
  const initNotices = await requester.getNotices(initCondition);
  return (
    <>
      <VerticalFlex className={boardStyle.board_frame}>
        <BoardTitleBox />
        <GalleryTable initCondition={initCondition} initNotices={initNotices} />
      </VerticalFlex>
    </>
  );
}
