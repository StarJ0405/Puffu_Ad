import Button from "@/components/buttons/Button";
import Div from "@/components/div/Div";
import Container from "@/components/container/Container";
import Center from "@/components/center/Center";
import Input from "@/components/inputs/Input";
import FlexChild from "@/components/flex/FlexChild";
import HorizontalFlex from "@/components/flex/HorizontalFlex";
import VerticalFlex from "@/components/flex/VerticalFlex";
import CheckboxAll from "@/components/choice/checkbox/CheckboxAll";
import CheckboxChild from "@/components/choice/checkbox/CheckboxChild";
import CheckboxGroup from "@/components/choice/checkbox/CheckboxGroup";
import Icon from "@/components/icons/Icon";
import Image from "@/components/Image/Image";
import InputNumber from "@/components/inputs/InputNumber";
import P from "@/components/P/P";
import Span from "@/components/span/Span";
import Link from "next/link";

import clsx from "clsx";
import style from './page.module.css'
import boardStyle from "../boardGrobal.module.css";


import { WriteFrame } from "./client";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";

export default function BoardPage({
  params,
}: {
  params: { boardType: string };
}) {
  // boardType에 따라 한글 제목 매핑
  const boardTitleMap: Record<string, string> = {
    notice: "공지사항",
    event: "이벤트",
    inquiry: "1:1 문의",
  };

  const title = boardTitleMap[params.boardType] ?? "게시판";

  return (
    <VerticalFlex className={boardStyle.board_frame}>
      <FlexChild className={boardStyle.board_titleBox}>
        <h3>{title}</h3>
      </FlexChild>

      <WriteFrame />
    </VerticalFlex>
  );
}
