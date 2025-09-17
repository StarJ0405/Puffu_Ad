import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from "../boardGrobal.module.css";

import { requester } from "@/shared/Requester";
import { BoardTable, BoardTitleBox } from "./client";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "" } = await searchParams;
  const initCondition: { type: string; pageSize: number; q?: string } = {
    type: "일반",
    pageSize: 10,
  };

  if (q) {
    initCondition.q = q as string;
  }

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
