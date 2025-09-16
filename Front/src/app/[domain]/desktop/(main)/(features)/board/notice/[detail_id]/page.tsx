import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from "../../boardGrobal.module.css";

import { DetailFrame } from "./client";
import { Params } from "next/dist/server/request/params";
import { requester } from "@/shared/Requester";

export default async function ({ params }: { params: Promise<Params> }) {
  const { detail_id } = await params;
  const initNotice = await requester.getNotice(detail_id as string);

  return (
    <VerticalFlex className={boardStyle.board_frame}>
      <FlexChild className={boardStyle.board_titleBox}>
        <h3>공지사항</h3>
      </FlexChild>

      <FlexChild>
        <DetailFrame initNotice={initNotice} />
      </FlexChild>

      {/* <FlexChild>
            <CommentFrame />
         </FlexChild> */}

      {/* 일단 보류*/}
      {/* <FlexChild marginTop={60}>
            <BoardTable />
         </FlexChild> */}
    </VerticalFlex>
  );
}
