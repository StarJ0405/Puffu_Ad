import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from "../boardGrobal.module.css";

import { requester } from "@/shared/Requester";
import { BoardTable, BoardTitleBox } from "./client";

export default async function ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const q = searchParams?.q || "";
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
