import VerticalFlex from "@/components/flex/VerticalFlex";

import boardStyle from "../boardGrobal.module.css";

import { requester } from "@/shared/Requester";
import FlexChild from "@/components/flex/FlexChild";
import { BoardTitleBox, GalleryTable } from "./client";

export default async function EventBoard() {
  const initCondition = { type: "이벤트", pageSize: 10 };
  const initNotices = await requester.getNotices(initCondition);
  return (
    <>
      <VerticalFlex className={boardStyle.board_frame}>
        {/* <BoardTitleBox /> */}
        <FlexChild className={boardStyle.title_box}>
          <h3>이벤트</h3>
        </FlexChild>
        <GalleryTable initCondition={initCondition} initNotices={initNotices} />
      </VerticalFlex>
    </>
  );
}
