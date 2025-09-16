import FlexChild from "@/components/flex/FlexChild";
import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from "../../boardGrobal.module.css";

import { WriteFrame } from "./client";
import { Params } from "next/dist/server/request/params";

export default async function WritePage() {

  return (
    <VerticalFlex className={boardStyle.board_frame}>
      <FlexChild className={boardStyle.board_titleBox}>
        <h3>1:1문의</h3>
      </FlexChild>

      <WriteFrame />
    </VerticalFlex>
  );
}
