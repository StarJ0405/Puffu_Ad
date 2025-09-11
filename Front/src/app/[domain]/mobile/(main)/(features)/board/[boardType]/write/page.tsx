import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from "../boardGrobal.module.css";

import { WriteFrame } from "./client";
import { Params } from "next/dist/server/request/params";

export default async function BoardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { boardType} = await params
  // boardType에 따라 한글 제목 매핑
  const boardTitleMap: Record<string, string> = {
    notice: "공지사항",
    event: "이벤트",
    inquiry: "1:1 문의",
  };

  const title = boardTitleMap[boardType as string] ?? "게시판";

  return (
    <VerticalFlex className={boardStyle.board_frame}>
      <FlexChild className={boardStyle.board_titleBox}>
        <h3>{title}</h3>
      </FlexChild>

      <WriteFrame />
    </VerticalFlex>
  );
}
