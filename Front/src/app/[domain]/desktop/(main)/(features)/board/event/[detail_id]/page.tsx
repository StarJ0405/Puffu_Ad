import notFound from "@/app/not-found";
import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import { requester } from "@/shared/Requester";
import { Params } from "next/dist/server/request/params";
import boardStyle from "../../boardGrobal.module.css";
import { DetailFrame } from "./client";

export default async function ({ params }: { params: Promise<Params> }) {
  const { detail_id } = await params;
  const initNotice = await requester.getNotice(detail_id as string);
  if (initNotice?.content?.type !== "이벤트") return notFound();

  return (
    <VerticalFlex className={boardStyle.board_frame}>
      <FlexChild className={boardStyle.board_titleBox}>
        <h3>이벤트</h3>
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
