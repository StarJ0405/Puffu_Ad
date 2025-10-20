import VerticalFlex from "@/components/flex/VerticalFlex";
import boardStyle from "../../boardGrobal.module.css";

import { BestReviewSlider, BoardTitleBox, GalleryTable } from "./client";

export default async function PhotoReview() {
  return (
    <>
      <VerticalFlex className={boardStyle.board_frame} gap={40}>
        <BoardTitleBox />

        <BestReviewSlider id={"best_review"} />

        <GalleryTable />
      </VerticalFlex>
    </>
  );
}
