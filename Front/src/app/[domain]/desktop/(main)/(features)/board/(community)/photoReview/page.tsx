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
import styles from './photoReview.module.css'
import boardStyle from "../../boardGrobal.module.css"

import { BoardTitleBox, BestReviewSlider, GalleryTable } from "./client";
import ChoiceChild from "@/components/choice/ChoiceChild";
import ChoiceGroup from "@/components/choice/ChoiceGroup";

export default async function PhotoReview() {

   return (
      <>
         <VerticalFlex className={boardStyle.board_frame}>
            <BoardTitleBox />

            <VerticalFlex className={styles.best_review_box}>
               <FlexChild className={styles.title}>
                  <P className="SacheonFont">사용후기 베스트</P>
               </FlexChild>

               <FlexChild className={styles.slide_body}>
                  <BestReviewSlider id={'best_review'} />
               </FlexChild>
            </VerticalFlex>

            <GalleryTable />
         </VerticalFlex>
      </>
   )


}